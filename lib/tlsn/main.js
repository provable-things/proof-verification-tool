var script_exception;
try {	
var random_uid; //we get a new uid for each notarized page
var reliable_sites = []; //read from content/pubkeys.txt
var previous_session_start_time; // used to make sure user doesnt exceed rate limiting
var chosen_notary;
var tdict = {}; 
var valid_hashes = [];
var os_win = false; //is OS windows? used to fix / in paths 
var browser_init_finished = false; //signal to test script when it can start


function init(){
	getPref('verbose', 'bool')
	.then(function(value){
		if (value !== true && !is_chrome){
			console.log = function(){};
		}
		return getPref('fallback', 'bool');
	})
	.then(function(value){
		if (value === true){
			//TODO this should be configurable, e.g. choice from list
			//or set in prefs
			chosen_notary = pagesigner_servers[1];
			oracles_intact = true;
		}
		else {
			chosen_notary = oracles[Math.random()*(oracles.length) << 0];
			var oracle_hash = ba2hex(sha256(JSON.stringify(chosen_notary)));
			var was_oracle_verified = false;
			getPref('verifiedOracles.'+oracle_hash, 'bool')
			.then(function(value){
				if (value === true){
					oracles_intact = true;
				}
				else {
					//async check oracles and if the check fails, sets a global var
					//which prevents notarization session from running
					console.log('oracle not verified');
					check_oracle(chosen_notary)
					.then(function success(){
						return setPref('verifiedOracles.'+oracle_hash, 'bool', true);
					})
					.then(function (){
						oracles_intact = true;
					})
					.catch(function(err){
						console.log('caught error', err);
						//query for a new oracle
						//TODO fetch backup oracles list
					});
				}
			});
		}
		import_reliable_sites();
		startListening();
		browser_init_finished = true;
	});
}


function parse_reliable_sites(text){
	var lines = text.split('\n');
	var name = "";
	var expires = "";
	var modulus = [];
	var i = -1;
	var x;
	var mod_str;
	var line;
	while (true){
		i += 1;
		if (i >= lines.length){
			break;
		}
		x = lines[i];
		if (x.startsWith('#')){
			continue;
		}
		else if (x.startsWith('Name=')){
			name = x.slice('Name='.length);
		}
		else if (x.startsWith('Expires=')){
			expires = x.slice('Expires='.length);
		}
		else if (x.startsWith('Modulus=')){
			mod_str = '';
			while (true){
				i += 1;
				if (i >= lines.length){
					break;
				}
				line = lines[i];
				if (line === ''){
					break;
				}
				mod_str += line;
			}
			modulus = [];
			var bytes = mod_str.split(' ');
			for (var j=0; j < bytes.length; j++){
				if (bytes[j] === ''){
					continue;
				}
				modulus.push( hex2ba(bytes[j])[0] );
			}
			//Don't use pubkeys which expire less than 3 months from now
			var ex = expires.split('/');
			var extime = new Date(parseInt(ex[2]), parseInt(ex[0])-1, parseInt(ex[1]) ).getTime();
			var now = new Date().getTime();
			if ( (extime - now) < 1000*60*60*24*90){
				continue;
			}
			reliable_sites.push( {'name':name, 'port':443, 'expires':expires, 'modulus':modulus} );		
			}
		}	
}


//callback is used in testing to signal when this page's n10n finished
function startNotarizing(callback){
	if (! oracles_intact){
		sendAlert({title:'PageSigner error', text:'Cannot notarize because something is wrong with PageSigner server. Please try again later'});
		return;
	}
	var modulus;
	var certsha256;
	var headers, server, port, chain;
	getHeaders()
	.then(function(obj){
		headers = obj.headers;
		server = obj.server;
		port = obj.port;
		loadBusyIcon();
		return get_certificate(server, port);
	})
	.then(function(certchain){
		chain = certchain;
		if (! verifyCert(chain)){
			sendAlert({title:"PageSigner error", text:"This website cannot be audited by PageSigner because it presented an untrusted certificate"});
			return;
		}
		modulus = getModulus(chain[0]);
		certsha256 = sha256(chain[0]);
		random_uid = Math.random().toString(36).slice(-10);
		previous_session_start_time = new Date().getTime();
		//loop prepare_pms 10 times until succeeds
		return new Promise(function(resolve, reject) {
			var tries = 0;
			var loop = function(resolve, reject){
				tries += 1;
				prepare_pms(modulus).then(function(args){
					resolve(args);
				}).catch(function(error){
					console.log('caught error', error);
					if (error.startsWith('Timed out')){
						reject(error);
						return;
					}
					if (error != 'PMS trial failed'){
						reject('in prepare_pms: caught error ' + error);
						return;
					}
					if (tries == 10){
						reject('Could not prepare PMS after 10 tries');
						return;
					}
					//else PMS trial failed
					loop(resolve, reject);
				});
			};
			loop(resolve, reject);
		});
	})
	.then(function(args){
		return start_audit(modulus, certsha256, server, port, headers, args[0], args[1], args[2]);
	})
	.then(function(args2){
		return save_session_and_open_data(args2, server);
	})
	.then(function(){
		//testing only
		if (testing){
			callback();
		}
		loadNormalIcon();
	})
	.catch(function(err){
	 //TODO need to get a decent stack trace
	 	loadNormalIcon();
		console.log('There was an error: ' + err);
		if (err === "Server sent alert 2,40"){
			sendAlert({title:'PageSigner error', text:'Pagesigner is not compatible with this website because the website does not use RSA ciphersuites'});
		}
		else if (err.startsWith('Timed out waiting for notary server to respond') &&
			((new Date().getTime() - previous_session_start_time) < 60*1000) ){
			sendAlert ({title:'PageSigner error', text:'You are signing pages way too fast. Please retry in 60 seconds'});
		}
		else {
			sendAlert({title:'PageSigner error', text:err});
		}
	});
}



function save_session_and_open_data(args, server){
	assert (args.length === 18, "wrong args length");
	var cipher_suite = args[0];
	var client_random = args[1];
	var server_random = args[2];
	var pms1 = args[3];
	var pms2 = args[4];
	var server_certchain = args[5];
	var tlsver = args[6];
	var initial_tlsver = args[7];
	var fullresp_length = args[8];
	var fullresp = args[9];
	var IV_after_finished_length = args[10];
	var IV_after_finished = args[11];
	var notary_modulus_length = args[12];
	var signature = args[13];
	var commit_hash = args[14];
	var notary_modulus = args[15];
	var data_with_headers = args[16];
	var time = args[17];
	
	var server_chain_serialized = []; //3-byte length prefix followed by cert
	for (var i=0; i < server_certchain.length; i++){
		var cert = server_certchain[i];
		server_chain_serialized = [].concat(
			server_chain_serialized,
			bi2ba(cert.length, {'fixed':3}),
			cert);
	}
	
	var pgsg = [].concat(
			str2ba('tlsnotary notarization file\n\n'),
			[0x00, 0x02],
			bi2ba(cipher_suite, {'fixed':2}),
			client_random,
			server_random,
			pms1,
			pms2,
			bi2ba(server_chain_serialized.length, {'fixed':3}),
			server_chain_serialized,
			tlsver,
			initial_tlsver,
			bi2ba(fullresp_length, {'fixed':8}),
			fullresp,
			bi2ba(IV_after_finished_length, {'fixed':2}),
			IV_after_finished,
			bi2ba(notary_modulus_length, {'fixed':2}),
			signature,
			commit_hash,
			notary_modulus,
			time);
			
	var commonName = getCommonName(server_certchain[0]);
	var sdir;
	return makeSessionDir(server).
	then(function(dir){
		sdir = dir;
		return writeDatafile(data_with_headers, sdir);
	})
	.then(function(){
		return writePgsg(pgsg, sdir, commonName);
	})
	.then(function(){
		return openTabs(sdir);
	})
	.then(function(){
		updateCache(sha256(pgsg));
		populateTable(); //refresh manager
	});
}


//data_with_headers is a string
function writeDatafile(data_with_headers, session_dir){
	return new Promise(function(resolve, reject) {
		var rv = data_with_headers.split('\r\n\r\n');
		var headers = rv[0];
		var data = rv.splice(1).join('\r\n\r\n'); 
		var dirname = session_dir.split('/').pop();
		var header_lines = headers.split('\r\n');
		var type = 'html';
		for(var i=0; i < header_lines.length; i++){
			if (header_lines[i].search(/content-type:\s*/i) > -1){
				if (header_lines[i].search("html") > -1){
					type = 'html';
					break;
				}
				else if (header_lines[i].search("xml") > -1){
					type = 'xml';
					break;
				}
				else if (header_lines[i].search("json") > -1){
					type = 'json';
					break;
				}
				else if (header_lines[i].search("pdf") > -1){
					type = 'pdf';
					break;
				}
				else if (header_lines[i].search("zip") > -1){
					type = 'zip';
					break;
				}
			}
		}
		if (type === "html"){
			//html needs utf-8 byte order mark
			data = [].concat([0xef, 0xbb, 0xbf], str2ba(data));
		}
		else {
			data = str2ba(data);
		}
		writeFile(dirname, 'metaDataFilename', str2ba('data.'+type))
		.then(function(){
			return writeFile(dirname, 'data.'+type, data);
		})
		.then(function(){
			return writeFile(dirname, 'raw.txt', str2ba(data_with_headers));
		})
		.then(function(){
			resolve();
		});
	});
}



function writePgsg(pgsg, session_dir, commonName){
	return new Promise(function(resolve, reject) {
		var dirname = session_dir.split('/').pop();
		var name = commonName.replace(/\*\./g,""); 	
		writeFile(dirname, 'pgsg.pgsg', pgsg)
		.then(function(){
			return writeFile(dirname, 'meta', str2ba(name));
		})
		.then(function(){
			return writeFile(dirname, 'metaDomainName', str2ba(commonName));
		})
		.then(function(){
			resolve();
		});
	});
}



//imported_data is an array of numbers
function verify_tlsn(data, from_past){
	var offset = 0;
	if (ba2str(data.slice(offset, offset+=29)) !== "tlsnotary notarization file\n\n"){
		throw('wrong header');
	}
	if(data.slice(offset, offset+=2).toString() !== [0x00, 0x02].toString()){
		throw('wrong version');
	}
	var cs = ba2int(data.slice(offset, offset+=2));
	var cr = data.slice(offset, offset+=32);
	var sr = data.slice(offset, offset+=32);
	var pms1 = data.slice(offset, offset+=24);
	var pms2 = data.slice(offset, offset+=24);
	var chain_serialized_len = ba2int(data.slice(offset, offset+=3));
	var chain_serialized = data.slice(offset, offset+=chain_serialized_len);
	var tlsver = data.slice(offset, offset+=2);
	var tlsver_initial = data.slice(offset, offset+=2);
	var response_len = ba2int(data.slice(offset, offset+=8));
	var response = data.slice(offset, offset+=response_len);
	var IV_len = ba2int(data.slice(offset, offset+=2));
	var IV = data.slice(offset, offset+=IV_len);
	var sig_len = ba2int(data.slice(offset, offset+=2));
	var sig = data.slice(offset, offset+=sig_len);
	var commit_hash = data.slice(offset, offset+=32);
	var notary_pubkey = data.slice(offset, offset+=sig_len);
	var time = data.slice(offset, offset+=4);
	assert (data.length === offset, 'invalid .pgsg length');
	
	offset = 0;
	var chain = []; //For now we only use the 1st cert in the chain
	while(offset < chain_serialized.length){
		var len = ba2int(chain_serialized.slice(offset, offset+=3));
		var cert = chain_serialized.slice(offset, offset+=len);
		chain.push(cert);
	}
	
	var commonName = getCommonName(chain[0]);
	//verify cert
	if (!verifyCert(chain)){
		throw ('certificate verification failed');
	}
	var modulus = getModulus(chain[0]);
	//verify commit hash
	if (sha256(response).toString() !== commit_hash.toString()){
		throw ('commit hash mismatch');
	}
	//verify sig
	var signed_data = sha256([].concat(commit_hash, pms2, modulus, time));
	var signing_key;
	if (from_past){signing_key = notary_pubkey;}
	else {signing_key = chosen_notary.modulus;}
	if (!verify_commithash_signature(signed_data, sig, signing_key)){
		throw ('notary signature verification failed');
	}
	
	//decrypt html and check MAC
	var s = new TLSNClientSession();
	s.__init__();
	s.unexpected_server_app_data_count = response.slice(0,1);
	s.chosen_cipher_suite = cs;
	s.client_random = cr;
	s.server_random = sr;
	s.auditee_secret = pms1.slice(2, 2+s.n_auditee_entropy);
	s.initial_tlsver = tlsver_initial;
	s.tlsver = tlsver;
	s.server_modulus = modulus;
	s.set_auditee_secret();
	s.auditor_secret = pms2.slice(0, s.n_auditor_entropy);
	s.set_auditor_secret();
	s.set_master_secret_half(); //#without arguments sets the whole MS
	s.do_key_expansion(); //#also resets encryption connection state
	s.store_server_app_data_records(response.slice(1));
	s.IV_after_finished = IV;
	s.server_connection_state.seq_no += 1;
	s.server_connection_state.IV = s.IV_after_finished;
	html_with_headers = decrypt_html(s);
	return [html_with_headers,commonName, data, notary_pubkey];
}


//imported_data is an array of numbers
function verify_tlsn_and_show_data(imported_data, create){
	try{
		var a = verify_tlsn(imported_data, create);
	}
	catch (e){
		sendAlert({title:'PageSigner failed to import file', text:'The error was: ' + e});
		return;
	}
	if (create){
		var data_with_headers = a[0];
		var commonName = a[1];
		var imported_data = a[2];
		var session_dir;
		makeSessionDir(commonName, true)
		.then(function(sdir){
			session_dir = sdir;
			return writeDatafile(data_with_headers, session_dir);
		})
		.then(function(){
			return writePgsg(imported_data, session_dir, commonName);
		})
		.then(function(){
			return openTabs(session_dir);
		})
		.then(function(){
			updateCache(sha256(imported_data));
			populateTable(); //refresh manager
		})
		.catch( function(error){
			console.log("got error in vtsh: "+error);
		});
	}
}


function populateTable(){
	var prev_tdict = tdict;
	tdict = {};
	var entries = [];
	var promises = [];
	getDirContents('/')
	.then(function(results){
		return new Promise(function(resolve, reject) {
			
			var returnPromise = function(dir){
				return new Promise(function(resolve, reject) {
					getModTime(dir)
					.then(function(t){
						var name = getName(dir);
						if (t === prev_tdict[name].modtime){
							tdict[name] = prev_tdict[name];
						}
						else {
							entries.push(name);
						}
						resolve();
					});
				});
			};
			
			for (var i=0; i < results.length; i++){
				if (!isDirectory(results[i])) continue;
				var name = getName(results[i]);
				if (!(name in prev_tdict)){
					entries.push(name);
					continue;
				}
				promises.push(returnPromise(results[i]));
			}
			resolve(Promise.all(promises));
		});
	})
	.then(function(){
		//boiled down the entries to new dirs only
		process_entries(entries);
	});
}


function process_entries(pgsg_subdirs){
	
	var returnPromise = function(dir){
		return new Promise(function(resolve, reject){
			getDirEntry(dir)
			.then(function(dirEntry){
				console.log('about to process_subdir');
				resolve(process_subdir(dirEntry));
			}).
			catch(function(e){
				console.log('what:', e);	
			});
		});
	};	
	
	var promises = [];
	for (var i=0; i < pgsg_subdirs.length; i++){
		var subdir = pgsg_subdirs[i];
		promises.push(returnPromise(subdir));
	}
	Promise.all(promises)
	.then(function(){
		//console.log('about to sendTable', tdict);
		sendTable();	
	})
	.catch(function(e){
		console.log('promise rejection', e);
	});
}


function process_subdir(dirEntry){
	return new Promise(function(resolve, reject) {	
		var imported = false;
		var displayName;
		var pgsg;
		var file_hash;
		var dirname = getName(dirEntry);
		var dirpath = getFullPath(dirEntry);
		if (dirname.match("-IMPORTED$")=="-IMPORTED"){ 
			imported = true;
		}
		getFileContent(dirname, 'meta')
		.then(function(name){
			displayName = ba2str(name);
			return getFileContent(dirname, 'pgsg.pgsg');
		})
		.then(function(raw){
			pgsg = raw;
			file_hash = sha256(pgsg);
			return getModTime(dirEntry);
		})
		.then(function(modtime){
			tdict[dirname] =
				{'name':displayName,
				'imported':imported,
				'dirURL':dirpath,
				'hash':file_hash,
				'pgsg':pgsg,
				'modtime':modtime};
				resolve('ok');
		})
		.catch(function(e){
			//we must resolve even on error because of Promise.all()
			resolve(e);
		});
	});
}


//Also check validity of pgsg before sending
function sendTable(){
	var rows = [];
	for (var key in tdict){
		var row = tdict[key];
		var is_valid = false;
		if (valid_hashes.indexOf(row.hash.toString()) > -1){
			is_valid = true;
		}
		else { //e.g. for some reason the cache was flushed
			try{
				verify_tlsn(row.pgsg, true);
				//if it doesnt throw - the check passed
				is_valid = true;
				updateCache(row.hash);
			}
			catch(e){
				is_valid = false;
			}
		}
		if (os_win) row.dirURL = fixWinPath(row.dirURL);
		rows.push({'name': row.name,
			'imported':row.imported,
			'valid':is_valid,
			'verifier':'tlsnotarygroup1',
			'dir':row.dirURL});
	}
	sendMessage(rows);
}


//invert all slashes and replace spaces with %20
function fixWinPath(path){
	return path.replace(/\\/g,"/").replace(/ /g, "%20");
}


function getModulus(cert){
	  var c = Certificate.decode(new Buffer(cert), 'der');
		var pk = c.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey.data;
		var pkba = ua2ba(pk);
		//expected modulus length 256, 384, 512
		var modlen = 256;
		if (pkba.length > 384) modlen = 384;
		if (pkba.length > 512) modlen = 512;
		var modulus = pkba.slice(pkba.length - modlen - 5, pkba.length -5);
		return modulus;
}


function getCommonName(cert){
	var c = Certificate.decode(new Buffer(cert), 'der');
	var fields = c.tbsCertificate.subject.value;
	for (var i=0; i < fields.length; i++){
		if (fields[i][0].type.toString() !== [2,5,4,3].toString()) continue;
		//first 2 bytes are DER-like metadata
		return ba2str(fields[i][0].value.slice(2));
	}
	return 'unknown';
}


function permutator(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}


function verifyCert(chain){
	var chainperms = permutator(chain);
	for (var i=0; i < chainperms.length; i++){
		if (verifyCertChain(chainperms[i])){
			return true;
		}
	}
	return false;
}





//This must be at the bottom, otherwise we'd have to define each function
//before it gets used.
browser_specific_init();


} catch (e){
	script_exception = e;
}
