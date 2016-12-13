const r = require('jsrsasign');

const main = function(data) {

  const apkDigest = null;
  const apkCertDigest = null;
  var cborEncodedData = data.slice(3)
  const buf = Buffer.from(cborEncodedData .buffer)
  var androidProof = cbor.decodeFirstSync(buf)
  const requestID = androidProof['requestID'].toString()
  const response = androidProof['HTTPResponse'].toString()
  const signature = androidProof['signature']
  const jwsHeader = androidProof['JWS_Header']
  const jwsPayload = androidProof['JWS_Payload']
  const jwsSignature = androidProof['JWS_Signature']
  const jwsHeaderEncoded = URLSafeBase64.encode(androidProof['JWS_Header'])
  const jwsPayloadEncoded = URLSafeBase64.encode(androidProof['JWS_Payload'])
  const jwsSignatureEncoded = URLSafeBase64.encode(androidProof['JWS_Signature'])
  const jwsArray = [jwsHeaderEncoded, jwsPayloadEncoded, jwsSignatureEncoded]
  const jws =
      jwsHeaderEncoded.concat('.').concat(jwsPayloadEncoded).concat('.').concat(jwsSignatureEncoded)
  const jwsEncoded = parseJWS(jwsArray)
  const jwsDecoded = decodeJWS(jwsArray)
  const googleCert = extractGoogleCert(jwsHeader)
  var isValid = true
  if (!r.jws.JWS.verify(jws, googleCert.subjectPublicKeyRSA, ['RS256'])) {
     isValid = false
  }

  if (!verify_jws_payload(jwsPayload, response, requestID, signature, apkDigest, apkCertDigest)) {
      isValid = false
  }

  console.log("The Android Proof is: ", isValid)
}

function verify_jws_payload(jwsPayload, response, requestID, signature, apkDigest, apkCertDigest) {
    var jwsPayloadJSON = JSON.parse(jwsPayload.toString())

    var md = new r.KJUR.crypto.MessageDigest({alg:"sha256", prov: "cryptojs"})
    md.updateString(response)
    md.updateHex(signature.toString('hex'))
    md.updateString(requestID)
    var digest = md.digest()
    var nonce = new Buffer(digest, 'hex').toString('base64')

    var isValid = true
    if (!jwsPayloadJSON['nonce'] == nonce.toString('base64'))
        isValid = false
    if (!jwsPayloadJSON['apkPackageName'] == 'it.oraclize.androidproof')
        isValid = false
    if (!jwsPayloadJSON['apkDigestSha256'] == apkDigest)
        isValid = false
    if (!jwsPayloadJSON['apkCertificateDigestSha256'] == apkCertDigest)
        isValid = false
    if (!jwsPayloadJSON['basicIntegrity'] == true)
        isValid = false
    return isValid
}

function extractGoogleCert(header) {
  var headerDictionary, googleCertChain, googleCert;
  headerDictionary = JSON.parse(header);
  googleCertChain = headerDictionary['x5c'];
  var cert = new r.X509();
  cert.readCertPEM(googleCertChain[0]);
  return cert;
}
module.exports = { main: main};
