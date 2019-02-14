var exports = module.exports = {};

const oraclize4 = {
  name: 'oraclize4',
  verifiable: false, // unverifiable due to the instance not beeing online anymore (TLSN oracles v1 had some issues with long running deployments)
  main: {
    IP: '52.221.246.106',
    port: '10011',
    DI: 'https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2018-01-01&InstanceId=i-e1ae5746&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=IHvmNvRC0KTtoZ4JN8e3YbtcjuOgDkBH1cHV%2BNQMewg%3D',
    DV: 'https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-72196daf&Signature=OVw4KfRyjOCVyhS6Icq6QRSQXIZ6OF3JCIc7W%2BB1yRE%3D',
    GCO: 'https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2018-01-01&InstanceId=i-e1ae5746&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=lYJxdvVWWT6grbF782emRbJNAK7QzNmXXlacGHS0CIc%3D',
    GU: 'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=72kIbKEhCgnXpenvG8oZLzxRdsnxXzOKGafOeTDddxM%3D',
    DIA: 'https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2018-01-01&InstanceId=i-e1ae5746&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=%2BoDSwuhchgC%2FAMPONQkXCHbQ4c1ygs%2FMPk2XcqPt2Ns%3D',
    instanceId: 'i-e1ae5746'
  },
  sig: {
    IP: '54.169.251.103',
    port: '10011',
    DI: 'https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2018-01-01&InstanceId=i-d5ae5772&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=SEandr%2FcprAmz9yBXTS3fRU3c4P8qz%2Bsfhb5Qvjdats%3D',
    DV: 'https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-b1196d6c&Signature=qQsOLXgA2QwttVjMCFNKWxkrO4Wo%2BKoXIBaAf36dFi8%3D',
    GCO: 'https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2018-01-01&InstanceId=i-d5ae5772&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=b2h%2BqNXgABuvXFDCW1k8yjjop64yHaPEqxIK2uBIK6Y%3D',
    GU: 'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=72kIbKEhCgnXpenvG8oZLzxRdsnxXzOKGafOeTDddxM%3D',
    DIA: 'https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2018-01-01&InstanceId=i-d5ae5772&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=rXm1c%2B32cSVnYlOX6nbBv%2Bj%2BcaylYs1yOYmya27J7u0%3D',
    instanceId: 'i-d5ae5772',
    modulus: [184, 227, 99, 146, 69, 62, 141, 20, 30, 88, 188, 11, 237, 71, 195, 149, 181, 32, 127, 85, 139, 227, 98, 235, 88, 15, 233, 61, 66, 37, 239, 94, 9, 9, 2, 57, 254, 6, 175, 9, 238, 0, 32, 182, 42, 7, 126, 169, 155, 188, 1, 126, 41, 108, 90, 109, 82, 93, 88, 119, 29, 214, 57, 19, 240, 93, 54, 67, 147, 25, 211, 110, 29, 184, 235, 87, 120, 213, 20, 175, 71, 4, 211, 48, 53, 186, 221, 57, 229, 37, 172, 170, 139, 142, 53, 244, 171, 179, 189, 172, 170, 123, 149, 181, 59, 116, 161, 178, 123, 172, 162, 120, 91, 137, 199, 170, 238, 195, 15, 237, 216, 78, 233, 123, 162, 220, 82, 79, 118, 170, 19, 146, 208, 153, 152, 42, 85, 193, 169, 92, 103, 55, 255, 79, 14, 209, 153, 253, 57, 193, 116, 127, 124, 216, 150, 239, 225, 56, 93, 102, 252, 12, 94, 182, 240, 233, 19, 242, 121, 59, 137, 223, 195, 238, 185, 239, 129, 178, 219, 252, 165, 187, 150, 54, 242, 112, 17, 96, 254, 47, 132, 224, 138, 167, 251, 163, 20, 191, 240, 81, 173, 118, 48, 4, 221, 20, 117, 54, 104, 53, 228, 48, 97, 107, 138, 198, 56, 127, 123, 191, 14, 122, 227, 244, 97, 182, 3, 185, 155, 96, 99, 250, 93, 13, 210, 22, 234, 183, 154, 228, 214, 252, 12, 46, 78, 203, 234, 62, 174, 149, 131, 192, 65, 2, 107, 225, 84, 51, 86, 148, 2, 22, 70, 102, 34, 33, 212, 60, 101, 246, 34, 162, 38, 39, 2, 14, 212, 111, 225, 254, 179, 1, 247, 230, 205, 213, 245, 113, 49, 159, 23, 193, 135, 63, 203, 141, 124, 45, 205, 121, 80, 122, 238, 30, 79, 18, 81, 39, 83, 212, 147, 1, 36, 75, 194, 206, 216, 98, 201, 241, 56, 95, 222, 135, 42, 205, 47, 136, 141, 202, 231, 243, 47, 188, 116, 211, 187, 35, 59, 16, 223, 217, 212, 243, 2, 41, 36, 196, 192, 204, 171, 131, 54, 238, 198, 179, 142, 0, 185, 215, 227, 232, 193, 240, 162, 81, 202, 243, 42, 243, 225, 65, 31, 39, 140, 122, 98, 22, 245, 227, 247, 219, 193, 68, 216, 45, 225, 124, 24, 170, 203, 244, 180, 179, 19, 239, 57, 107, 82, 239, 211, 247, 175, 190, 109, 222, 187, 34, 65, 133, 100, 197, 213, 13, 241, 58, 151, 157, 224, 166, 11, 138, 102, 106, 182, 30, 74, 172, 154, 148, 45, 95, 203, 56, 78, 27, 168, 37, 128, 151, 72, 235, 186, 51, 34, 209, 141, 231, 4, 168, 135, 29, 95, 45, 145, 34, 94, 127, 198, 49, 194, 119, 121, 160, 165, 104, 48, 183, 202, 157, 176, 86, 152, 108, 45, 181, 197, 152, 117, 97, 144, 232, 166, 103, 104, 135, 142, 163, 174, 100, 28, 45, 205, 79, 38, 154, 238, 130, 17, 189, 129, 97, 248, 210, 1, 198, 100, 67, 144, 184, 56, 17]
  }
};

