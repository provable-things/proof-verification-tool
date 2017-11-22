'use strict';

const origcerts = require('./rootcertslist.js').certs;
const tlsn_utils = require('../tlsn_utils.js');
let certs = origcerts;

var asn1 = require('asn1.js');
var Buffer = require('buffer').Buffer;

//--------BEGIN copied from https://github.com/indutny/asn1.js/blob/master/rfc/3280/index.js
var AlgorithmIdentifier = asn1.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional().any()
  );
});

const Certificate = asn1.define('Certificate', function () {
  this.seq().obj(
    this.key('tbsCertificate').use(TBSCertificate),
    this.key('signatureAlgorithm').use(AlgorithmIdentifier),
    this.key('signature').bitstr()
  );
});

var TBSCertificate = asn1.define('TBSCertificate', function () {
  this.seq().obj(
    this.key('version').def('v1').explicit(0).use(Version),
    this.key('serialNumber').use(CertificateSerialNumber),
    this.key('signature').use(AlgorithmIdentifier),
    this.key('issuer').use(Name),
    this.key('validity').use(Validity),
    this.key('subject').use(Name),
    this.key('subjectPublicKeyInfo').use(SubjectPublicKeyInfo),

    // TODO(indutny): validate that version is v2 or v3
    this.key('issuerUniqueID').optional().explicit(1).use(UniqueIdentifier),
    this.key('subjectUniqueID').optional().explicit(2).use(UniqueIdentifier),

    // TODO(indutny): validate that version is v3
    this.key('extensions').optional().explicit(3).use(Extensions)
  );
});

var Version = asn1.define('Version', function () {
  this.int({
    0: 'v1',
    1: 'v2',
    2: 'v3'
  });
});

var CertificateSerialNumber = asn1.define('CertificateSerialNumber',
  function () {
    this.int();
  });

var Validity = asn1.define('Validity', function () {
  this.seq().obj(
    this.key('notBefore').use(Time),
    this.key('notAfter').use(Time)
  );
});

var Time = asn1.define('Time', function () {
  this.choice({
    utcTime: this.utctime(),
    genTime: this.gentime()
  });
});

var UniqueIdentifier = asn1.define('UniqueIdentifier', function () {
  this.bitstr();
});

var SubjectPublicKeyInfo = asn1.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  );
});

var Extensions = asn1.define('Extensions', function () {
  this.seqof(Extension);
});

var Extension = asn1.define('Extension', function () {
  this.seq().obj(
    this.key('extnID').objid(),
    this.key('critical').bool().def(false),
    this.key('extnValue').octstr()
  );
});

var Name = asn1.define('Name', function () {
  this.choice({
    rdn: this.use(RDNSequence)
  });
});

var RDNSequence = asn1.define('RDNSequence', function () {
  this.seqof(RelativeDistinguishedName);
});

var RelativeDistinguishedName = asn1.define('RelativeDistinguishedName',
  function () {
    this.setof(AttributeTypeAndValue);
  });

var AttributeTypeAndValue = asn1.define('AttributeTypeAndValue', function () {
  this.seq().obj(
    this.key('type').use(AttributeType),
    this.key('value').use(AttributeValue)
  );
});

var AttributeType = asn1.define('AttributeType', function () {
  this.objid();
});

var AttributeValue = asn1.define('AttributeValue', function () {
  this.any();
});
//-----END copied from https://github.com/indutny/asn1.js/blob/master/rfc/3280/index.js


function pem2der(certpem) {
  var lines = certpem.split('\n');
  var stripped = ''; //strip ascii armor and newlines
  for (var i = 1; i < lines.length - 2; i++) {
    stripped += lines[i];
  }
  stripped = stripped.replace(/\n/g, '');
  var certder = tlsn_utils.b64decode(stripped);
  return certder;
}


//change the keys from ambigous string that bitpay provides
//to unique subject strings and associated pubkeys
function fixcerts() {
  var tmpcerts = { 'trusted_pubkeys': [] };
  for (var key in certs) {
    var certpem = certs[key];
    var certder = pem2der(certpem);
    //getfield(certder);
    var subj = getSubjectString(certder, 'own');
    if (tmpcerts.hasOwnProperty(subj)) {
      //Duplicate found. Rename the existing entry and the duplicate
      //with extended subject
      //console.log('adding duplicate:', subj);
      var pem_one = tmpcerts[subj];
      var der_one = pem2der(pem_one);
      var subj_one = getSubjectString(der_one, 'own', true);
      tmpcerts[subj_one] = pem_one;
      delete tmpcerts[subj];
      var subj_two = getSubjectString(certder, 'own', true);
      subj = subj_two;
    }
    tmpcerts[subj] = certpem;
    var pk = getPubkey(certder);
    tmpcerts['trusted_pubkeys'].push(tlsn_utils.b64encode(tlsn_utils.ua2ba(pk)));
  }
  certs = tmpcerts;
}


function getPubkey(cert) {
  var c = Certificate.decode(new Buffer(cert), 'der');
  return c.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey.data;
}


