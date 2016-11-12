var snapshotID = 'snap-adf1ffb5';
var imageID = 'ami-34487c5e';
var oracles_intact = false; //must be explicitely set to true

var oracle = 
{'name':'tlsnotarygroup3',
	"IP":"54.227.225.238",
	"port":"10011",
'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAIHZGACNJKBHFWOTQ&Action=DescribeInstances&Expires=2019-01-01&InstanceId=i-116f938e&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=GtUlBN9osnSVBfjX59pY7g4WRdflB4kmOYlaWK%2BOAdM%3D',
'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAIHZGACNJKBHFWOTQ&Action=DescribeVolumes&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-6f296fbc&Signature=DO34kDbZCMrwu8nrl83%2FcZLJWDiTmS2baiH3YhsZPp0%3D',
'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAIHZGACNJKBHFWOTQ&Action=GetConsoleOutput&Expires=2019-01-01&InstanceId=i-116f938e&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=910BiXYh5tMjAY2v8AzOG4XM5tuR19rcZH8x8PdIz8Q%3D',
'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAIHZGACNJKBHFWOTQ&Action=GetUser&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=C%2B2l1fpHxTt4p0JnROsu%2FMLlOnAJBjQ%2FS%2B8p%2FumAcH0%3D',
'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAIHZGACNJKBHFWOTQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2019-01-01&InstanceId=i-116f938e&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=W5V6g1I6Mx96vuM199E9C8ZfjEktmcB2GqI87xG8XnI%3D',
	'instanceId': 'i-116f938e',
	'modulus':[170,96,41,181,35,136,219,50,10,170,29,118,195,38,35,77,126,73,148,156,240,80,165,98,30,130,48,106,157,72,105,176,38,232,92,195,47,151,241,197,75,58,121,2,166,242,77,93,2,76,246,143,121,159,55,30,156,168,107,115,122,34,105,157,203,60,147,204,94,252,38,230,114,186,54,113,79,90,96,138,23,76,25,62,86,161,1,124,28,32,16,54,91,225,221,206,219,146,167,180,4,51,221,5,6,128,130,97,115,130,250,197,94,120,61,93,152,58,136,171,218,252,222,90,171,41,194,36,63,133,247,31,244,92,13,79,198,88,77,91,98,50,213,39,171,148,134,223,218,75,67,233,8,28,4,179,22,210,233,109,203,54,139,204,27,156,220,174,228,57,194,81,89,13,2,209,238,37,21,3,138,161,137,138,111,133,97,204,114,20,199,15,96,87,15,196,221,78,233,56,12,86,78,139,118,26,27,117,187,205,202,91,144,81,207,61,239,1,116,78,25,130,3,192,226,84,213,125,120,37,8,49,16,203,154,66,107,160,255,181,193,56,195,93,54,124,84,207,227,226,125,56,246,161,2,166,179,250,43,248,7,85,208,12,60,239,47,131,21,124,144,237,101,221,48,41,2,13,11,31,232,220,14,134,224,200,196,32,124,203,181,253,95,235,148,33,190,103,42,152,126,102,231,155,251,88,90,81,220,251,147,121,136,135,122,142,99,178,98,104,46,129,22,196,187,169,172,121,30,221,228,8,253,132,166,62,80,107,202,205,52,2,169,66,111,167,80,30,164,226,108,45,156,171,42,202,31,41,35,62,51,149,124,91,125,59,155,224,139,18,73,33,121,119,80,7,233,119,66,151,180,34,215,51,92,79,36,52,182,93,93,132,179,33,189,114,143,219,200,8,150,205,194,229,235,46,67,98,34,94,184,238,42,18,160,144,8,185,51,52,216,117,243,97,197,56,154,241,90,236,45,95,178,168,32,85,51,214,10,146,231,27,52,113,110,181,10,232,46,116,165,133,184,14,247,169,101,101,49,76,138,7,119,175,219,100,116,113,18,213,234,116,32,9,226,220,242,247,47,169,104,215,21,132,128,8,70,174,252,129,100,31,157,7,151,158,191,246,155,22,246,251,20,118,252,81,60,31,151,67,188,55]
}


//there can be potentially multiple oracles to choose from
var oracles = [];
oracles.push(oracle);
//all servers trusted to perform notary (including non-oracles)
//TODO: configurable
var pagesigner_servers = [oracle];

//assuming both events happened on the same day, get the time
//difference between them in seconds
//the time string looks like "2015-04-15T19:00:59.000Z"
function getSecondsDelta (later, sooner){
	assert (later.length == 24);
	if (later.slice(0,11) !== sooner.slice(0, 11)){
		return 999999; //not on the same day
	}
	var laterTime = later.slice(11,19).split(':');
	var soonerTime = sooner.slice(11,19).split(':');
	var laterSecs = parseInt(laterTime[0])*3600+parseInt(laterTime[1])*60+parseInt(laterTime[2]);
	var soonerSecs = parseInt(soonerTime[0])*3600+parseInt(soonerTime[1])*60+parseInt(soonerTime[2]);
	return laterSecs - soonerSecs;
}