const oraclize5 = {
  name: 'oraclize5',
  verifiable: false, // unverifiable due to the instance not beeing online anymore (TLSN oracles had to be updated since the reliable_sites were not available anymore)
  main: {
    IP: '52.90.90.9',
    port: '10011',
    DI: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2019-01-01&InstanceId=i-006259213b8edb2ce&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=H4zPn42aYytRSe3NOyJoqhPCTxxtohMZwg8q8xszvq8%3D',
    DV: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-02247b60d940968cd&Signature=mcWgNdX0nu7kJ45kg6LdYRJCLp0FK0s7hlXyV1fnfSM%3D',
    GCO: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2019-01-01&InstanceId=i-006259213b8edb2ce&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=pXCXcdfJXwiVsyaClr2j4IBF0pS%2BHDKMTl2hnELIvCY%3D',
    GU: 'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=P7KohfMsstvrdvsDZVsaC1vWWnXgPUT9d2%2B0AdrOC0A%3D',
    DIA: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2019-01-01&InstanceId=i-006259213b8edb2ce&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=bOqAqVojguvycC6CjMwNCqf7WT7My0obbeONS99nbJU%3D',
    instanceId: 'i-006259213b8edb2ce'
  },
  sig: {
    modulus: [186, 207, 38, 201, 153, 246, 95, 38, 213, 220, 154, 136, 124, 73, 92, 13, 234, 97, 118, 163, 232, 135, 219, 154, 47, 207, 195, 46, 79, 84, 168, 200, 75, 11, 201, 149, 58, 101, 232, 67, 46, 131, 163, 245, 10, 230, 184, 60, 90, 156, 201, 203, 175, 4, 176, 74, 108, 188, 15, 44, 214, 129, 96, 74, 80, 109, 57, 119, 221, 70, 46, 219, 89, 137, 147, 59, 221, 66, 178, 45, 154, 144, 189, 85, 35, 69, 219, 59, 167, 243, 214, 174, 28, 102, 114, 195, 210, 190, 30, 130, 141, 114, 0, 227, 163, 163, 247, 248, 101, 234, 123, 212, 23, 13, 88, 199, 234, 185, 243, 115, 121, 157, 104, 233, 105, 28, 248, 26, 76, 123, 178, 232, 95, 50, 7, 158, 246, 81, 241, 144, 46, 9, 73, 216, 83, 80, 48, 175, 119, 232, 7, 145, 80, 24, 223, 107, 73, 22, 155, 176, 217, 244, 148, 42, 75, 112, 113, 91, 45, 112, 123, 174, 88, 213, 106, 20, 177, 216, 130, 229, 24, 5, 22, 241, 159, 34, 124, 215, 243, 34, 120, 94, 183, 40, 97, 163, 28, 65, 156, 170, 156, 111, 226, 155, 134, 168, 111, 209, 67, 109, 64, 28, 208, 224, 199, 224, 167, 17, 74, 3, 56, 253, 79, 53, 132, 60, 68, 162, 184, 190, 249, 216, 180, 191, 1, 253, 40, 170, 45, 108, 225, 212, 29, 42, 53, 4, 95, 158, 233, 240, 95, 132, 223, 88, 121, 95, 14, 227, 149, 51, 214, 250, 190, 54, 79, 255, 188, 170, 57, 152, 108, 235, 221, 1, 145, 156, 107, 183, 60, 89, 28, 36, 50, 72, 221, 182, 213, 112, 144, 11, 236, 225, 185, 159, 43, 90, 130, 245, 59, 65, 254, 25, 123, 208, 118, 99, 233, 66, 159, 165, 155, 158, 6, 101, 77, 200, 63, 77, 181, 10, 202, 26, 39, 85, 245, 18, 89, 95, 46, 164, 32, 55, 50, 66, 215, 176, 56, 156, 91, 26, 125, 140, 182, 145, 143, 235, 74, 208, 148, 60, 239, 74, 27, 76, 15, 3, 115, 223, 42, 11, 182, 100, 152, 125, 159, 234, 173, 177, 106, 204, 242, 188, 99, 190, 150, 23, 69, 58, 85, 16, 179, 95, 225, 28, 127, 245, 27, 111, 181, 51, 227, 247, 108, 120, 115, 145, 120, 167, 220, 126, 168, 235, 26, 55, 247, 18, 221, 196, 47, 11, 168, 146, 212, 165, 210, 45, 14, 237, 195, 0, 160, 57, 3, 118, 156, 176, 199, 156, 188, 213, 238, 97, 218, 124, 218, 92, 215, 75, 13, 164, 161, 156, 139, 68, 23, 133, 21, 59, 66, 114, 237, 170, 237, 124, 68, 122, 123, 20, 106, 18, 13, 223, 166, 120, 53, 33, 229, 124, 153, 143, 109, 181, 207, 203, 96, 26, 136, 10, 159, 18, 159, 62, 130, 95, 79, 237, 249, 163, 99, 146, 183, 247, 12, 224, 97, 155, 24, 130, 227, 215, 38, 152, 127, 1, 237, 92, 15, 185, 165, 11, 8, 91]
  }
};

const oraclize6 = {
  name: 'oraclize6',
  verifiable: false, // unverifiable due to the instance not beeing online anymore (TLSN oracles had to be updated since the reliable_sites were not available anymore)
  main: {
    IP: '54.226.2.137',
    port: '10011',
    DI: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2019-01-01&InstanceId=i-0441b1549e6dd7a56&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=F6aqDDAYomEltO3JCP%2FdVOr0r%2FoqaR%2FfUhFholQa9vw%3D',
    DV: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-0c91fe09ff8945ba5&Signature=T9VHwfNi2KAa34aQFAyaSamulTESrg1OUk70aWujG4I%3D',
    GCO: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2019-01-01&InstanceId=i-0441b1549e6dd7a56&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=06WHUv5JE1w%2BpOmnel5uDYFAzeYi%2BpoDxaRYhnVgEtU%3D',
    GU: 'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=P7KohfMsstvrdvsDZVsaC1vWWnXgPUT9d2%2B0AdrOC0A%3D',
    DIA: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2019-01-01&InstanceId=i-0441b1549e6dd7a56&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=I95C8Efx9gE9AnRcpAQ1fmm7sl4rAwcCnQWitYvCxsA%3D',
    instanceId: 'i-0441b1549e6dd7a56'
  },
  sig: {
    modulus: [224, 17, 214, 115, 152, 207, 24, 236, 145, 65, 236, 182, 219, 189, 122, 202, 216, 127, 25, 94, 166, 20, 144, 152, 99, 19, 144, 106, 55, 250, 82, 151, 23, 209, 164, 246, 45, 129, 204, 253, 239, 144, 114, 126, 48, 243, 30, 129, 186, 65, 118, 213, 21, 206, 146, 83, 1, 108, 185, 63, 235, 98, 207, 212, 166, 34, 164, 99, 21, 185, 204, 117, 17, 80, 88, 188, 23, 51, 159, 220, 106, 222, 10, 96, 195, 36, 175, 45, 221, 31, 179, 127, 139, 171, 243, 128, 107, 126, 108, 168, 116, 171, 94, 102, 116, 139, 160, 89, 71, 92, 72, 106, 241, 193, 140, 211, 114, 112, 5, 88, 138, 27, 232, 4, 229, 67, 167, 149, 112, 94, 246, 135, 55, 78, 249, 169, 52, 40, 85, 206, 71, 48, 165, 147, 59, 229, 177, 66, 144, 71, 26, 42, 201, 181, 36, 190, 143, 90, 242, 211, 30, 147, 17, 183, 204, 43, 158, 149, 232, 65, 240, 181, 65, 209, 198, 70, 81, 156, 153, 83, 187, 96, 73, 249, 238, 139, 43, 110, 90, 253, 232, 234, 158, 17, 89, 200, 159, 72, 114, 130, 233, 162, 56, 96, 182, 129, 116, 207, 186, 185, 8, 165, 204, 235, 239, 196, 123, 250, 168, 73, 156, 209, 225, 174, 167, 181, 106, 248, 181, 103, 32, 110, 46, 122, 44, 33, 30, 72, 179, 242, 33, 246, 4, 244, 132, 51, 174, 180, 10, 210, 252, 207, 31, 143, 206, 155, 139, 13, 131, 116, 75, 154, 29, 204, 217, 24, 161, 46, 77, 204, 10, 79, 183, 186, 114, 8, 85, 51, 110, 177, 37, 243, 65, 228, 78, 132, 111, 205, 156, 155, 150, 4, 201, 82, 22, 138, 59, 91, 89, 35, 108, 201, 91, 215, 43, 94, 115, 214, 170, 239, 73, 133, 221, 242, 157, 176, 85, 132, 36, 200, 141, 251, 130, 235, 12, 69, 39, 221, 230, 59, 207, 118, 180, 91, 13, 67, 38, 105, 160, 45, 25, 93, 214, 68, 6, 230, 72, 149, 120, 33, 143, 40, 16, 200, 83, 184, 22, 75, 190, 173, 206, 189, 203, 126, 204, 243, 56, 43, 76, 94, 12, 255, 1, 116, 250, 251, 36, 160, 255, 206, 228, 13, 84, 229, 98, 86, 201, 102, 32, 42, 35, 248, 127, 158, 88, 46, 245, 44, 113, 81, 251, 186, 20, 165, 137, 248, 73, 206, 41, 45, 195, 119, 164, 213, 71, 150, 88, 51, 188, 48, 91, 218, 76, 14, 227, 42, 250, 203, 254, 155, 246, 72, 81, 160, 29, 74, 58, 176, 146, 30, 78, 108, 218, 42, 238, 105, 123, 161, 117, 1, 169, 82, 149, 246, 132, 110, 168, 192, 34, 85, 64, 13, 141, 18, 141, 239, 212, 202, 108, 30, 4, 102, 17, 105, 44, 241, 41, 191, 244, 80, 251, 184, 92, 110, 144, 92, 66, 81, 211, 40, 249, 210, 32, 199, 199, 66, 226, 67, 4, 95, 12, 173, 103, 179, 201, 157, 46, 135, 166, 214, 28, 159]
  }
};