//Usually CN=&O= is enough to uniquely identify a CA, however there are 6 certs
//in rootstore which have the same O&CN and are only distinguished by OU=
function getSubjectString(cert, whose, extended) {
  if (typeof (extended) === 'undefined') {
    extended = false;
  }
  var c = Certificate.decode(new Buffer(cert), 'der');
  var fields;
  if (whose === 'issuer') {
    fields = c.tbsCertificate.issuer.value;
  } else if (whose === 'own') {
    fields = c.tbsCertificate.subject.value;
  }
  var cn_str = '';
  var o_str = '';
  var ou_str = '';
  for (var i = 0; i < fields.length; i++) {
    if (fields[i][0].type.toString() === [2, 5, 4, 3].toString()) {
      cn_str = 'CN=' + tlsn_utils.ba2str(fields[i][0].value.slice(2)) + '/';
    }
    if (fields[i][0].type.toString() === [2, 5, 4, 10].toString()) {
      o_str = 'O=' + tlsn_utils.ba2str(fields[i][0].value.slice(2)) + '/';
    }
    if (extended) {
      if (fields[i][0].type.toString() === [2, 5, 4, 11].toString()) {
        ou_str = 'OU=' + tlsn_utils.ba2str(fields[i][0].value.slice(2)) + '/';
      }
      //we have one root CA Autoridad de Certificacion Firmaprofesional CIF A62634068
      //which is distinguishable only by L=
      //we put the L= value into OU=
      if (ou_str === '') {
        if (fields[i][0].type.toString() === [2, 5, 4, 7].toString()) {
          ou_str = 'OU=' + tlsn_utils.ba2str(fields[i][0].value.slice(2)) + '/';
        }
      }
    }
  }
  if (!cn_str && !o_str) {
    return false;
  }
  return cn_str + o_str + ou_str;
}


//---an adopted copy of PaymentProtocol.verifyCertChain from
//https://github.com/bitpay/bitcore-payment-protocol/blob/master/lib/browser.js
var verifyCertChain = function (chain) {

  //Check if there is no root cert in the chain
  //and if so, add it (provided that we know such root CA)

  //Uniquely identify CAs by the O and CN string and by the pubkey, not by PEM of the cert
  //e.g. VeriSign Class 3 Public Primary Certification Authority - G5
  //has different PEMs for Fiferox vs Chrome

  var find_in_store = function (rootcert) {
    var subjown = getSubjectString(rootcert, 'own');
    if (!certs.hasOwnProperty(subjown)) {
      //get extended subject string
      subjown = getSubjectString(rootcert, 'own', true);
      if (!certs.hasOwnProperty(subjown)) return false;
    }
    var pk = tlsn_utils.b64encode(tlsn_utils.ua2ba(getPubkey(rootcert)));
    if (certs.trusted_pubkeys.indexOf(pk) < 0) return false;
    return true;
  };
  var found = find_in_store(chain[chain.length - 1]);

  if (!found) {
    //Usually there is no root cert in chain
    var subj = getSubjectString(chain[chain.length - 1], 'issuer');
    if (!certs.hasOwnProperty(subj)) {
      //get extended subject string
      subj = getSubjectString(chain[chain.length - 1], 'issuer', true);
      if (!certs.hasOwnProperty(subj)) return false;
    }
    chain.push(pem2der(certs[subj]));
  }


  return chain.every(function (cert, i) {
    if (i === chain.length - 1) {
      //we already checked earlier that this CA's pubkey is in store
      //or we added this CA to the chain ourselves
      return true;
    }

    var ncert = chain[i + 1];
    var nder = tlsn_utils.ba2hex(ncert);
    var npem = KJUR.asn1.ASN1Util.getPEMStringFromHex(nder, 'CERTIFICATE');

    // Get Next Certificate:
    var ndata = new Buffer(nder, 'hex');
    //var ndata = ba2ua(ncert);
    var nc = Certificate.decode(ndata, 'der');

    // Get Signature Value from current certificate:
    var data = new Buffer(cert);
    //var data = ba2ua(der);
    var c = Certificate.decode(data, 'der');
    var sig = c.signature.data;
    var alg = c.signatureAlgorithm.algorithm;
    var lastalgbyte = alg[alg.length - 1];
    var sigHashAlg;
    //1.2.840.113549.1.1.11 sha256
    //1.2.840.113549.1.1.5  sha1
    //1.2.840.113549.1.1.12  sha384
    if (lastalgbyte === 11) {
      sigHashAlg = 'SHA256withRSA';
    } else if (lastalgbyte === 5) {
      sigHashAlg = 'SHA1withRSA';
    } else if (lastalgbyte === 12) {
      sigHashAlg = 'SHA384withRSA';
    } else { return false; }

    var npubKey;
    // Get Public Key from next certificate (via KJUR because it's a mess):
    var js = new KJUR.crypto.Signature({
      alg: sigHashAlg,
      prov: 'cryptojs/jsrsa'
    });
    js.initVerifyByCertificatePEM(npem);
    npubKey = js.pubKey;

    // Check Validity of Certificates
    var validityVerified = validateCertTime(c, nc);

    // Check the Issuer matches the Subject of the next certificate:
    var issuerVerified = validateCertIssuer(c, nc);

    // Verify current Certificate signature
    var jsrsaSig = new KJUR.crypto.Signature({
      alg: sigHashAlg,
      prov: 'cryptojs/jsrsa'
    });
    jsrsaSig.initVerifyByPublicKey(npubKey);

    // Get the raw DER TBSCertificate
    // from the DER Certificate:
    var tbs = getTBSCertificate(data, c.signature.data.length);

    jsrsaSig.updateHex(tbs.toString('hex'));

    var sigVerified = jsrsaSig.verify(sig.toString('hex'));

    return validityVerified && issuerVerified && sigVerified;
  });
};