function modulus_from_pubkey(pem_pubkey){
	var b64_str = '';
	var lines = pem_pubkey.split('\n');
	//omit header and footer lines
	for (var i=1; i < (lines.length-1); i++){
		b64_str += lines[i];
	}
	var der = b64decode(b64_str);
	//last 5 bytes are 2 DER bytes and 3 bytes exponent, our pubkey is the preceding 512 bytes
	var pubkey = der.slice(der.length - 517, der.length -5);
	return pubkey;
}


function checkDescribeInstances(xmlDoc, instanceId, IP){
	try{
	var rs = xmlDoc.getElementsByTagName('reservationSet');
	assert(rs.length === 1);
	var rs_items = rs[0].children;
	assert(rs_items.length === 1);
	var ownerId = rs_items[0].getElementsByTagName('ownerId')[0].textContent;
	var isets = rs_items[0].getElementsByTagName('instancesSet');
	assert(isets.length === 1);
	var instances = isets[0].children;
	assert(instances.length === 1);
	var parent = instances[0];
	assert(parent.getElementsByTagName('instanceId')[0].textContent === instanceId);
	assert(parent.getElementsByTagName('imageId')[0].textContent === imageID);
	assert(parent.getElementsByTagName('instanceState')[0].getElementsByTagName('name')[0].textContent === 'running');
	var launchTime = parent.getElementsByTagName('launchTime')[0].textContent;
	assert(parent.getElementsByTagName('ipAddress')[0].textContent === IP);
	assert(parent.getElementsByTagName('rootDeviceType')[0].textContent === 'ebs');
	assert(parent.getElementsByTagName('rootDeviceName')[0].textContent === '/dev/xvda');
	var devices = parent.getElementsByTagName('blockDeviceMapping')[0].getElementsByTagName('item');
	assert(devices.length === 1);
	assert(devices[0].getElementsByTagName('deviceName')[0].textContent === '/dev/xvda');
	assert(devices[0].getElementsByTagName('ebs')[0].getElementsByTagName('status')[0].textContent === 'attached');
	var volAttachTime = devices[0].getElementsByTagName('ebs')[0].getElementsByTagName('attachTime')[0].textContent;
	var volumeId = devices[0].getElementsByTagName('ebs')[0].getElementsByTagName('volumeId')[0].textContent;
	//get seconds from "2015-04-15T19:00:59.000Z"
	assert(getSecondsDelta(volAttachTime, launchTime) <= 3);
	assert(parent.getElementsByTagName('virtualizationType')[0].textContent === 'hvm');	
	}catch(e){
		return false;
	}
	return {'ownerId':ownerId, 'volumeId':volumeId, 'volAttachTime':volAttachTime, 'launchTime':launchTime};
}


function checkDescribeVolumes(xmlDoc, instanceId, volumeId, volAttachTime){
	try{	
	var volumes = xmlDoc.getElementsByTagName('volumeSet')[0].children;
	assert(volumes.length === 1);
	var volume = volumes[0];
	assert(volume.getElementsByTagName('volumeId')[0].textContent === volumeId);
	assert(volume.getElementsByTagName('snapshotId')[0].textContent === snapshotID);
	assert(volume.getElementsByTagName('status')[0].textContent === 'in-use');
	var volCreateTime = volume.getElementsByTagName('createTime')[0].textContent;
	var attVolumes = volume.getElementsByTagName('attachmentSet')[0].getElementsByTagName('item');
	assert(attVolumes.length === 1);
	var attVolume = attVolumes[0];
	assert(attVolume.getElementsByTagName('volumeId')[0].textContent === volumeId);
	assert(attVolume.getElementsByTagName('instanceId')[0].textContent === instanceId);
	assert(attVolume.getElementsByTagName('device')[0].textContent === '/dev/xvda');
	assert(attVolume.getElementsByTagName('status')[0].textContent === 'attached');
	var attTime = attVolume.getElementsByTagName('attachTime')[0].textContent;
	assert(volAttachTime === attTime);
	//Crucial: volume was created from snapshot and attached at the same instant
	//this guarantees that there was no time window to modify it
	assert(getSecondsDelta(attTime, volCreateTime) === 0);	
	}catch(e){
		return false;
	}
	return true;
}