const oraclize7 = {
  name: 'oraclize7',
  verifiable: false, // unverifiable due to the instance not beeing online anymore (TLSN oracles had to be updated since the reliable_sites were not available anymore)
  main: {
    IP: '52.207.238.28',
    port: '10011',
    DI: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2019-01-01&InstanceId=i-06ab1aa0a097cc3cf&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=Eg3MXnJlrPu8JqcFwLfUCNq%2BfEG76or7JAjSLFlUIZM%3D',
    DV: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-00db8493781c33e4d&Signature=rSuyO51LFJLFSOMzePh4Y40X5aXg8eVKH8kWE4RPi5I%3D',
    GCO: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2019-01-01&InstanceId=i-06ab1aa0a097cc3cf&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=nt%2FJpcDH3QTJF%2B%2BUJ5qukQeVyi%2F%2F79FbcOdGTaAhUF0%3D',
    GU: 'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=P7KohfMsstvrdvsDZVsaC1vWWnXgPUT9d2%2B0AdrOC0A%3D',
    DIA: 'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2019-01-01&InstanceId=i-06ab1aa0a097cc3cf&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=lMJv89gkaWH%2FfqdYfYePGtjneUyxsMH17I%2BaDLT8rww%3D',
    instanceId: 'i-06ab1aa0a097cc3cf'
  },
  sig: {
    modulus: [221, 152, 239, 128, 69, 115, 173, 154, 77, 113, 242, 54, 167, 45, 26, 123, 181, 145, 27, 78, 190, 10, 129, 131, 243, 240, 241, 184, 235, 207, 243, 184, 55, 213, 9, 214, 132, 240, 150, 48, 25, 222, 193, 69, 202, 204, 176, 179, 48, 174, 35, 72, 184, 211, 77, 195, 10, 40, 17, 7, 90, 160, 172, 246, 36, 64, 35, 201, 133, 103, 127, 47, 1, 205, 90, 195, 66, 78, 228, 55, 249, 252, 214, 232, 80, 47, 110, 212, 9, 23, 254, 77, 185, 223, 214, 242, 234, 69, 133, 23, 238, 252, 101, 47, 66, 164, 2, 212, 147, 22, 84, 34, 188, 168, 244, 99, 182, 3, 110, 206, 193, 85, 27, 247, 62, 49, 26, 77, 48, 240, 169, 153, 249, 127, 152, 155, 123, 245, 53, 35, 137, 42, 90, 178, 164, 170, 183, 37, 76, 129, 103, 108, 109, 179, 252, 15, 172, 249, 148, 234, 142, 145, 115, 230, 119, 146, 12, 220, 98, 116, 53, 103, 113, 114, 58, 229, 3, 205, 254, 180, 4, 141, 195, 213, 5, 178, 51, 215, 11, 65, 69, 176, 91, 104, 119, 191, 196, 11, 202, 184, 217, 243, 33, 151, 40, 64, 158, 42, 193, 57, 126, 21, 133, 189, 118, 52, 249, 247, 238, 100, 145, 165, 21, 87, 124, 75, 236, 80, 211, 37, 48, 249, 43, 119, 129, 248, 161, 11, 186, 60, 94, 136, 43, 198, 163, 194, 57, 122, 212, 39, 18, 82, 243, 14, 27, 165, 140, 97, 209, 124, 31, 253, 136, 125, 243, 184, 216, 78, 231, 119, 247, 210, 222, 208, 172, 59, 28, 245, 171, 27, 4, 177, 49, 213, 190, 244, 111, 252, 80, 104, 95, 5, 97, 124, 203, 84, 192, 162, 13, 76, 224, 44, 33, 98, 234, 136, 237, 72, 138, 33, 230, 18, 20, 162, 106, 17, 70, 159, 213, 223, 224, 104, 255, 224, 80, 96, 83, 174, 205, 208, 21, 105, 111, 205, 1, 232, 155, 210, 243, 63, 12, 20, 181, 140, 233, 220, 67, 117, 133, 45, 74, 147, 22, 31, 235, 209, 217, 157, 91, 110, 1, 202, 64, 35, 98, 202, 228, 78, 162, 34, 77, 167, 246, 4, 195, 79, 129, 24, 153, 135, 244, 149, 217, 86, 244, 18, 190, 217, 26, 6, 13, 129, 245, 229, 242, 89, 79, 124, 151, 86, 31, 37, 249, 105, 166, 48, 54, 207, 22, 68, 84, 39, 4, 192, 111, 78, 70, 132, 161, 199, 106, 224, 99, 252, 207, 155, 30, 26, 55, 5, 154, 147, 97, 209, 5, 79, 42, 49, 7, 196, 230, 9, 43, 58, 103, 71, 109, 15, 8, 49, 47, 229, 189, 22, 166, 240, 92, 227, 63, 44, 51, 135, 9, 110, 164, 220, 113, 21, 92, 98, 84, 53, 191, 113, 63, 244, 167, 230, 104, 212, 218, 5, 113, 63, 71, 136, 86, 210, 107, 48, 183, 63, 138, 131, 232, 31, 156, 229, 157, 97, 42, 200, 135, 89, 73, 183, 38, 226, 228, 35, 98, 95]
  }
};

