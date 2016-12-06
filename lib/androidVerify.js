const test = function(data) {
  const jsonAndroidProof = JSON.parse(ba2str(data).substr(3));
  const jws = jsonAndroidProof['JWS'];

  const requestID = jsonAndroidProof['requestID'];
  const response = jsonAndroidProof['response'];
  const signedResponse = jsonAndroidProof['signature'];
  const jwsArray = jws.split('.');
  const jwsEncoded = parseJWS(jwsArray);
  const jwsDecoded = decodeJWS(jwsArray);
  const googleCert = extractGoogleCert(jwsDecoded.header);

  var x = new KJUR.jws.JWS();
  x.parseJWS(jws)

  //1st test verify jws sig working
  console.log(KJUR.jws.JWS.verify(jws, googleCert.subjectPublicKeyRSA, ['RS256']));

  //2nd step, having issues with b64decode of payload
  var y = new Buffer(JSON.parse(jwsDecoded.payload).nonce, 'base64');
  console.log(y.toString().split("||")[0]);

}

function extractGoogleCert(header) {
  var headerDictionary, googleCertChain, googleCert;
  headerDictionary = JSON.parse(header);
  googleCertChain = headerDictionary['x5c'];
  var cert = new KJUR.X509();
  //console.log(cert);
  cert.readCertPEM(googleCertChain[0]);
  //var key = KJUR.KEYUTIL.getKey(cert);

  //var rsa = new KJUR.RSAKey();
  //console.log(key);
  return cert;
  //console.log(x.getInfo());
  //google_cert = create_pem_encoded_cert(str(google_cert_chain[0]));
  //return x509.load_pem_x509_certificate(google_cert, default_backend());
}

function extractAndroidCertHW(payload) {
  /*var cert = new KJUR.X509();
  cert.readCertPEM(JSON.parse(payload).nonce);
  return cert;*/
}

function jws_verify(jws, cert) {
  input_data = jws.header + "." + jws.payload;
  if (crypto.verify(cert, jws.signature, input_data, "sha256") === null) {
    return true;
  } else {
    return false;
  }
}
const jwsElems = ['header', 'payload', 'signature'];

function parseJWS(array) {
  var obj = {};
  for (var i = 0; i < array.length; i++) {
    obj[jwsElems[i]] = array[i];
  }
  return obj;
}

function decodeJWS(array) {
  var obj = {};
  for (var i = 0; i < array.length; i++) {
    obj[jwsElems[i]] = atob(array[i]);
  }
  return obj;
}
module.exports = { test: test };
