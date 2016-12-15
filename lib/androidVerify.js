var cbor = require('cbor')
var URLSafeBase64 = require('urlsafe-base64')
var r = require('jsrsasign')
var request = require('request')
var asn = require('asn1.js')
var p = require('pkijs')

const main = function(data) {

  const apkDigest = null;
  const apkCertDigest = null;
  var cborEncodedData = data.slice(3)
  const buf = Buffer.from(cborEncodedData.buffer)
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
  const googleCert = extractGoogleCert(jwsHeader)

  Promise.all([
      verify_jws_signature(jws, googleCert),
      verify_jws_payload(jwsPayload, response, requestID, signature, apkDigest, apkCertDigest),
      verify_jws_authenticity(jws),
      check_hardware_attestation_params(),
      verify_hardware_attestation_chain(),
      //check_against_google_crl()
    ])
  .then((data) =>  console.log("The Android Proof is valid " ))
  .catch((err) => console.log("The Android Proof is not valid "))
}

function verify_jws_signature(jws, googleCert) {
    return new Promise((resolve, reject) => {
        if (r.jws.JWS.verify(jws, googleCert.subjectPublicKeyRSA, ['RS256'])) {
            resolve()
        }
        else {
            reject()
        }
    })
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

    return new Promise((resolve, reject) => {
        if (!isValid) {
            return reject()
        }
        resolve()
    })
}

function verify_jws_authenticity(jws) {
    return new Promise((resolve, reject) => {
        var post_data = { 'signedAttestation' : jws}
        request.post(
            'https://www.googleapis.com/androidcheck/v1/attestations/verify?key=AIzaSyCkruvXUsDIVCQubpimWlFFzDFKvv9E71Y',
            { json: post_data },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var google_api_response = JSON.parse(JSON.stringify(body))
                    if (google_api_response['isValidSignature']) {
                        resolve(body)
                    }
                } else {
                    return reject(error)
                }
            }
        )
    })
}

function verify_hardware_attestation_chain() {
    return new Promise((resolve,reject) => {
        var leafPem = fs.readFileSync('./certs/leaf.pem').toString()
        var intermediatePem = fs.readFileSync('./certs/intermediate.pem').toString()
        var rootPem = fs.readFileSync('./certs/root.pem').toString()

        var leafCertificate = new r.X509()
        var intermediateCertificate = new r.X509()
        var rootCertificate = new r.X509()
        leafCertificate.readCertPEM(leafPem)
        intermediateCertificate.readCertPEM(intermediatePem)
        rootCertificate.readCertPEM(rootPem)

        var leafHTbsCert = r.ASN1HEX.getDecendantHexTLVByNthList(leafCertificate.hex, 0, [0])
        var leafAlg = leafCertificate.getSignatureAlgorithmField()
        var leafCertificateSignature = r.X509.getSignatureValueHex(leafCertificate.hex)

        var intHTbsCert = r.ASN1HEX.getDecendantHexTLVByNthList(intermediateCertificate.hex, 0, [0])
        var intAlg = intermediateCertificate.getSignatureAlgorithmField()
        var intCertificateSignature = r.X509.getSignatureValueHex(intermediateCertificate.hex)

        // Verify leaf against intermediate
        var intSig = new r.crypto.Signature({alg: leafAlg})
        intSig.init(intermediatePem)
        intSig.updateHex(leafHTbsCert)

        // Verify against root
        var rootSig = new r.crypto.Signature({alg: intAlg})
        rootSig.init(rootPem)
        rootSig.updateHex(intHTbsCert)

        if (intSig.verify(leafCertificateSignature) &&
            rootSig.verify(intCertificateSignature)) {
            resolve()
        } else {
            reject()
        }
    })
}

function check_hardware_attestation_params() {
    return new Promise((resolve, reject) => {
        const leaf = fs.readFileSync('./certs/leaf.pem')
        var value = r.X509.getHexOfTLV_V3ExtValue(r.X509.pemToHex(leaf.toString()), '1.3.6.1.4.1.11129.2.1.17')
        var RootOfTrust = asn.define('RootOfTrust', function() {
            this.seq().obj(
                this.key('verifiedBootKey').octstr(),
                this.key('deviceLocked').bool(),
                this.key('verifiedBootState').enum({0: 'Verified', 1: 'SelfSigned', 2: 'TrustedEnvironment', 3: 'Failed'})
            )
        })

        var Int = asn.define('Int', function() {
            this.int()
        })

        var AuthorizationList = asn.define('AuthorizationList', function() {
            this.seq().obj(
                this.key('purpose').optional().explicit(1).setof(Int),
                this.key('algorithm').optional().explicit(2).int(),
                this.key('keySize').optional().explicit(3).int(),
                this.key('digest').optional().explicit(5).setof(Int),
                this.key('padding').optional().explicit(6).setof(Int),
                this.key('ecCurve').optional().explicit(10).int(),
                this.key('rsaPublicExponent').optional().explicit(200).int(),
                this.key('activeDateTime').optional().explicit(400).int(),
                this.key('originationExpireDateTime').optional().explicit(401).int(),
                this.key('usageExpireDateTime').optional().explicit(402).int(),
                this.key('noAuthRequired').optional().explicit(503).null_(),
                this.key('userAuthType').optional().explicit(504).int(),
                this.key('authTimeout').optional().explicit(505).int(),
                this.key('allowWhileOnBody').optional().explicit(506).null_(),
                this.key('allApplications').optional().explicit(600).null_(),
                this.key('applicationId').optional().explicit(601).octstr(),
                this.key('creationDateTime').optional().explicit(701).int(),
                this.key('origin').optional().explicit(702).int(),
                this.key('rollbackResistant').optional().explicit(703).null_(),
                this.key('rootOfTrust').optional().explicit(704).use(RootOfTrust),
                this.key('osVersion').optional().explicit(705).int(),
                this.key('osPatchLevel').optional().explicit(706).int(),
                this.key('attestationChallenge').optional().explicit(708).int(),
                this.key('attestationApplicationId').optional().explicit(709).octstr()
            )
        })

        var KeyDescription = asn.define('KeyDescription', function() {
            this.seq().obj(
                this.key('attestationVersion').int(),
                this.key('attestationSecurityLevel').enum({ 0: 'Software', 1: 'TrustedEnvironment'}),
                this.key('keymasterVersion').int(),
                this.key('keymasterSecurityLevel').enum({ 0: 'Software', 1: 'TrustedEnvironment'}),
                this.key('attestationChallenge').octstr(),
                this.key('reserved').octstr(),
                this.key('softwareEnforced').use(AuthorizationList),
                this.key('teeEnforced').use(AuthorizationList)
            )
        })
        var buffer = new Buffer(value, 'hex')
        var keyInfo = KeyDescription.decode(buffer, 'der')

        if ((String(keyInfo['keymasterVersion']) == 1) &&
            (String(keyInfo['attestationSecurityLevel']) == 'Software') &&
            (String(keyInfo['keymasterSecurityLevel']) == 'TrustedEnvironment') &&
            (String(keyInfo['attestationChallenge']) == 'Oraclize') &&
            (String(keyInfo['teeEnforced']['purpose']) == 2) &&
            (String(keyInfo['teeEnforced']['algorithm']) == 3) &&
            (String(keyInfo['teeEnforced']['digest']) == 4) &&
            (String(keyInfo['teeEnforced']['ecCurve']) == 1) &&
            (String(keyInfo['teeEnforced']['origin']) == 0)) {
                resolve()
        }
        else {
            return reject()
        }
    })
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
