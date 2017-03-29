'use strict';

// AWS RSA public key (US East (N. Virginia))
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

const awsTrustedAMIlist = ['ami-30176327', 'ami-3200c65d', 'ami-84f6f093', 'ami-1c588d73'];

module.exports = {
	verifyComputation: function (rawHtml, archive) {
		try {
			const bodyHtml = rawHtml.substr(rawHtml.indexOf('\r\n\r\n<?xml') + 4);
			const awsXML = bodyHtml;
			var awsOutputDirty = atob(awsXML.match(/<output>(.*?)<\/output>/)[1]).split('\n');
			var awsOutputClean = [];
			for (var i = 0; i < awsOutputDirty.length; i++) {
				if (awsOutputDirty[i].substr(0, 2) !== ' *') {
					awsOutputClean.push(awsOutputDirty[i]);
				}
			}
			var awsOutput = awsOutputClean.join('\n');

			var oraclizeResult = awsOutput.match(/ORACLIZE_RESULT:[\s\S]*ORACLIZE_/g)[0].split('ORACLIZE_')[1];
			oraclizeResult = oraclizeResult.substr(7, oraclizeResult.length - 7).split('\r\r\n').join('');
			var oraclizeDoc = awsOutput.match(/ORACLIZE_DOC:[\s\S]*ORACLIZE_/g)[0].split('ORACLIZE_')[1];
			oraclizeDoc = oraclizeDoc.substr(4, oraclizeDoc.length - 4).split('\r\r\n').join('');
			var oraclizeSig = awsOutput.match(/ORACLIZE_SIG:[\s\S]*$/g)[0].split('ORACLIZE_')[1];
			oraclizeSig = oraclizeSig.substr(4, oraclizeSig.indexOf('[') - 4).split('\r\r\n').join('');
			var oraclizeUserData = awsOutput.match(/ORACLIZE_USERDATA:[\s\S]*ORACLIZE_/g)[0].split('ORACLIZE_')[1];
			oraclizeUserData = oraclizeUserData.substr(9, oraclizeUserData.length - 9).split('\r\r\n').join('');
			const decodedResult = atob(oraclizeResult);
			const decodedDoc = JSON.parse(atob(oraclizeDoc));
			var awsSignature = atob(oraclizeSig).replace(/\n/g, '');

			// convert from base64 to hex
			awsSignature = ba2hex(str2ba(atob(awsSignature)));

			// check for trusted AMI
			const awsAMIvalid = (awsTrustedAMIlist.indexOf(decodedDoc.imageId) !== -1) ? true : false;

			if (!awsAMIvalid) {
				throw new Error('unrecognized AMI provided');
			}
			// get instanceId from json doc & xml (from body html)
			const awsInstanceIdDoc = decodedDoc.instanceId;
			const awsInstanceIdXML = awsXML.match(/<instanceId>(.*?)<\/instanceId>/)[1];

			// check if the instance id is the same
			const awsInstanceMatch = awsInstanceIdDoc === awsInstanceIdXML;

			if (!awsInstanceMatch) {
				throw new Error('instance ID mismatch');
			}

			// Ensure document signature passes verification
			const verifier = new KJUR.crypto.Signature({alg: 'SHA256withRSA'});
			verifier.init(awsPublicCertificateRSA);
			verifier.updateString(atob(oraclizeDoc));
			const awsSignatureValid = verifier.verify(awsSignature);

			if (!awsSignatureValid) {
				throw new Error('signature invalid');
			}
			// archive checksum is completed on server-side
			// with the publicly trusted AMI
			const archiveChecksumPass = awsAMIvalid;

			if (!archiveChecksumPass) {
				throw new Error('archive checksum failed');
			}
		} catch (err) {
			throw new Error('Computation verification error ' + err);
		}
	},
	getComputationResult: function (rawHtml, query) {
		try {
			const bodyHtml = rawHtml.substr(rawHtml.indexOf('\n\n<?xml') + 2);
			const awsXML = bodyHtml;
			const awsOutput = atob(awsXML.match(/<output>(.*?)<\/output>/)[1]);
			const oraclizeResult = awsOutput.match(/^ORACLIZE_RESULT:.*$/m)[0].substr(16);
			return atob(oraclizeResult);
		} catch (err) {
			throw new Error('Computation result parsing error ' + err);
		}
	}
}
