'use strict';

const crypto = require('crypto'),
	ops = require('../proofVerifier.js').ops;

// AWS public key (US East (N. Virginia))
const awsPublicCertificateRSA = `-----BEGIN CERTIFICATE-----\n\
MIIDIjCCAougAwIBAgIJAKnL4UEDMN/FMA0GCSqGSIb3DQEBBQUAMGoxCzAJBgNV\n\
BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdTZWF0dGxlMRgw\n\
FgYDVQQKEw9BbWF6b24uY29tIEluYy4xGjAYBgNVBAMTEWVjMi5hbWF6b25hd3Mu\n\
Y29tMB4XDTE0MDYwNTE0MjgwMloXDTI0MDYwNTE0MjgwMlowajELMAkGA1UEBhMC\n\
VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1NlYXR0bGUxGDAWBgNV\n\
BAoTD0FtYXpvbi5jb20gSW5jLjEaMBgGA1UEAxMRZWMyLmFtYXpvbmF3cy5jb20w\n\
gZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAIe9GN//SRK2knbjySG0ho3yqQM3\n\
e2TDhWO8D2e8+XZqck754gFSo99AbT2RmXClambI7xsYHZFapbELC4H91ycihvrD\n\
jbST1ZjkLQgga0NE1q43eS68ZeTDccScXQSNivSlzJZS8HJZjgqzBlXjZftjtdJL\n\
XeE4hwvo0sD4f3j9AgMBAAGjgc8wgcwwHQYDVR0OBBYEFCXWzAgVyrbwnFncFFIs\n\
77VBdlE4MIGcBgNVHSMEgZQwgZGAFCXWzAgVyrbwnFncFFIs77VBdlE4oW6kbDBq\n\
MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHU2Vh\n\
dHRsZTEYMBYGA1UEChMPQW1hem9uLmNvbSBJbmMuMRowGAYDVQQDExFlYzIuYW1h\n\
em9uYXdzLmNvbYIJAKnL4UEDMN/FMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEF\n\
BQADgYEAFYcz1OgEhQBXIwIdsgCOS8vEtiJYF+j9uO6jz7VOmJqO+pRlAbRlvY8T\n\
C1haGgSI/A1uZUKs/Zfnph0oEI0/hu1IIJ/SKBDtN5lvmZ/IzbOPIJWirlsllQIQ\n\
7zvWbGd9c9+Rm3p04oTvhup99la7kZqevJK0QRdD/6NpCKsqP/0=\n\
-----END CERTIFICATE-----`;

const awsTrustedAMIlist = ['ami-30176327'];

module.exports = {
	verifyComputation: function (raw_html, archive) {
		try {

			const bodyHtml = raw_html.substr(raw_html.indexOf('\r\n\r\n<?xml') + 4);
			const awsXML = bodyHtml;

			const awsOutput = atob(awsXML.match(/<output>(.*?)<\/output>/)[1]);

			const oraclize_result = awsOutput.match(/^ORACLIZE_RESULT:.*$/m)[0].substr(16);
			const oraclize_doc = awsOutput.match(/^ORACLIZE_DOC:.*$/m)[0].substr(13);
			const oraclize_sig = awsOutput.match(/^ORACLIZE_SIG:.*$/m)[0].substr(13);
			const oraclize_userdata = awsOutput.match(/^ORACLIZE_USERDATA:.*$/m)[0].substr(18);
			const decoded_result = atob(oraclize_result);
			const decoded_doc = JSON.parse(atob(oraclize_doc));
			const awsSignature = atob(oraclize_sig).replace(/\n/g, '');

			// check for trusted AMI
			const awsAMIvalid = (awsTrustedAMIlist.indexOf(decoded_doc['imageId']) !== -1) ? true : false;

			if (!awsAMIvalid)
				throw ('unrecognized AMI provided');

			if (ops.verbose)
				console.log(decoded_doc['imageId'] + ' is valid AMI');

			// get instanceId from json doc & xml (from body html)
			const awsInstanceIdDoc = decoded_doc['instanceId'];
			const awsInstanceIdXML = awsXML.match(/<instanceId>(.*?)<\/instanceId>/)[1];

			// check if the instance id is the same
			const awsInstanceMatch = awsInstanceIdDoc === awsInstanceIdXML;

			if (!awsInstanceMatch)
				throw ('instance ID mismatch');

			if (ops.verbose)
				console.log(awsInstanceIdDoc + ' instance id matches');

			//Ensure document signature passes verification
			const verifier = crypto.createVerify('sha256WithRSAEncryption');
			verifier.update(atob(oraclize_doc));
			const awsSignatureValid = verifier.verify(awsPublicCertificateRSA, awsSignature, 'base64');

			if (!awsSignatureValid)
				throw ('signature invalid');

			if (ops.verbose)
				console.log('Doc signature verified with certificate');

			//archive checksum is completed on server-side
			//with the publicly trusted AMI
			const archiveChecksumPass = awsAMIvalid;

			if (!archiveChecksumPass)
				throw ('archive checksum failed');

			if (ops.verbose)
				console.log('Trusted AMI completed checksum');

		} catch (e) {
			throw ('Computation verification error ' + e);
		}
	},
	getComputationResult: function (raw_html, query) {
		try {
			const bodyHtml = raw_html.substr(raw_html.indexOf('\n\n<?xml') + 2);
			const awsXML = bodyHtml;
			const awsOutput = atob(awsXML.match(/<output>(.*?)<\/output>/)[1]);
			const oraclize_result = awsOutput.match(/^ORACLIZE_RESULT:.*$/m)[0].substr(16);

			return atob(oraclize_result);

		} catch (e) {
			throw ('Computation verification error ' + e);
		}
	}
}