var oraclize8 = {
  name: 'oraclize8',
  verifiable: true,
  main: {
    'IP': '54.88.23.243',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-00911ae14cef82da2&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=DfWV%2BLDIwFRgER9dydptHgn%2B7ogLrl%2FSY%2BDLxSWCQc4%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-02103c9d1b0a3cdde&Signature=%2B5Feri349m0PFERP3J7rG0e9kMplK3OM1xGKw0SYscg%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-00911ae14cef82da2&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=63Ga9fqqLulCZ921DiS%2BEsbWjMs4%2FHcmGJRG9tX8XFo%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=FZNVYWvQICZqzCNfQios%2Fz44FnTWXNKALe0kpeaqNbw%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-00911ae14cef82da2&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=o%2B3fJaHchG7bkyabG%2BST6NkleatXwZgSPPUhUjLCttc%3D',
    'instanceId': 'i-00911ae14cef82da2',
  },
  sig: {
    'modulus': [221,147,104,49,118,191,52,49,194,13,161,115,162,3,15,181,30,156,6,201,186,230,190,49,221,72,3,193,139,131,50,140,242,205,102,252,85,77,95,225,98,248,84,171,253,151,100,196,65,166,153,76,253,41,107,252,85,18,94,85,35,226,139,58,76,253,202,250,54,193,25,65,60,197,22,108,234,17,193,77,197,170,66,58,110,109,196,41,133,0,162,35,250,190,36,35,127,47,200,127,145,37,178,226,109,59,160,175,16,88,213,213,218,25,83,20,194,87,46,191,95,186,26,255,174,117,49,218,51,89,222,0,192,84,151,128,14,12,29,88,211,169,17,87,120,111,69,150,190,233,192,166,29,197,212,143,38,178,33,97,94,94,234,80,24,77,143,244,255,57,219,9,240,126,10,230,121,130,5,131,119,215,12,155,34,197,158,250,205,8,250,129,145,8,92,102,142,84,88,157,90,182,220,169,148,131,233,52,167,52,118,59,237,130,52,180,62,149,85,80,191,107,197,173,157,152,81,141,116,107,46,16,76,235,53,126,138,39,205,109,103,18,17,99,239,125,228,253,85,207,29,143,39,131,179,167,94,33,120,109,191,74,106,56,76,27,137,21,230,113,219,7,170,109,186,24,109,213,74,3,169,23,253,239,92,218,189,241,24,255,248,220,23,101,52,24,217,130,61,216,180,130,149,73,139,49,183,64,36,231,24,102,131,251,253,95,182,66,155,107,249,9,239,202,40,77,216,250,36,103,173,91,94,44,146,233,190,246,4,40,121,205,215,221,146,35,65,77,240,47,82,64,89,87,134,13,50,203,198,17,244,143,17,148,119,50,63,105,123,195,72,16,128,98,95,77,207,138,115,158,78,167,224,254,78,201,20,234,180,63,162,227,82,92,243,22,140,145,145,192,13,148,187,144,141,98,128,205,23,186,165,218,76,160,110,97,121,157,249,184,202,124,22,145,240,84,2,229,80,59,50,199,118,42,250,213,204,82,60,123,41,124,40,50,218,211,205,121,67,113,98,19,147,42,179,177,91,40,156,130,90,116,202,114,44,47,42,140,76,206,104,54,126,31,137,47,72,205,174,125,238,43,250,89,238,42,37,145,194,203,103,209,28,219,227,69,215,246,138,83,17,163,192,85,20,160,168,111,36,244,208,55]}
};

var oraclize9 = {
  name: 'oraclize9',
  verifiable: true,
  main: {
    'IP': '54.173.53.241',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-0112bb534c5cd7884&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=z8%2FBd6MsEjd2iwq7%2FUVCodDsKj7z%2Bz4F4me2Pg%2FQ7Ac%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-04bc4902173068dee&Signature=A6sbh4TjHZWmOeHbfJw0qFz5BWvUrgydFMOco3w32Yc%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-0112bb534c5cd7884&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=cU5KMOKr4XVfXj2y1cThPiz21Zm9x%2FzZGquvBZHSFhE%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=FZNVYWvQICZqzCNfQios%2Fz44FnTWXNKALe0kpeaqNbw%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-0112bb534c5cd7884&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=OIfWcTg%2BCNUH%2F%2FwcWKJszGkL5m4fiM9pPBDMVqX%2F810%3D',
    'instanceId': 'i-0112bb534c5cd7884',
  },
  sig: {
    'modulus': [190,75,203,176,107,186,184,196,150,170,112,226,16,6,137,183,10,87,203,160,95,195,105,68,16,172,247,179,209,70,240,20,19,240,221,100,70,196,98,171,157,14,160,103,196,227,147,139,120,211,55,81,13,177,46,254,206,120,56,23,188,120,167,151,191,41,216,150,85,138,12,199,157,243,110,40,147,246,77,151,156,232,105,177,79,44,175,106,89,34,58,61,155,150,226,174,114,227,131,240,185,202,31,231,24,97,221,56,116,232,235,157,58,79,206,86,166,236,4,151,103,11,245,171,72,213,140,101,138,126,86,154,228,64,33,239,168,63,63,94,89,139,156,7,116,177,102,65,59,165,115,236,37,115,40,179,167,70,27,6,154,36,241,31,101,176,89,155,222,140,70,76,91,77,219,186,255,6,197,49,99,153,181,159,196,75,215,173,102,127,88,205,170,209,255,245,60,5,83,232,210,181,92,62,173,206,183,53,241,133,71,249,67,160,254,57,120,57,201,117,21,229,38,159,214,224,132,25,173,101,51,201,79,188,175,139,132,210,96,249,230,169,102,90,58,56,122,255,136,137,105,228,232,142,144,43,238,74,115,87,92,16,138,56,225,150,212,144,216,175,78,0,89,247,66,108,12,109,161,68,37,144,27,27,198,208,196,53,127,241,118,217,163,147,75,217,230,190,191,153,137,125,103,119,207,43,153,250,134,144,19,159,171,49,15,4,48,7,9,123,121,177,125,195,71,72,247,24,8,96,249,155,238,198,201,38,247,207,195,83,255,146,144,63,233,200,194,201,132,33,127,215,239,89,91,241,132,61,73,226,66,178,156,117,31,92,220,250,127,240,88,218,224,102,163,203,134,143,239,237,117,223,75,180,136,194,159,1,80,220,197,234,215,183,131,138,77,50,203,111,211,203,19,254,77,176,188,199,214,128,164,239,167,239,176,119,242,119,150,119,141,59,172,140,184,26,244,121,103,205,109,225,212,248,51,198,117,15,154,175,157,167,18,116,92,175,22,229,117,125,219,148,96,211,124,179,126,111,181,72,164,100,151,221,43,50,56,76,43,125,146,46,72,14,176,13,237,240,20,165,160,122,205,124,99,183,200,19,25,94,176,85,29,150,209,39,56,46,123,23,83,31,226,137,56,124,141,179,109,175,91,153]},
};