function checkGetConsoleOutput(xmlDoc, instanceId, launchTime){
	try{
	assert(xmlDoc.getElementsByTagName('instanceId')[0].textContent === instanceId);
	var timestamp = xmlDoc.getElementsByTagName('timestamp')[0].textContent;
	//prevent funny business: last consoleLog entry no later than 5 minutes after instance starts
	assert(getSecondsDelta(timestamp, launchTime) <= 300);
	var b64data = xmlDoc.getElementsByTagName('output')[0].textContent;
	var logstr = ba2str(b64decode(b64data));
	var sigmark = 'PageSigner public key for verification';
	var pkstartmark = '-----BEGIN PUBLIC KEY-----';
	var pkendmark = '-----END PUBLIC KEY-----';
		
	var mark_start = logstr.search(sigmark);
	assert(mark_start !== -1);
	var pubkey_start = mark_start + logstr.slice(mark_start).search(pkstartmark);
	var pubkey_end = pubkey_start+ logstr.slice(pubkey_start).search(pkendmark) + pkendmark.length;
	var pk = logstr.slice(pubkey_start, pubkey_end);
	assert(pk.length > 0);
	return pk;
	}catch(e){
		return false;
	}
}

// "userData" allows to pass an arbitrary script to the instance at launch. It MUST be empty.
// This is a sanity check because the instance is stripped of the code which parses userData.	
function checkDescribeInstanceAttribute(xmlDoc, instanceId){
	try{
	assert(xmlDoc.getElementsByTagName('instanceId')[0].textContent === instanceId);
	assert(xmlDoc.getElementsByTagName('userData')[0].textContent === "");
	}catch(e){
		return false;
	}
	return true;
}


function checkGetUser(xmlDoc, ownerId){
	try{
	assert(xmlDoc.getElementsByTagName('UserId')[0].textContent === ownerId);
	assert(xmlDoc.getElementsByTagName('Arn')[0].textContent.slice(-(ownerId.length + ':root'.length)) === ownerId+':root');
	}catch(e){
		return false;
	}
	return true;
}


function check_oracle(o){
	return new Promise(function(resolve, reject) {
		var xhr = get_xhr();
		xhr.open('GET', o.DI, true);
		xhr.onload = function(){
			var xmlDoc = xhr.responseXML;
			var result = checkDescribeInstances(xmlDoc, o.instanceId, o.IP);
			if (!result){
				reject('checkDescribeInstances');
			}
			else {
				resolve(result);
			}
		};
		xhr.send();
	})
	.then(function(args){
		return new Promise(function(resolve, reject) {
			var xhr = get_xhr();
			xhr.open('GET', o.DV, true);
			xhr.onload = function(){
				var xmlDoc = xhr.responseXML;
				var result = checkDescribeVolumes(xmlDoc, o.instanceId, args.volumeId, args.volAttachTime);
				if (!result){
					reject('checkDescribeVolumes');
				}
				else {
					resolve({'ownerId':args.ownerId, 'launchTime':args.launchTime});
				}
			};
			xhr.send();
		});
	})
	.then(function(args){
		return new Promise(function(resolve, reject) {
			var xhr = get_xhr();
			xhr.open('GET', o.GU, true);
			xhr.onload = function(){
				var xmlDoc = xhr.responseXML;
				var result = checkGetUser(xmlDoc, args.ownerId);
				if (!result){
					reject('checkGetUser');
				}
				else {
					resolve(args.launchTime);
				}
			};
			xhr.send();
		});
	})
	.then(function(launchTime){
		return new Promise(function(resolve, reject) {
			var xhr = get_xhr();
			xhr.open('GET', o.GCO, true);
			xhr.onload = function(){
				var xmlDoc = xhr.responseXML;
				var result = checkGetConsoleOutput(xmlDoc, o.instanceId, launchTime);
				if (!result){
					reject('checkGetConsoleOutput');
				}
				else {
					if (modulus_from_pubkey(result).toString() !== o.modulus.toString()){
						reject('modulus_from_pubkey');
					}
					resolve();
				}
			};
			xhr.send();
		});
	})
	.then(function(){
		return new Promise(function(resolve, reject) {
			var xhr = get_xhr();
			xhr.open('GET', o.DIA, true);
			xhr.onload = function(){
				var xmlDoc = xhr.responseXML;
				var result = checkDescribeInstanceAttribute(xmlDoc, o.instanceId);
				if (!result){
					reject('checkDescribeInstanceAttribute');
				}
				else {
					resolve();
				}
			};
			xhr.send();
		});
	})
	.then(function(){
		var mark = 'AWSAccessKeyId=';
		var start;
		var id;
		var ids = [];
		//"AWSAccessKeyId" should be the same to prove that the queries are made on behalf of AWS user "root".
		//The attacker can be a user with limited privileges for whom the API would report only partial information.
		for (var url in [o.DI, o.DV, o.GU, o.GCO, o.DIA]){
			start = url.search(mark)+mark.length;
			id = url.slice(start, start + url.slice(start).search('&'));
			ids.push(id);
		}
		assert(new Set(ids).size === 1);
		console.log('oracle verification successfully finished');		
	});
}