var X509_ALGORITHM = {
  '1.2.840.113549.1.1.1': 'RSA',
  '1.2.840.113549.1.1.2': 'RSA_MD2',
  '1.2.840.113549.1.1.4': 'RSA_MD5',
  '1.2.840.113549.1.1.5': 'RSA_SHA1',
  '1.2.840.113549.1.1.11': 'RSA_SHA256',
  '1.2.840.113549.1.1.12': 'RSA_SHA384',
  '1.2.840.113549.1.1.13': 'RSA_SHA512',

  '1.2.840.10045.4.3.2': 'ECDSA_SHA256',
  '1.2.840.10045.4.3.3': 'ECDSA_SHA384',
  '1.2.840.10045.4.3.4': 'ECDSA_SHA512'
};

var getAlgorithm = function (value, index) {
  if (Array.isArray(value)) {
    value = value.join('.');
  }
  value = X509_ALGORITHM[value];
  if (typeof (index) !== 'undefined') {
    value = value.split('_');
    if (index === true) {
      return {
        cipher: value[0],
        hash: value[1]
      };
    }
    return value[index];
  }
  return value;
};


//---BEGIN copied from https://github.com/bitpay/bitcore-payment-protocol/blob/master/lib/common.js

// Check Validity of Certificates
var validateCertTime = function (c, nc) {
  var validityVerified = true;
  var now = Date.now();
  var cBefore = c.tbsCertificate.validity.notBefore.value;
  var cAfter = c.tbsCertificate.validity.notAfter.value;
  var nBefore = nc.tbsCertificate.validity.notBefore.value;
  var nAfter = nc.tbsCertificate.validity.notAfter.value;
  if (cBefore > now || cAfter < now || nBefore > now || nAfter < now) {
    validityVerified = false;
  }
  return validityVerified;
};

// Check the Issuer matches the Subject of the next certificate:
var validateCertIssuer = function (c, nc) {
  var issuer = c.tbsCertificate.issuer;
  var subject = nc.tbsCertificate.subject;
  var issuerVerified = issuer.type === subject.type && issuer.value.every(function (issuerArray, i) {
    var subjectArray = subject.value[i];
    return issuerArray.every(function (issuerObject, i) {
      var subjectObject = subjectArray[i];

      var issuerObjectType = issuerObject.type.join('.');
      var subjectObjectType = subjectObject.type.join('.');

      var issuerObjectValue = issuerObject.value.toString('hex');
      var subjectObjectValue = subjectObject.value.toString('hex');

      return issuerObjectType === subjectObjectType && issuerObjectValue === subjectObjectValue;
    });
  });
  return issuerVerified;
};


// Grab the raw DER To-Be-Signed Certificate
// from a DER Certificate to verify
var getTBSCertificate = function (data, siglen) {
  // We start by slicing off the first SEQ of the
  // Certificate (TBSCertificate is its own SEQ).

  // The first 10 bytes usually look like:
  // [ 48, 130, 5, 32, 48, 130, 4, 8, 160, 3 ]
  var start = 0;
  var starts = 0;
  for (start = 0; start < data.length; start++) {
    if (starts === 1 && data[start] === 48) {
      break;
    }
    if (starts < 1 && data[start] === 48) {
      starts++;
    }
  }

  // The bytes *after* the TBS (including the last TBS byte) will look like
  // (note the 48 - the start of the sig, and the 122 - the end of the TBS):
  // [ 122, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 11, 5, 0, 3, ... ]

  // The certificate in these examples has a `start` of 4, and an `end` of
  // 1040. The 4 bytes is the DER SEQ of the Certificate, right before the
  // SEQ of the TBSCertificate.
  var end = 0;
  var ends = 0;
  for (end = data.length - 1 - siglen; end > 0; end--) {
    if (ends === 2 && data[end] === 48) {
      break;
    }
    if (ends < 2 && data[end] === 0) {
      ends++;
    }
  }

  // Return our raw DER TBSCertificate:
  return data.slice(start, end);
};

//---END copied from https://github.com/bitpay/bitcore-payment-protocol/blob/master/lib/common.js

//this must trigger after asn1.js was loaded, so putting this to the bottom
fixcerts();

module.exports.Certificate = Certificate;
module.exports.verifyCertChain = verifyCertChain;