var oraclize10 = {
  name: 'oraclize10',
  verifiable: true,
  main: {
    'IP': '54.234.115.62',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-08f551b769042782e&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=ucfmNBcVlELt2a3MAofsrqpawB3wQSHhpdUEmhoXOc4%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-05f5ddbc973019eac&Signature=wLzD%2Bxhh6s0Gdrm5wlCNRD%2BuScQ%2FAhmOQGFuPZPbOSA%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-08f551b769042782e&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=82N%2BJrtGDd2iSobySHutPVn%2BTQur%2BEIsTYkMneHn60M%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=FZNVYWvQICZqzCNfQios%2Fz44FnTWXNKALe0kpeaqNbw%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJSPYVAEPAJ5GGD2Q&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-08f551b769042782e&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=Y1lyAVxJQ1Uf163rrMlKPjpq2VWDjvzqgAsSCCw0CmM%3D',
    'instanceId': 'i-08f551b769042782e',
  },
  sig: {
    'modulus': [203,7,24,105,90,200,70,241,125,159,52,118,42,153,205,85,91,65,253,253,17,240,164,155,104,243,239,119,191,231,244,27,237,77,61,210,33,205,69,198,184,193,204,144,24,38,159,97,131,88,69,128,53,196,143,46,208,5,227,78,180,204,187,116,159,224,145,148,170,150,157,14,141,66,170,31,72,73,236,221,211,76,207,203,134,186,36,222,230,151,132,113,33,252,204,223,78,205,237,246,23,145,150,236,36,90,208,157,46,178,170,138,3,244,43,68,13,146,181,172,128,235,186,142,43,195,137,181,97,253,74,131,33,41,238,249,173,190,28,8,10,238,52,100,170,133,152,115,61,20,174,206,97,245,50,45,114,209,211,246,243,250,8,188,186,171,6,45,183,166,41,134,17,121,182,116,76,36,162,60,68,228,198,184,72,159,68,212,43,239,102,156,114,43,31,251,122,175,103,41,62,165,152,67,216,99,70,143,231,103,198,2,94,252,135,130,96,131,24,98,250,19,152,95,186,176,201,141,126,163,30,174,183,60,77,158,90,236,81,97,107,240,162,77,238,150,184,131,151,247,218,121,232,192,182,55,147,202,71,179,9,72,85,209,124,178,68,72,86,236,157,125,96,84,13,151,172,140,116,31,169,230,252,61,196,92,255,103,56,75,101,121,204,59,242,228,116,131,253,204,165,209,70,178,93,76,177,94,195,147,126,98,83,16,246,187,148,35,16,4,130,109,254,91,196,198,32,19,70,63,61,173,107,139,238,174,98,23,182,211,127,122,36,124,16,200,207,186,237,165,205,223,207,218,213,203,141,132,62,101,103,173,140,63,3,165,88,84,208,21,150,2,101,55,158,216,217,60,84,181,127,88,75,95,105,135,249,193,119,231,162,108,110,164,154,84,169,180,169,25,11,46,226,72,20,59,59,204,22,155,13,27,229,146,165,239,182,171,235,104,72,245,31,80,96,13,210,201,79,36,196,147,239,31,93,88,232,200,136,70,113,189,138,117,199,150,175,8,72,140,33,230,21,0,29,173,230,184,78,78,179,218,112,72,220,124,189,205,235,176,130,29,223,229,54,86,32,80,197,224,171,133,229,84,17,57,64,46,208,109,29,69,68,174,153,96,39,147,11,234,158,185,59,115,21,87,167,77,253,65,169,111]},
};

// 2 - > new machines starts here
var oraclize11 = {
  name: 'oraclize11',
  verifiable: true,
  main: {
    'IP': '54.90.171.106',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-01a3fe9c926ccd181&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=X1II446xz0sM%2BtQQzOgZx7ODegUwPiFHRlae8qmxB1M%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-09c752eb8c59d0a41&Signature=ETjWXwX3hbMRL5Jqu6ah7bnZwoV8qU1%2Fn8G4ObZUx70%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-01a3fe9c926ccd181&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=MOO1dGaCu3vSF5AG0ylf19dbOGUkFLtUGbMcUcXGzZk%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=A4P5hWtjdPl%2BqQZqUVAza6HIMmkZTN%2BIzwPsVXNJgnA%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-01a3fe9c926ccd181&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=k58qxq7xNtRHvHZlzcTg1SoetZfqsmPmpHWkCYuh5rQ%3D',
    'instanceId': 'i-01a3fe9c926ccd181',
  },
  sig: {
    'modulus': [180,36,242,152,65,114,52,135,250,67,20,54,183,52,45,125,179,119,160,173,116,199,23,126,51,167,122,37,205,238,143,238,3,114,31,195,18,167,119,89,87,19,157,188,209,50,188,254,200,43,87,140,100,25,45,212,103,146,94,102,174,48,118,43,206,191,92,144,233,184,254,120,142,63,237,2,98,160,138,233,147,0,161,122,172,14,112,64,250,245,22,134,3,90,56,85,20,139,89,72,132,213,67,66,243,41,45,188,113,184,166,212,174,252,243,194,80,241,70,163,214,152,91,178,54,198,190,191,239,140,254,159,4,244,190,201,3,133,252,160,137,204,173,228,223,254,1,139,166,51,16,251,109,228,11,100,82,91,100,114,107,173,174,122,222,87,243,13,71,124,2,105,63,8,108,58,12,233,49,239,42,83,64,20,168,211,139,130,204,201,51,74,109,41,42,202,38,77,190,233,203,244,108,27,168,153,168,76,182,167,227,253,179,64,244,199,173,51,229,206,170,227,177,176,210,11,203,105,100,80,27,30,178,137,220,94,163,124,69,107,103,148,2,73,99,248,17,102,137,67,78,198,44,59,194,60,70,83,5,31,253,164,217,135,250,138,30,78,141,25,215,17,222,33,1,33,21,3,147,246,95,58,141,238,60,192,240,40,147,123,101,30,198,242,190,167,82,181,62,28,70,145,219,79,58,111,139,213,29,94,108,96,165,5,29,34,109,175,53,107,79,148,232,164,212,232,154,14,106,80,9,53,115,229,85,31,175,239,205,123,14,141,230,166,162,227,139,151,78,14,245,143,81,164,184,136,154,254,137,122,165,27,224,115,243,198,151,35,14,245,150,167,95,38,187,41,48,151,45,127,64,142,136,119,12,246,216,48,49,2,160,19,100,169,59,232,180,115,153,185,195,26,177,253,248,200,143,41,136,112,69,11,251,72,251,3,143,184,138,245,51,30,37,55,28,223,208,91,55,72,233,17,65,120,154,233,163,255,188,111,59,34,128,251,159,139,210,176,188,34,227,118,40,120,42,225,79,50,49,197,114,235,134,210,105,231,162,218,223,226,88,40,209,45,215,143,54,126,170,85,6,13,168,241,132,184,69,43,206,46,174,9,41,188,247,226,64,254,59,98,69,208,250,47,47,30,151,124,22,62,221,71]},
};

