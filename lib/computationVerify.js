const crypto = require('crypto');

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

const awsTrustedAMIlist = ["ami-30176327"];

module.exports = {
	verifyComputation: function (raw_html, archive) {
		try {

			var bodyHtml = raw_html.substr(raw_html.indexOf('\r\n\r\n<?xml') + 4);
			var awsXML = bodyHtml;

			var awsOutput = atob(awsXML.match(/<output>(.*?)<\/output>/)[1]);

			var oraclize_result = awsOutput.match(/^ORACLIZE_RESULT:.*$/m)[0].substr(16);
			var oraclize_doc = awsOutput.match(/^ORACLIZE_DOC:.*$/m)[0].substr(13);
			var oraclize_sig = awsOutput.match(/^ORACLIZE_SIG:.*$/m)[0].substr(13);
			var oraclize_userdata = awsOutput.match(/^ORACLIZE_USERDATA:.*$/m)[0].substr(18);
			var decoded_result = atob(oraclize_result);
			var decoded_doc = JSON.parse(atob(oraclize_doc));
			var awsSignature = atob(oraclize_sig).replace(/\n/g, '');

			// check for trusted AMI
			var awsAMIvalid = (awsTrustedAMIlist.indexOf(decoded_doc['imageId']) !== -1) ? true : false;

			if (!awsAMIvalid)
				throw ('unrecognized AMI provided');

			// get instanceId from json doc & xml (from body html)
			var awsInstanceIdDoc = decoded_doc['instanceId'];
			var awsInstanceIdXML = awsXML.match(/<instanceId>(.*?)<\/instanceId>/)[1];

			// check if the instance id is the same
			var awsInstanceMatch = awsInstanceIdDoc === awsInstanceIdXML;

			if (!awsInstanceMatch)
				throw ('instance ID mismatch');

			//Ensure document signature passes verification
			var verifier = crypto.createVerify('sha256WithRSAEncryption');
			verifier.update(atob(oraclize_doc));
			var awsSignatureValid = verifier.verify(awsPublicCertificateRSA, awsSignature, 'base64');

			if (!awsSignatureValid)
				throw ('signature invalid');

			//skipping at request until discussion
			//on how to handle archive.zip checksum
			archiveChecksumPass = true;

			if (!archiveChecksumPass)
				throw ('archive checksum failed');

		} catch (e) {
			throw ('Computation verification error ' + e);
		}
	},
	getComputationResult: function (raw_html, query) {
		try {
			var bodyHtml = raw_html.substr(raw_html.indexOf('\n\n<?xml') + 2);
			var awsXML = bodyHtml;
			var awsOutput = atob(awsXML.match(/<output>(.*?)<\/output>/)[1]);
			var oraclize_result = awsOutput.match(/^ORACLIZE_RESULT:.*$/m)[0].substr(16);

			return atob(oraclize_result);

		} catch (e) {
			throw ('Computation verification error ' + e);
		}
	}
}
