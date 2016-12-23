var cbor = require('cbor')
var URLSafeBase64 = require('urlsafe-base64')
var r = require('jsrsasign')
var request = require('sync-request')
var asn = require('asn1.js')

var exports = module.exports = {}

exports.verify = function(data, pemEncodedChain, rawSettings) {

  var settings = JSON.parse(rawSettings.toString())
  const googleApiKey = settings['googleApiKey']
  const apkDigest = settings['apkDigest']
  const apkCertDigest = settings['apkCertDigest']
  const whitelistedPubKeys = settings['pubKeys']
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
  var jws =
      jwsHeaderEncoded.concat('.').concat(jwsPayloadEncoded).concat('.').concat(jwsSignatureEncoded)
  const googleCert = extractGoogleCert(jwsHeader)

  var isValid = true

  if (pemEncodedChain != null) {
    var leafCert = new r.X509()
    var intermediateCert= new r.X509()
    var rootCert = new r.X509()
    leafCert.readCertPEM(pemEncodedChain[0])
    intermediateCert.readCertPEM(pemEncodedChain[1])
    rootCert.readCertPEM(pemEncodedChain[2])

    if (!(verifyAttestationParams(leafCert) &&
        verifyAttestationCertChain(leafCert, intermediateCert, rootCert, pemEncodedChain[1], pemEncodedChain[2]) &&
        verifyResponseSignature(response, signature, pemEncodedChain[0], null))) {
        isValid = false
    }
  } else {
    if (!verifyResponseSignature(response, signature, null, whitelistedPubKeys)) {
      isValid = false
    }
  }

  var payloadFlag = false
  block: {
    for (var j = 0; j < apkDigest.length; j++ ) {
      for (var i = 0; i < apkCertDigest.length; i++) {
        if(verifyPayload(jwsPayload, response, requestID, signature, apkDigest[j], apkCertDigest[i])) {
          payloadFlag = true
          break block
        }
      }
    }
  }

  if (!payloadFlag) {
    isValid = false
  }

  if (!(verifySignature(jws, googleCert) &&
      verifyAuthenticity(jws, googleApiKey))) {
        isValid = false
  }

  return isValid
}

exports.getVerificationParameters = function() {
  const jsonSettings = fs.readFileSync('./settings/settings.json')
  return jsonSettings
}

exports.getCertificateChain = function() {
  const encodedChain = Buffer.from(fs.readFileSync('./certs/AndroidProof.chain'))
  const decodedChain =   cbor.decodeFirstSync(encodedChain)
  var leaf = decodedChain['leaf']
  var intermediate = decodedChain['intermediate']
  var root = decodedChain['root']

  var derEncodedChain = [leaf, intermediate, root]
  var pemEncodedChain = []
  var cert = null

  for (var i = 0; i < 3; i ++) {
      cert = derEncodedChain[i].toString('base64')
      out = "-----BEGIN CERTIFICATE-----\n"
      for(var j = 0; j < cert.length; j = j + 64) {
        out += cert.slice(j, j + 64) + "\n"
      }
      out += "-----END CERTIFICATE-----"
      pemEncodedChain.push(out)
  }
  return pemEncodedChain
}

function verifySignature(jws, googleCert) {
    return r.jws.JWS.verify(jws, googleCert.subjectPublicKeyRSA, ['RS256'])
}

function verifyPayload(jwsPayload, response, requestID, signature, apkDigest, apkCertDigest) {
    var jwsPayloadJSON = JSON.parse(jwsPayload.toString())

    var md = new r.KJUR.crypto.MessageDigest({alg:"sha256", prov: "cryptojs"})
    md.updateString(response)
    md.updateHex(signature.toString('hex'))
    md.updateString(requestID)
    var digest = md.digest()
    var nonce = new Buffer(digest, 'hex').toString('base64')
    var isValid = true

    if (jwsPayloadJSON['nonce'] != nonce.toString('base64'))
        isValid = false
    if (jwsPayloadJSON['apkPackageName'] != 'it.oraclize.androidproof')
        isValid = false
    if (jwsPayloadJSON['apkDigestSha256'] != apkDigest)
        isValid = false
    if (jwsPayloadJSON['apkCertificateDigestSha256'][0] != apkCertDigest)
        isValid = false
    if (jwsPayloadJSON['basicIntegrity'] != true)
        isValid = false

    return isValid
}

function verifyAuthenticity(jws, googleApiKey) {
  var post_data = { 'signedAttestation' : jws}
  var res = request('POST',
            'https://www.googleapis.com/androidcheck/v1/attestations/verify?key=' + googleApiKey,
            { json: post_data })

  var google_api_response = JSON.parse(res.getBody('utf8'))
  if (google_api_response['isValidSignature']) {
    return true
  } else {
    return false
  }
}

function verifyResponseSignature(response, signature, pemLeafCert, whitelistedPubKeys) {
  if (pemLeafCert !== null) {
    var sig = new r.crypto.Signature({'alg':'SHA256withECDSA'})
    sig.init(pemLeafCert)
    sig.updateString(response)
    return sig.verify(signature.toString('hex'))
  } else {
    var isValid = false
    var i = 0
    while (!isValid && i < whitelistedPubKeys.length) {
      var sig = new r.crypto.Signature({'alg':'SHA256withECDSA'})
      var params = {xy: whitelistedPubKeys[i], curve: 'secp256r1'}
      var key = r.KEYUTIL.getKey(params)
      sig.initVerifyByPublicKey(key)
      sig.updateString(response)
      isValid = sig.verify(signature.toString('hex'))
      i += 1
    }
    return isValid
  }
}

function verifyAttestationCertChain(leafCert, intermediateCert, rootCert, pemInter, pemRoot) {
  var leafHTbsCert = r.ASN1HEX.getDecendantHexTLVByNthList(leafCert.hex, 0, [0])
  var leafAlg = leafCert.getSignatureAlgorithmField()
  var leafCertificateSignature = r.X509.getSignatureValueHex(leafCert.hex)

  var intHTbsCert = r.ASN1HEX.getDecendantHexTLVByNthList(intermediateCert.hex, 0, [0])
  var intAlg = intermediateCert.getSignatureAlgorithmField()
  var intCertificateSignature = r.X509.getSignatureValueHex(intermediateCert.hex)

  // Verify leaf against intermediate
  var intSig = new r.crypto.Signature({alg: leafAlg})
  intSig.init(pemInter)
  intSig.updateHex(leafHTbsCert)

  // Verify against root
  var rootSig = new r.crypto.Signature({alg: intAlg})
  rootSig.init(pemRoot)
  rootSig.updateHex(intHTbsCert)

  if (intSig.verify(leafCertificateSignature) &&
      rootSig.verify(intCertificateSignature)) {
      return true
  } else {
      return false
  }
}

function verifyAttestationParams(leafCert) {
        var value = r.X509.getHexOfTLV_V3ExtValue(leafCert.hex, '1.3.6.1.4.1.11129.2.1.17')
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
                return true
        }
        else {
            return false
        }
}

function extractGoogleCert(header) {
  var headerDictionary, googleCertChain, googleCert;
  headerDictionary = JSON.parse(header);
  googleCertChain = headerDictionary['x5c'];
  var cert = new r.X509();
  cert.readCertPEM(googleCertChain[0]);
  return cert;
}