// 3
var oraclize12 = {
  name: 'oraclize12',
  verifiable: true,
  main: {
    'IP': '35.153.80.132',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-0296854c5b7300d31&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=WbKm%2BuTDJCP1He6qJAgUdXIVX%2F6r5spLdr2SmjXI9Kk%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-03b0dedfe8529fb20&Signature=Aq9hxB4LizjXs3NLipowvJ16JdlhstQ8Xes%2BN%2BgXgJA%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-0296854c5b7300d31&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=zrek7N1S%2F391ceYDUy0Kv5DnRpuHt9jamUvBRY5vmvc%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=A4P5hWtjdPl%2BqQZqUVAza6HIMmkZTN%2BIzwPsVXNJgnA%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-0296854c5b7300d31&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=ag0DrruGZJlejZ8F1ngcLc0Bne54D80EMgqksLabxXI%3D',
    'instanceId': 'i-0296854c5b7300d31',
  },
  sig: {
    'modulus': [237,5,234,190,99,158,199,212,190,203,138,51,160,136,119,252,199,94,97,67,18,3,185,70,30,167,224,1,3,55,176,136,19,232,108,255,141,124,161,124,147,216,5,24,16,149,245,253,242,144,77,157,223,130,134,69,2,46,54,79,231,33,220,222,53,145,3,232,13,8,186,46,128,80,143,92,127,147,237,32,232,181,104,23,129,188,22,162,16,185,52,34,15,160,137,248,47,0,184,188,70,218,14,165,134,213,243,82,34,77,193,217,243,146,46,239,196,228,131,102,169,60,11,180,247,109,226,131,64,149,199,161,112,83,9,191,106,153,174,51,70,134,236,217,186,96,106,170,218,174,248,186,147,65,219,136,78,213,52,129,222,171,74,127,214,153,110,97,39,145,133,133,176,137,118,19,118,151,19,57,26,8,201,19,102,24,73,109,238,209,146,91,168,159,55,229,238,97,138,59,205,234,61,35,232,17,43,91,166,199,188,55,184,216,106,122,159,60,183,133,112,112,59,14,134,49,103,95,21,137,205,75,137,136,204,246,39,142,54,218,212,68,145,15,52,219,236,81,223,18,111,129,213,128,55,117,220,54,79,97,46,202,29,175,198,51,88,236,232,62,93,41,224,210,139,151,48,200,228,190,216,209,44,247,253,109,239,169,71,194,227,7,73,106,98,221,255,96,138,152,193,40,167,202,187,204,141,86,146,244,1,11,49,172,70,140,124,142,106,166,141,53,145,200,47,138,127,35,130,254,70,31,100,152,26,87,41,209,68,191,203,16,156,151,224,186,32,83,44,123,190,25,165,79,112,65,6,30,215,44,43,38,233,226,81,170,148,232,147,98,95,118,167,115,166,85,252,0,175,76,53,22,79,27,13,226,14,3,199,94,172,20,246,200,207,107,194,66,194,22,186,249,8,163,175,246,120,250,158,186,139,100,125,148,128,205,86,181,43,247,184,206,43,125,54,202,250,38,237,203,29,107,100,87,5,149,201,141,42,114,208,105,247,206,210,157,179,118,163,87,157,64,162,32,223,215,31,235,37,200,77,58,45,131,25,45,57,106,23,34,63,227,236,205,201,18,156,134,19,181,138,249,172,209,5,8,88,226,22,4,212,130,220,177,158,238,62,115,114,108,34,52,16,78,155,196,13,218,84,38,162,235]},
};

// 4
var oraclize13 = {
  name: 'oraclize13',
  verifiable: true,
  main: {
    'IP': '3.80.217.33',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-01f29fd06f742b7a5&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=0LF1e2n9EiUy7tN92ea41BhpfRKrCiA52FsKU7g4kvk%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-046bd49afd64a4569&Signature=wPp1DS6QF16Z2JWM1ja2X6Faq2Yb1klUJQvG%2B7eVfEU%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-01f29fd06f742b7a5&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=aQsJZYR7Wd2MTexJ4IHR06Lh6mEb3%2F0EETJ75rvMXZg%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=A4P5hWtjdPl%2BqQZqUVAza6HIMmkZTN%2BIzwPsVXNJgnA%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-01f29fd06f742b7a5&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=mRq3D3f6ez8xF4ysMUgaZnkBJgFVtJ0RAi10sbj8YKs%3D', 
    'instanceId': 'i-01f29fd06f742b7a5',
  },
  sig: {
    'modulus': [193,202,34,59,120,214,56,136,47,149,64,90,54,53,130,23,8,22,206,18,193,157,123,156,242,71,123,44,95,10,3,65,201,43,27,139,209,166,119,213,66,182,251,148,35,143,66,235,201,253,86,198,147,45,222,198,103,222,135,215,43,80,4,134,79,55,246,198,123,231,78,139,206,54,57,61,15,169,136,30,37,234,224,211,44,76,191,112,37,204,116,38,39,156,159,40,74,253,185,147,33,38,187,174,242,77,174,114,47,170,226,222,84,47,160,237,232,66,43,208,187,3,124,45,177,61,245,84,194,33,162,72,84,202,229,216,234,85,172,53,106,94,10,79,129,87,123,85,153,83,246,57,42,20,118,253,8,219,217,225,107,233,83,142,167,76,6,15,65,137,103,70,204,12,17,119,197,14,73,15,74,189,177,6,56,31,145,94,59,57,134,177,208,247,140,183,64,233,3,180,224,103,252,46,202,115,207,52,86,32,248,212,178,40,86,51,186,155,199,105,10,58,236,138,211,89,147,49,193,174,248,253,23,211,132,209,11,21,107,149,218,144,93,7,179,75,105,174,101,24,239,160,99,47,241,186,101,3,3,21,160,229,215,181,243,205,245,241,85,77,41,1,232,229,102,3,167,166,107,81,152,243,149,34,121,134,158,163,37,170,72,213,253,248,227,135,200,110,195,161,191,122,31,3,197,149,84,105,189,254,235,232,114,139,223,94,143,103,140,187,83,89,251,7,170,183,137,1,103,65,235,135,165,87,125,128,120,74,15,18,247,65,78,110,28,80,205,29,117,156,43,226,101,10,210,193,134,82,143,236,168,35,212,208,121,70,99,64,126,142,18,9,191,116,238,8,39,118,94,126,27,76,12,125,220,60,22,55,37,255,31,217,7,112,119,115,253,4,24,64,50,72,67,20,243,236,181,20,251,203,242,78,213,41,168,46,127,58,72,22,193,4,137,103,195,83,160,48,117,215,56,225,215,171,207,12,52,63,73,95,116,156,60,31,94,175,195,96,23,205,207,62,230,29,140,112,221,27,150,143,25,153,187,136,107,183,157,126,189,253,209,186,176,143,135,180,197,117,194,82,203,188,248,228,111,208,57,163,181,116,93,217,103,72,136,35,29,23,154,43,238,43,32,251,130,248,221,31,112,242,132,113]},
};

