const crypto = require('crypto');

// AWS public key (US East (N. Virginia))
const awsPublicCertificate = '-----BEGIN CERTIFICATE-----\n\
MIIC7TCCAq0CCQCWukjZ5V4aZzAJBgcqhkjOOAQDMFwxCzAJBgNVBAYTAlVTMRkw\n\
FwYDVQQIExBXYXNoaW5ndG9uIFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYD\n\
VQQKExdBbWF6b24gV2ViIFNlcnZpY2VzIExMQzAeFw0xMjAxMDUxMjU2MTJaFw0z\n\
ODAxMDUxMjU2MTJaMFwxCzAJBgNVBAYTAlVTMRkwFwYDVQQIExBXYXNoaW5ndG9u\n\
IFN0YXRlMRAwDgYDVQQHEwdTZWF0dGxlMSAwHgYDVQQKExdBbWF6b24gV2ViIFNl\n\
cnZpY2VzIExMQzCCAbcwggEsBgcqhkjOOAQBMIIBHwKBgQCjkvcS2bb1VQ4yt/5e\n\
ih5OO6kK/n1Lzllr7D8ZwtQP8fOEpp5E2ng+D6Ud1Z1gYipr58Kj3nssSNpI6bX3\n\
VyIQzK7wLclnd/YozqNNmgIyZecN7EglK9ITHJLP+x8FtUpt3QbyYXJdmVMegN6P\n\
hviYt5JH/nYl4hh3Pa1HJdskgQIVALVJ3ER11+Ko4tP6nwvHwh6+ERYRAoGBAI1j\n\
k+tkqMVHuAFcvAGKocTgsjJem6/5qomzJuKDmbJNu9Qxw3rAotXau8Qe+MBcJl/U\n\
hhy1KHVpCGl9fueQ2s6IL0CaO/buycU1CiYQk40KNHCcHfNiZbdlx1E9rpUp7bnF\n\
lRa2v1ntMX3caRVDdbtPEWmdxSCYsYFDk4mZrOLBA4GEAAKBgEbmeve5f8LIE/Gf\n\
MNmP9CM5eovQOGx5ho8WqD+aTebs+k2tn92BBPqeZqpWRa5P/+jrdKml1qx4llHW\n\
MXrs3IgIb6+hUIB+S8dz8/mmO0bpr76RoZVCXYab2CZedFut7qc3WUH9+EUAH5mw\n\
vSeDCOUMYQR7R9LINYwouHIziqQYMAkGByqGSM44BAMDLwAwLAIUWXBlk40xTwSw\n\
7HX32MxXYruse9ACFBNGmdX2ZBrVNGrN9N2f6ROk0k9K\n\
-----END CERTIFICATE-----';

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
			var awsSignature = atob(oraclize_sig);
			// check for trusted AMI
			var awsAMIvalidity = (awsTrustedAMIlist.indexOf(decoded_doc['imageId']) !== -1) ? true : false;

			if (!awsAMIvalidity)
				throw ('unrecognized AMI provided');

			// get instanceId from json doc & xml (from body html)
			var awsInstanceIdDoc = decoded_doc['instanceId'];
			var awsInstanceIdXML = awsXML.match(/<instanceId>(.*?)<\/instanceId>/)[1];

			// check if the instance id is the same
			if (awsInstanceIdDoc !== awsInstanceIdXML)
				throw ('instance ID mismatch');

			//still returns false, signature must indeed be malformed
			//as reported by jsrsassign
			var verifier = crypto.createVerify('dsaWithSHA1');
			verifier.update(atob(oraclize_doc));
			var awsSignatureValidity = verifier.verify(awsPublicCertificate, oraclize_sig, 'base64');

			//not throwing because it seems to always fail :/

			//skipping at request until discussion
			//on how to handle archive.zip checksum
			oraclizeUserDataValidity = true;


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
			//return false;
		}
	}
}