// 5
var oraclize14 = {
  name: 'oraclize14',
  verifiable: true,
  main: {
    'IP': '3.88.9.181',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-0938de20a885d5280&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=v2sug7%2BQSSNEFmlQ9qrNFskIvqw3EuZ7%2BNocilEItd8%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-048b491c51e07cbbd&Signature=uhFBLwmG%2FSwgApnOZw7NK4B8tZ3BpKfzljbtxTtrHaE%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-0938de20a885d5280&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=u7CJns1I9UK5rtLkg4bZoCthmng82Xf0ojJtSxSJqaI%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=A4P5hWtjdPl%2BqQZqUVAza6HIMmkZTN%2BIzwPsVXNJgnA%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-0938de20a885d5280&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=i2cchulG0WvyBunp7TaLmyPNopunwgodO%2BW7H0nQrIQ%3D',
    'instanceId': 'i-0938de20a885d5280',
  },
  sig: {
    'modulus': [215,79,2,5,38,194,57,100,226,13,149,201,44,239,198,242,172,235,44,100,71,15,158,19,3,163,17,210,93,18,91,36,34,10,135,77,6,97,186,48,181,230,230,214,113,196,37,37,249,30,196,142,97,180,146,140,216,50,198,253,157,179,183,26,66,247,166,173,84,66,189,56,79,33,246,228,200,159,32,28,81,164,14,207,151,236,41,174,16,116,129,161,218,254,195,131,102,42,10,40,71,209,127,235,120,32,122,83,94,86,170,184,245,170,39,51,113,11,136,146,251,12,1,88,105,67,91,207,41,148,218,79,6,246,232,3,46,139,205,163,234,225,66,143,66,118,71,250,86,205,140,61,92,189,195,214,194,149,91,166,35,121,105,196,45,203,236,223,230,193,247,251,71,193,8,105,100,69,163,227,175,27,90,209,58,142,157,205,236,119,174,93,185,114,36,46,39,228,159,47,237,165,181,223,22,99,65,157,86,114,229,196,137,222,98,222,177,110,104,29,49,238,69,35,204,235,145,82,12,123,213,83,54,250,206,62,25,104,116,190,230,53,48,110,196,130,119,63,85,84,17,57,1,99,171,128,181,10,205,129,73,103,25,211,123,42,109,111,9,211,156,152,179,23,83,141,67,23,45,41,239,101,23,65,122,186,66,69,5,226,188,226,132,179,115,100,24,138,187,15,229,130,9,203,160,81,110,167,76,66,234,185,231,113,155,12,244,133,96,100,171,181,85,21,138,182,9,82,33,98,197,155,43,252,252,157,61,219,76,73,232,239,128,119,111,80,65,133,154,52,186,44,185,97,36,254,96,75,131,204,123,157,125,135,194,80,217,208,22,33,247,240,74,238,140,42,6,107,26,215,229,218,88,196,186,249,154,15,230,253,188,219,149,5,108,12,42,152,181,67,13,150,183,217,245,201,205,192,98,228,101,188,70,99,120,71,196,104,13,226,130,128,229,29,211,7,3,191,109,111,133,215,71,96,135,65,235,100,235,108,160,191,56,43,52,155,134,27,68,242,103,0,16,23,175,204,104,86,106,166,20,213,237,116,147,251,95,40,236,100,231,184,74,236,35,198,185,15,172,162,114,94,46,51,133,51,55,94,222,119,224,68,169,181,92,128,183,160,42,63,103,121,17,248,152,98,148,54,84,179,241,183]},
};

// 6
var oraclize15 = {
  name: 'oraclize15',
  verifiable: true,
  main: {
    'IP': '54.89.175.198',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-009a8331ca5c17d15&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=aoYJPe0nNAj5uRXsHGLsof%2BfJwRHDRDdch4f3f8Ja40%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-0bd265511a704234c&Signature=7Fl1aqK2v91obLjJdwls%2Ft56HJGi5MMmtQoPR1PmjrA%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-009a8331ca5c17d15&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=gVh9K9y%2B%2Bwd6AklBQcI4Dmkk%2F%2F5Is%2BKheQFqblQgmfE%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=A4P5hWtjdPl%2BqQZqUVAza6HIMmkZTN%2BIzwPsVXNJgnA%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-009a8331ca5c17d15&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=WVuiwWNQfVjgX8viACXBu%2Bbsgso9sOiVIxgbejal6g0%3D',
    'instanceId': 'i-009a8331ca5c17d15',
  },
  sig: {
    'modulus': [201,136,12,66,212,9,188,213,61,1,24,147,125,170,119,156,133,67,60,149,62,136,95,125,188,157,60,234,140,21,69,145,244,116,153,157,75,235,61,182,41,116,90,218,67,82,31,76,61,187,167,136,35,217,249,106,97,49,130,30,126,125,62,229,141,185,70,35,146,9,39,45,111,49,124,26,48,184,167,216,128,248,128,221,36,149,149,155,149,137,77,228,92,134,201,54,79,36,80,14,242,105,184,159,108,233,154,119,109,85,42,8,208,118,251,113,80,145,2,38,117,220,199,114,146,47,141,186,188,139,253,140,20,188,6,21,39,233,135,37,123,146,114,129,180,237,202,44,93,228,6,50,90,95,100,243,47,42,50,197,8,161,21,52,118,217,189,190,112,17,53,192,11,174,212,34,246,233,203,26,230,149,79,176,46,196,247,30,44,223,20,8,27,130,231,218,138,10,160,202,98,111,134,1,52,150,167,2,95,246,0,89,28,232,182,124,114,87,162,52,61,183,168,124,156,84,63,198,210,135,193,13,63,123,15,189,106,106,233,230,51,246,1,131,91,196,150,197,51,84,68,238,160,53,35,64,14,200,122,107,46,70,92,158,180,52,8,22,155,222,82,102,126,171,175,129,158,224,130,26,93,133,46,209,237,154,61,159,195,81,192,252,61,57,59,29,190,223,214,210,194,51,77,149,32,142,33,241,229,93,81,201,71,33,111,26,11,184,219,194,6,57,222,96,225,169,199,98,166,21,106,188,21,6,251,175,78,239,253,190,86,30,203,40,198,90,177,14,9,65,37,96,38,183,43,87,223,193,117,132,199,59,85,48,248,189,81,70,71,154,110,121,125,28,60,42,195,244,68,175,124,86,137,206,101,12,208,4,153,81,196,181,23,38,39,250,38,224,115,223,46,136,94,141,232,198,111,211,25,160,6,156,124,74,108,38,143,197,185,130,229,214,60,36,67,45,126,214,187,139,61,193,214,100,148,2,133,103,226,22,165,223,86,15,166,3,35,199,5,152,231,6,244,42,20,245,138,229,200,238,150,97,59,95,21,186,32,167,245,140,136,4,146,145,56,117,176,254,58,133,63,60,26,103,65,105,43,198,1,121,176,119,25,127,208,238,210,127,44,186,210,120,89,152,107,88,154,194,50,72,91,203]},
};

// 7
var oraclize16 = {
  name: 'oraclize16',
  verifiable: true,
  main: {
    'IP': '52.87.91.1',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-003e74d7cab90c47f&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=VVY6FLW8r8ntMUYk497EmFhZjMDX5WhfaWDaiAkup8A%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-0535d6e00ee52da8e&Signature=%2Bbg0iDBrWapri%2FpDeQSJcMwWfRUaq6UYZ0RR8SgFkwI%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-003e74d7cab90c47f&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=OeK275jIpDebuOSMQbh4a7VfhGVSNiKhtQA1EAqfztA%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=A4P5hWtjdPl%2BqQZqUVAza6HIMmkZTN%2BIzwPsVXNJgnA%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-003e74d7cab90c47f&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=kPwz%2FP3sYXSOHaw5oOZKX4FLilfbzg7euUqA4nTHKpU%3D',
    'instanceId': 'i-003e74d7cab90c47f',
  },
  sig: {
    'modulus': [243,148,194,102,222,150,216,47,200,252,132,104,140,244,12,52,203,56,150,133,52,97,44,41,78,11,248,98,136,56,172,39,159,139,0,233,232,49,125,174,150,179,157,86,150,47,28,17,45,176,37,44,198,52,160,239,6,65,110,70,74,123,255,130,119,173,76,205,210,92,122,211,64,31,254,87,222,235,78,227,224,120,94,50,194,179,76,138,241,160,18,154,194,154,173,108,147,75,172,211,105,183,179,81,119,183,167,31,41,40,108,66,132,20,80,243,29,106,244,95,225,179,129,115,53,119,253,169,27,60,154,189,37,168,91,191,108,25,226,243,87,33,84,248,8,52,121,96,147,122,187,232,99,244,89,128,118,187,47,150,245,7,10,85,90,28,114,248,153,56,239,214,229,131,41,28,180,67,208,47,46,159,158,150,57,4,14,178,182,26,9,241,76,191,16,173,140,182,238,61,212,16,223,144,54,179,86,233,61,27,40,114,224,200,195,41,29,203,46,248,82,231,42,47,6,106,5,117,19,145,106,149,199,146,215,164,247,39,74,218,208,85,135,127,108,135,232,111,66,163,85,155,157,186,177,1,21,239,82,186,153,19,198,23,129,152,180,200,0,118,200,175,67,45,100,29,6,229,167,3,193,43,194,95,104,96,11,155,231,172,10,67,50,90,98,88,190,82,190,214,251,85,40,192,45,83,124,185,97,249,16,122,39,25,92,125,226,41,9,105,184,29,109,151,195,6,178,26,219,191,23,29,207,173,173,196,118,213,172,242,226,250,177,209,113,78,233,81,160,17,54,141,48,23,244,140,24,98,141,60,29,8,86,244,22,93,120,255,216,116,237,182,118,204,204,213,118,32,164,40,136,222,212,71,16,189,178,230,95,197,172,58,217,154,50,58,142,193,147,230,146,151,16,107,66,60,70,208,101,241,178,61,123,134,129,130,39,201,144,6,126,32,50,110,22,203,178,101,252,56,41,63,227,6,150,169,175,83,251,9,131,200,76,179,64,74,253,163,125,86,237,243,181,143,230,35,78,209,181,213,18,40,199,46,175,42,159,146,28,85,42,221,23,74,214,61,160,96,234,220,177,175,53,34,223,45,18,104,131,66,11,4,79,156,226,92,97,56,216,230,34,198,187,123,179,23,229,5,57,213,237,125]},
};

// 8
var oraclize17 = {
  name: 'oraclize17',
  verifiable: true,
  main: {
    'IP': '3.86.80.132',
    'port': '10011',
    'DI':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstances&Expires=2025-01-01&InstanceId=i-0a487e4d8fb168746&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=mpeWuZXjzkufaJkYo8ke9t6XZ7tMHgWNOr8dbGtOVKE%3D',
    'DV':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeVolumes&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-0fb30933ccdf837b3&Signature=WaEYe9gpe6Sok6IsnwhGSuBRe9265oCPjMQyrNllAqs%3D',
    'GCO':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetConsoleOutput&Expires=2025-01-01&InstanceId=i-0a487e4d8fb168746&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=NT%2FosSo3yzrOBo1TmV7uoQ%2FEL%2Fv27BtiKPlc%2B26Etqw%3D',
    'GU':'https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=GetUser&Expires=2025-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=A4P5hWtjdPl%2BqQZqUVAza6HIMmkZTN%2BIzwPsVXNJgnA%3D',
    'DIA':'https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7HKDWUFJDL6VZHQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2025-01-01&InstanceId=i-0a487e4d8fb168746&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=PewJmW05FPpmBShFNsJRo4XWm%2Fypy0TCrB%2B4U4Q40Mw%3D',
    'instanceId': 'i-0a487e4d8fb168746',
  },
  sig: {
    'modulus': [180,205,56,13,193,178,63,226,141,220,115,133,149,169,94,235,189,246,92,191,221,40,97,105,97,229,51,3,71,37,155,210,55,48,69,20,8,9,173,41,103,144,75,59,41,225,240,20,155,36,59,92,235,12,208,20,12,105,55,239,10,240,181,39,246,19,88,187,143,60,143,112,71,89,33,239,210,188,38,110,146,108,40,233,37,93,89,208,6,173,51,179,131,243,188,36,9,55,225,99,16,157,80,34,184,249,205,147,123,196,234,188,121,178,42,144,247,7,152,175,246,1,232,235,208,154,93,60,185,74,254,235,104,234,38,183,26,240,156,192,202,253,252,215,87,12,251,205,72,24,211,211,172,143,144,161,139,161,43,91,152,25,140,103,160,220,183,166,176,136,172,158,178,199,233,200,119,145,184,116,6,225,215,163,227,241,106,172,232,98,72,181,58,61,208,157,173,22,99,46,75,186,77,146,59,151,210,88,130,10,35,28,82,158,95,147,8,239,49,249,113,184,117,95,95,198,130,30,92,136,97,232,23,69,170,6,153,250,242,182,53,214,226,220,48,155,124,120,227,92,86,49,42,241,44,104,41,172,249,43,131,31,29,179,6,230,181,98,34,86,51,68,169,246,79,80,88,114,254,169,186,216,10,227,144,210,203,203,242,182,20,149,223,24,98,205,111,120,234,188,97,116,194,139,63,221,58,39,196,67,190,30,254,17,249,192,127,66,172,232,103,218,251,51,204,83,11,201,163,245,35,0,130,45,33,149,92,147,95,227,145,130,74,178,246,108,84,22,115,232,14,72,35,159,232,216,74,168,35,144,129,142,112,76,166,126,114,9,93,200,131,228,19,251,186,108,160,80,117,78,234,163,210,51,11,121,249,255,164,113,251,185,164,234,110,108,149,64,91,79,128,216,96,84,52,144,155,241,73,98,87,134,122,96,124,191,158,155,88,119,232,8,125,6,27,221,126,102,13,182,86,27,118,101,141,221,132,102,169,188,241,221,187,48,200,242,70,58,149,142,187,63,194,30,214,110,59,243,195,96,128,89,108,146,180,8,153,2,207,184,83,244,164,8,94,101,124,162,13,94,180,215,26,43,130,76,130,217,231,230,8,234,251,23,85,141,31,200,192,42,4,192,206,138,184,154,119,92,82,61,115,29]},
};

// There can be potentially multiple oracles to choose from
exports.servers = new Array(1);
// 1st index denotes the tlsn proof version
exports.servers.push([oraclize4]);
exports.servers.push([oraclize5, oraclize6, oraclize7, oraclize8, oraclize9, oraclize10, oraclize11, oraclize12, oraclize13, oraclize14, oraclize15, oraclize16, oraclize17]);
