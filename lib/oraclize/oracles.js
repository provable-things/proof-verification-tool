var kernelId = 'aki-503e7402';
var snapshotID_main = 'snap-cdd399f8';
var snapshotID_sig = 'snap-00083b35';
var imageID_main = 'ami-5e39040c';
var imageID_sig = 'ami-88724fda';
var oracles_intact = false; //must be explicitely set to true


var local1 = {
    "name": "local1",
    "main": {
        "IP": "localhost",
        "port": "10011"
    },
    "sig": {
        "modulus": [215, 74, 157, 189, 225, 84, 124, 238, 135, 250, 223, 150, 83, 215, 130, 154, 222, 184, 43, 205, 133, 160, 176, 8, 52, 155, 87, 117, 197, 229, 246, 0, 64, 184, 40, 78, 129, 72, 186, 146, 56, 29, 45, 31, 227, 143, 41, 210, 158, 57, 140, 144, 133, 147, 160, 174, 233, 4, 7, 218, 170, 207, 121, 87, 56, 147, 149, 1, 40, 240, 136, 166, 62, 168, 25, 83, 154, 79, 37, 127, 135, 161, 155, 79, 86, 248, 117, 255, 244, 202, 254, 215, 118, 139, 39, 112, 242, 36, 26, 109, 140, 32, 247, 187, 23, 71, 78, 108, 189, 85, 123, 144, 16, 200, 167, 28, 192, 13, 173, 18, 251, 221, 216, 215, 233, 78, 151, 169, 75, 96, 96, 244, 15, 150, 156, 24, 217, 117, 71, 199, 116, 184, 212, 159, 5, 23, 11, 146, 0, 189, 46, 2, 18, 149, 38, 77, 236, 202, 200, 113, 143, 255, 46, 36, 234, 204, 79, 142, 182, 181, 131, 30, 201, 145, 86, 235, 109, 18, 117, 93, 36, 224, 235, 70, 82, 183, 39, 32, 129, 78, 222, 88, 46, 93, 170, 78, 104, 133, 26, 227, 31, 252, 204, 221, 255, 79, 53, 221, 63, 183, 116, 212, 125, 102, 163, 235, 213, 144, 186, 11, 247, 227, 8, 252, 49, 53, 66, 88, 13, 79, 173, 124, 193, 122, 240, 167, 151, 154, 152, 189, 223, 12, 199, 34, 30, 127, 244, 135, 82, 176, 18, 121, 8, 231, 151, 93, 232, 181, 29, 26, 180, 92, 197, 156, 201, 210, 110, 100, 182, 168, 88, 98, 129, 69, 84, 111, 144, 138, 249, 47, 65, 136, 245, 51, 184, 233, 106, 30, 7, 54, 114, 242, 155, 25, 127, 198, 129, 252, 18, 7, 161, 158, 247, 69, 254, 250, 38, 235, 109, 21, 35, 133, 105, 62, 204, 182, 69, 152, 237, 5, 204, 102, 30, 142, 184, 132, 206, 188, 189, 78, 75, 72, 164, 216, 87, 7, 154, 254, 163, 163, 85, 227, 154, 121, 15, 98, 131, 226, 67, 145, 255, 135, 193, 148, 218, 81, 157, 152, 170, 33, 70, 77, 177, 183, 29, 84, 117, 39, 21, 53, 138, 75, 21, 231, 148, 149, 144, 122, 52, 132, 219, 35, 200, 91, 228, 171, 80, 212, 34, 88, 60, 198, 91, 193, 105, 251, 100, 169, 41, 68, 25, 160, 131, 184, 247, 199, 5, 152, 47, 143, 107, 7, 240, 22, 56, 150, 10, 204, 110, 200, 179, 117, 20, 147, 94, 137, 207, 196, 67, 94, 108, 4, 56, 157, 102, 176, 110, 83, 62, 4, 168, 64, 120, 110, 23, 172, 131, 100, 23, 104, 19, 159, 36, 152, 132, 235, 137, 236, 25, 233, 225, 55, 239, 79, 147, 72, 226, 79, 39, 26, 200, 214, 15, 161, 43, 236, 198, 235, 236, 76, 19, 80, 223, 28, 120, 39, 15, 233, 251, 181, 101, 203, 202, 45, 6, 180, 244, 86, 211, 41, 99, 108, 42, 221, 215, 182, 214, 10, 176, 243, 99, 157]
    }
}


var waxwing = {
    "name": "tlsnotary test server",
    "main": {
        "IP": "109.169.23.122",
        "port": "8080"
    },
    "sig": {
        "modulus": [224, 117, 88, 3, 77, 22, 21, 87, 102, 16, 49, 34, 212, 117, 228, 143, 107, 119, 84, 137, 127, 133, 182, 197, 78, 228, 53, 44, 99, 148, 120, 52, 229, 237, 38, 170, 114, 203, 155, 241, 7, 125, 255, 187, 163, 50, 194, 175, 189, 187, 104, 38, 15, 60, 226, 225, 9, 244, 92, 172, 223, 189, 152, 53, 69, 71, 241, 61, 26, 21, 252, 130, 202, 3, 95, 171, 200, 91, 72, 152, 2, 102, 50, 15, 30, 139, 63, 162, 3, 1, 132, 24, 30, 181, 130, 215, 74, 43, 209, 240, 227, 13, 229, 117, 70, 176, 79, 82, 15, 164, 189, 115, 138, 228, 250, 96, 88, 36, 181, 185, 130, 92, 255, 29, 100, 245, 83, 14, 96, 149, 27, 3, 51, 222, 17, 49, 48, 151, 130, 242, 107, 69, 74, 47, 134, 190, 233, 160, 9, 202, 103, 168, 33, 82, 60, 227, 232, 18, 47, 204, 216, 119, 132, 213, 234, 214, 56, 141, 149, 227, 113, 141, 243, 219, 190, 113, 233, 108, 153, 36, 249, 139, 217, 95, 1, 124, 141, 42, 233, 209, 140, 167, 191, 172, 249, 12, 32, 5, 139, 219, 80, 42, 144, 108, 162, 101, 90, 23, 224, 71, 150, 229, 227, 95, 219, 194, 226, 106, 238, 167, 72, 37, 172, 105, 219, 78, 84, 99, 137, 213, 72, 156, 65, 216, 105, 92, 163, 152, 158, 195, 170, 169, 200, 146, 163, 233, 35, 2, 75, 66, 38, 108, 63, 98, 197, 47, 52, 242, 129, 226, 220, 182, 58, 34, 214, 205, 79, 131, 250, 136, 167, 203, 130, 181, 81, 85, 29, 17, 153, 17, 62, 157, 219, 9, 178, 171, 245, 214, 129, 9, 92, 166, 234, 230, 67, 87, 132, 190, 106, 16, 59, 236, 49, 24, 230, 93, 4, 211, 222, 236, 64, 246, 248, 163, 5, 150, 183, 208, 58, 23, 73, 244, 209, 10, 230, 175, 56, 169, 1, 160, 53, 87, 154, 221, 27, 135, 125, 229, 77, 54, 174, 178, 10, 189, 249, 68, 232, 56, 117, 178, 130, 142, 7, 142, 116, 55, 124, 48, 7, 254, 179, 78, 162, 248, 156, 35, 126, 53, 238, 148, 63, 152, 180, 16, 237, 241, 147, 246, 7, 137, 126, 119, 146, 49, 244, 38, 197, 42, 112, 84, 152, 147, 58, 122, 60, 26, 79, 216, 111, 74, 171, 183, 64, 247, 245, 224, 34, 237, 10, 255, 167, 199, 180, 189, 122, 50, 230, 114, 14, 180, 85, 127, 155, 67, 142, 202, 203, 243, 130, 120, 146, 117, 185, 51, 100, 91, 12, 198, 61, 182, 157, 59, 64, 127, 66, 42, 36, 179, 188, 219, 171, 23, 129, 162, 189, 90, 163, 105, 56, 139, 99, 43, 11, 9, 162, 131, 243, 65, 52, 191, 154, 166, 165, 250, 167, 180, 190, 226, 146, 127, 13, 115, 0, 33, 198, 134, 191, 17, 100, 165, 13, 251, 216, 36, 61, 222, 60, 59, 219, 41, 6, 123, 243, 182, 213, 38, 109, 125, 194, 176, 97, 11]
    }
}


var oracle = {
    "name": "tlsnotarygroup1",
    "main": {
        "IP": "52.74.29.34",
        "port": "10011",
        "DI": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAIHF5FKKL7SKLLJNQ&Action=DescribeInstances&Expires=2018-01-01&InstanceId=i-e2f28d2f&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=u6rcenB%2Feng0c%2FMknOEJu7nbb8s0qHd84AJmF1pLTCc%3D",
        "DV": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAIHF5FKKL7SKLLJNQ&Action=DescribeVolumes&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-70423d7e&Signature=22tBu9aEToc1he01%2BN%2BBn8S6ESPt2ZAOOuCDdCrr7kc%3D",
        "GCO": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAIHF5FKKL7SKLLJNQ&Action=GetConsoleOutput&Expires=2018-01-01&InstanceId=i-e2f28d2f&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=lvCv2bPNLaEcqPv%2FoGef3lN2ni83A%2B5sMBEpnPcb740%3D",
        "GU": "https://iam.amazonaws.com/?AWSAccessKeyId=AKIAIHF5FKKL7SKLLJNQ&Action=GetUser&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=rKqb5XyhcRMCPhIXsUv0ETkcjOBvLr5xskUWpbyGyB8%3D",
        "DIA": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAIHF5FKKL7SKLLJNQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2018-01-01&InstanceId=i-e2f28d2f&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=ntW%2F89MAan9PebvA%2B3%2F4P8qwHWwJ%2B1v0VqoItBAIqAE%3D",
        "instanceId": "i-e2f28d2f"
    },
    "sig": {
        "modulus": [200, 206, 3, 195, 115, 240, 245, 171, 146, 48, 87, 244, 28, 184, 6, 253, 36, 28, 201, 42, 163, 10, 2, 113, 165, 195, 180, 162, 209, 12, 74, 118, 133, 170, 236, 185, 52, 20, 121, 92, 140, 131, 66, 32, 133, 233, 147, 209, 176, 76, 156, 79, 14, 189, 86, 65, 16, 214, 6, 182, 132, 159, 144, 194, 243, 15, 126, 236, 236, 52, 69, 102, 75, 34, 254, 167, 110, 251, 254, 186, 193, 182, 162, 25, 75, 218, 240, 221, 148, 145, 140, 112, 238, 138, 104, 46, 240, 194, 192, 173, 65, 83, 7, 25, 223, 102, 197, 161, 126, 43, 44, 125, 129, 68, 133, 41, 10, 223, 94, 252, 143, 147, 118, 123, 251, 178, 7, 216, 167, 212, 165, 187, 115, 58, 232, 254, 76, 106, 55, 131, 73, 194, 36, 74, 188, 226, 104, 201, 128, 194, 175, 120, 198, 119, 237, 71, 205, 214, 56, 119, 36, 77, 28, 22, 215, 61, 13, 144, 145, 6, 120, 46, 19, 217, 155, 118, 237, 245, 78, 136, 233, 106, 108, 223, 209, 115, 95, 223, 10, 147, 171, 215, 4, 151, 214, 200, 9, 27, 49, 180, 23, 136, 54, 194, 168, 147, 33, 15, 204, 237, 68, 163, 149, 152, 125, 212, 9, 243, 81, 145, 20, 249, 125, 44, 28, 19, 155, 244, 194, 237, 76, 52, 200, 219, 227, 24, 54, 15, 88, 170, 36, 184, 109, 122, 187, 224, 77, 188, 126, 212, 143, 93, 30, 143, 133, 58, 99, 169, 222, 225, 26, 29, 223, 22, 27, 247, 92, 225, 253, 124, 185, 77, 118, 117, 0, 83, 169, 28, 217, 22, 200, 68, 109, 17, 198, 88, 203, 163, 33, 3, 184, 236, 43, 170, 51, 225, 147, 255, 78, 41, 154, 197, 8, 171, 81, 253, 134, 151, 107, 68, 23, 66, 7, 81, 150, 5, 110, 184, 138, 22, 137, 46, 209, 152, 39, 227, 125, 106, 161, 131, 240, 41, 82, 65, 223, 129, 172, 90, 26, 189, 158, 240, 66, 244, 253, 246, 167, 66, 170, 209, 20, 162, 210, 245, 110, 193, 172, 24, 188, 18, 23, 207, 10, 83, 84, 250, 96, 149, 144, 126, 237, 45, 194, 154, 163, 145, 235, 30, 41, 235, 211, 162, 201, 215, 4, 58, 102, 133, 60, 43, 166, 143, 81, 187, 7, 72, 140, 76, 120, 146, 248, 54, 106, 170, 25, 126, 241, 161, 106, 103, 108, 108, 123, 10, 88, 180, 208, 219, 53, 34, 106, 206, 96, 55, 108, 24, 238, 126, 194, 107, 88, 32, 77, 180, 29, 73, 193, 13, 123, 99, 229, 219, 197, 175, 244, 70, 8, 110, 113, 130, 126, 8, 109, 74, 216, 203, 61, 26, 146, 195, 228, 240, 25, 150, 173, 47, 123, 108, 94, 106, 114, 13, 212, 195, 246, 24, 42, 138, 245, 122, 63, 112, 93, 201, 174, 104, 30, 14, 112, 18, 214, 80, 139, 58, 224, 215, 185, 12, 69, 203, 206, 112, 58, 231, 171, 117, 159, 214, 73, 173, 44, 155],
        "DI": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI2LSGPAGQTAR6UPQ&Action=DescribeInstances&Expires=2018-01-01&InstanceId=i-eaee9127&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=dVywKE9V8YSticfknIpUh3OY0zuN%2BOpsozLN%2F44u%2FHk%3D",
        "DV": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI2LSGPAGQTAR6UPQ&Action=DescribeVolumes&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-82bfc08c&Signature=Jqu7ykkGqCmvuSvJgD7odC8%2F6onaijr%2BsVGg8nEOES4%3D",
        "GCO": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI2LSGPAGQTAR6UPQ&Action=GetConsoleOutput&Expires=2018-01-01&InstanceId=i-eaee9127&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=15CXO6WVRzww8VvZ5noXRqI5HpjIaDXUYdzR0j1AOaI%3D",
        "GU": "https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI2LSGPAGQTAR6UPQ&Action=GetUser&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=qtHAlM8MedH7NRlJazfqYdlVJFaXEbiU9CenC%2FWc1CQ%3D",
        "DIA": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI2LSGPAGQTAR6UPQ&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2018-01-01&InstanceId=i-eaee9127&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=Leqk1fx7X1AQkErydEljdwZoEV9LmxMm9EC8mwodCIs%3D",
        "instanceId": "i-eaee9127",
        "IP": "52.74.155.127"
    }
}


var oraclize1 = {
    "name": "oraclize1",
    "main": {
        "IP": "52.76.0.173",
        "port": "10011",
        "DI": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7RRONSGJOJOIAUA&Action=DescribeInstances&Expires=2018-01-01&InstanceId=i-4fc08aeb&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=z7ixltg5jgFM%2FXgg5fKLXM9TPe%2FzDgY9bwwtj3jnRlA%3D",
        "DV": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7RRONSGJOJOIAUA&Action=DescribeVolumes&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-752bbaaf&Signature=hqKUVVZaWa%2Bd4kVUdE6vNEyl9kc3pu7LSxajN0OfjmA%3D",
        "GCO": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7RRONSGJOJOIAUA&Action=GetConsoleOutput&Expires=2018-01-01&InstanceId=i-4fc08aeb&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=10pTlHgyLIo2TdCXL9be4IW2TaVYnydHVhrLsC6ZmdQ%3D",
        "GU": "https://iam.amazonaws.com/?AWSAccessKeyId=AKIAJ7RRONSGJOJOIAUA&Action=GetUser&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=nOmWGPy3FUcsOtXVdgItjffMvfibq9z48frs%2FeWV4Uo%3D",
        "DIA": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAJ7RRONSGJOJOIAUA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2018-01-01&InstanceId=i-4fc08aeb&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=4ZB1LeqZnMYq75o9p90d8El3uYGwdBI52RIbdubATxk%3D",
        "instanceId": "i-4fc08aeb"
    },
    "sig": {
        "modulus": [161, 26, 42, 2, 97, 74, 125, 246, 56, 128, 39, 41, 82, 63, 70, 150, 120, 191, 153, 192, 193, 131, 190, 71, 42, 221, 207, 38, 229, 152, 71, 68, 8, 34, 10, 85, 253, 13, 244, 152, 168, 128, 2, 241, 193, 52, 19, 225, 4, 44, 132, 174, 7, 70, 147, 205, 241, 215, 185, 89, 15, 252, 193, 135, 174, 155, 20, 117, 165, 160, 59, 195, 33, 237, 203, 185, 79, 209, 86, 225, 111, 33, 147, 110, 231, 65, 107, 180, 41, 37, 44, 26, 200, 204, 15, 129, 193, 241, 166, 216, 129, 22, 91, 228, 2, 134, 151, 144, 10, 127, 192, 28, 151, 214, 67, 179, 34, 202, 180, 83, 70, 7, 85, 95, 210, 165, 187, 222, 171, 207, 8, 195, 36, 73, 47, 160, 217, 222, 174, 141, 236, 188, 35, 211, 175, 103, 248, 194, 5, 15, 248, 140, 222, 111, 201, 104, 82, 14, 1, 45, 240, 149, 119, 24, 20, 31, 92, 5, 190, 208, 163, 73, 165, 74, 92, 7, 12, 132, 12, 225, 136, 50, 148, 42, 133, 0, 108, 68, 76, 109, 198, 110, 67, 30, 38, 19, 156, 175, 28, 59, 92, 146, 156, 128, 149, 245, 149, 213, 19, 183, 8, 163, 54, 154, 68, 13, 153, 40, 227, 207, 137, 39, 237, 192, 182, 103, 63, 53, 253, 161, 212, 168, 133, 238, 187, 2, 198, 206, 158, 95, 184, 243, 15, 93, 199, 200, 215, 153, 227, 216, 30, 60, 219, 254, 175, 151, 58, 125, 233, 227, 153, 127, 121, 58, 247, 78, 118, 109, 30, 214, 187, 72, 103, 100, 157, 194, 144, 12, 233, 208, 19, 30, 89, 174, 121, 210, 119, 90, 3, 65, 51, 32, 108, 159, 224, 52, 27, 96, 131, 77, 206, 107, 110, 23, 66, 73, 20, 77, 196, 156, 195, 106, 224, 174, 222, 153, 12, 14, 149, 86, 209, 9, 164, 20, 58, 126, 154, 95, 60, 53, 75, 242, 200, 56, 238, 21, 78, 93, 229, 181, 67, 118, 118, 224, 103, 101, 208, 202, 91, 97, 157, 92, 253, 51, 6, 252, 238, 38, 251, 188, 78, 178, 142, 57, 101, 235, 88, 21, 122, 249, 164, 255, 13, 143, 123, 103, 160, 34, 165, 124, 225, 78, 70, 176, 16, 75, 61, 76, 114, 45, 25, 149, 90, 103, 240, 33, 89, 135, 30, 136, 127, 1, 107, 56, 90, 212, 22, 232, 116, 36, 162, 230, 169, 149, 127, 116, 135, 89, 145, 122, 35, 114, 91, 174, 8, 22, 65, 140, 96, 73, 3, 187, 69, 245, 137, 37, 149, 223, 111, 53, 237, 220, 247, 71, 118, 227, 226, 113, 38, 162, 1, 125, 4, 162, 97, 185, 190, 232, 156, 37, 139, 144, 54, 237, 76, 218, 106, 252, 75, 82, 43, 31, 187, 18, 6, 207, 228, 79, 211, 180, 44, 163, 102, 31, 154, 119, 173, 5, 190, 132, 14, 110, 126, 25, 242, 20, 67, 167, 203, 238, 76, 240, 141, 99, 234, 1, 42, 39, 136, 18, 213, 87]
    }
}

var oraclize2 = {
    "name": "oraclize2",
    "main": {
        "IP": "52.77.219.69",
        "port": "10011",
        "DI": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2018-01-01&InstanceId=i-831b2d27&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=2vwOwQegvSJy0i5GWfnZzQ9GazBLRBZgG9n%2BK7w%2ByaU%3D",
        "DV": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-1790becd&Signature=q00XY67xa4GOmPTdL0DlwAJfTxgFQUd8NXeNAbQYkzo%3D",
        "GCO": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2018-01-01&InstanceId=i-831b2d27&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=VcP0gPBm4OF7qNBDxaq3NyiFlnboj8LMfl7QUxu9UfA%3D",
        "GU": "https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=72kIbKEhCgnXpenvG8oZLzxRdsnxXzOKGafOeTDddxM%3D",
        "DIA": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2018-01-01&InstanceId=i-831b2d27&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=uPxcTEw8afMZAXBfOIAl2%2Bf8N%2BCuUvigbc5PcVFlhQw%3D",
        "instanceId": "i-831b2d27"
    },
    "sig": {
        "modulus": [190, 123, 244, 64, 227, 228, 166, 169, 59, 241, 213, 33, 228, 5, 156, 231, 28, 102, 40, 106, 124, 105, 200, 52, 102, 27, 104, 102, 115, 180, 189, 78, 230, 222, 198, 246, 77, 27, 41, 181, 199, 149, 182, 206, 88, 238, 231, 77, 191, 144, 166, 106, 108, 90, 107, 6, 99, 224, 65, 77, 218, 93, 107, 135, 113, 157, 34, 60, 84, 49, 64, 99, 69, 4, 239, 142, 121, 46, 170, 122, 53, 103, 124, 193, 22, 193, 75, 72, 220, 36, 222, 217, 253, 47, 175, 233, 137, 252, 0, 247, 166, 30, 91, 237, 97, 118, 125, 55, 152, 149, 22, 78, 113, 234, 214, 94, 151, 236, 23, 39, 246, 72, 8, 204, 68, 59, 32, 143, 120, 11, 82, 140, 75, 131, 241, 241, 200, 96, 216, 172, 217, 27, 5, 0, 16, 46, 255, 199, 66, 150, 51, 18, 44, 110, 60, 38, 20, 99, 102, 47, 85, 124, 89, 117, 134, 189, 241, 28, 160, 220, 100, 233, 109, 106, 5, 102, 194, 196, 32, 194, 200, 94, 129, 253, 76, 234, 206, 219, 169, 228, 40, 31, 115, 195, 33, 135, 165, 162, 203, 63, 119, 35, 116, 14, 180, 41, 255, 77, 6, 60, 214, 177, 110, 32, 218, 154, 184, 163, 5, 27, 175, 184, 230, 23, 239, 142, 161, 96, 148, 14, 169, 127, 226, 228, 123, 147, 14, 47, 49, 84, 52, 145, 70, 130, 116, 88, 109, 95, 239, 129, 86, 2, 26, 35, 103, 36, 237, 223, 177, 152, 18, 96, 251, 161, 132, 195, 13, 38, 131, 42, 37, 64, 126, 156, 17, 52, 70, 233, 14, 202, 59, 189, 6, 13, 106, 231, 207, 74, 179, 10, 10, 23, 134, 249, 225, 113, 88, 66, 229, 41, 144, 71, 242, 188, 135, 55, 159, 40, 74, 133, 38, 158, 247, 238, 116, 242, 113, 133, 25, 31, 89, 22, 122, 68, 141, 200, 55, 78, 85, 79, 175, 32, 57, 116, 3, 221, 6, 169, 55, 115, 11, 206, 56, 197, 193, 25, 73, 59, 41, 126, 4, 67, 54, 255, 70, 228, 74, 85, 124, 252, 18, 103, 248, 173, 167, 218, 184, 235, 202, 255, 197, 240, 221, 217, 127, 186, 123, 234, 253, 38, 217, 245, 190, 67, 22, 225, 173, 238, 1, 111, 85, 172, 161, 180, 74, 117, 79, 86, 155, 192, 27, 135, 125, 51, 14, 236, 122, 156, 37, 38, 242, 34, 47, 138, 242, 210, 125, 104, 30, 37, 242, 202, 245, 255, 89, 159, 35, 212, 215, 117, 96, 247, 202, 236, 108, 21, 135, 32, 60, 200, 13, 116, 77, 18, 123, 222, 23, 100, 160, 242, 214, 219, 166, 131, 228, 117, 28, 169, 13, 168, 126, 136, 240, 253, 5, 41, 135, 85, 34, 49, 92, 188, 248, 127, 209, 96, 224, 84, 0, 133, 3, 38, 205, 155, 226, 43, 28, 99, 133, 253, 227, 161, 196, 88, 190, 32, 22, 241, 133, 61, 100, 91, 53, 84, 49, 39, 179, 58, 82, 230, 230, 95]
    }
}


var oraclize3 = {
    "name": "oraclize3",
    "main": {
        "IP": "54.169.160.199",
        "port": "10011",
        "DI": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2018-01-01&InstanceId=i-a878710c&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=fxWlTejJRr10HutmrUAu5xLHXMEEeL8XVPTNulFr2sU%3D",
        "DV": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-ec8f7d31&Signature=AdaZOfDzTGVFZTKyAl94AqKpk5Kap6lXRZuZ8SnMh58%3D",
        "GCO": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2018-01-01&InstanceId=i-a878710c&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=AlI35M%2Blksrg%2BQTTrQRJyI2NWY6M9O%2FtBne9gj8tdoA%3D",
        "GU": "https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=72kIbKEhCgnXpenvG8oZLzxRdsnxXzOKGafOeTDddxM%3D",
        "DIA": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2018-01-01&InstanceId=i-a878710c&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=v5wTi%2FfBcHfbEWUA2Cwy5eU3D%2FV7jMjFOqXgyVqyKbc%3D",
        "instanceId": "i-a878710c"
    },
    "sig": {
        "modulus": [227, 228, 106, 47, 212, 253, 247, 40, 41, 31, 222, 76, 85, 144, 199, 35, 185, 202, 237, 81, 36, 30, 53, 242, 194, 67, 138, 77, 149, 188, 104, 69, 200, 247, 32, 84, 101, 91, 74, 165, 216, 42, 173, 183, 179, 77, 58, 67, 89, 33, 188, 213, 250, 237, 5, 51, 114, 84, 43, 28, 104, 101, 44, 93, 252, 3, 165, 199, 81, 183, 164, 98, 217, 59, 11, 103, 246, 39, 126, 195, 225, 215, 155, 157, 235, 0, 32, 51, 245, 186, 219, 102, 119, 201, 72, 99, 39, 56, 78, 49, 12, 105, 245, 126, 209, 210, 107, 55, 117, 144, 19, 255, 115, 176, 90, 93, 76, 246, 119, 8, 193, 209, 163, 99, 4, 56, 97, 93, 10, 157, 21, 38, 236, 44, 27, 73, 24, 80, 58, 200, 218, 28, 227, 21, 212, 218, 89, 46, 254, 110, 46, 226, 75, 138, 198, 210, 71, 168, 18, 128, 52, 91, 139, 249, 225, 30, 67, 25, 206, 13, 66, 252, 43, 121, 165, 253, 84, 132, 68, 82, 238, 67, 91, 145, 53, 48, 116, 75, 227, 128, 47, 59, 53, 165, 123, 52, 64, 111, 79, 57, 91, 220, 169, 135, 181, 254, 167, 153, 104, 18, 77, 233, 82, 25, 3, 218, 227, 200, 201, 66, 110, 57, 146, 40, 47, 200, 58, 252, 10, 100, 14, 192, 171, 78, 91, 39, 56, 166, 64, 67, 64, 40, 150, 179, 151, 44, 172, 39, 20, 228, 168, 9, 155, 143, 244, 255, 54, 55, 184, 173, 152, 101, 107, 101, 62, 232, 23, 74, 57, 224, 169, 221, 18, 100, 20, 156, 234, 149, 202, 59, 53, 147, 147, 50, 20, 115, 126, 255, 220, 10, 77, 205, 179, 171, 222, 130, 141, 73, 141, 176, 116, 43, 251, 7, 194, 158, 137, 98, 156, 144, 97, 149, 22, 53, 223, 250, 110, 44, 139, 53, 209, 22, 186, 235, 120, 37, 156, 59, 119, 184, 69, 250, 65, 178, 157, 3, 248, 114, 56, 96, 54, 45, 77, 54, 205, 157, 135, 234, 53, 249, 146, 83, 101, 184, 18, 221, 137, 193, 97, 146, 129, 149, 53, 27, 161, 157, 70, 212, 122, 0, 253, 146, 54, 19, 196, 21, 57, 22, 172, 50, 144, 79, 137, 6, 236, 3, 111, 31, 206, 200, 56, 189, 26, 27, 248, 70, 209, 140, 7, 101, 30, 11, 237, 12, 132, 86, 213, 40, 63, 110, 180, 243, 183, 35, 15, 17, 119, 6, 29, 155, 174, 83, 117, 81, 159, 101, 82, 20, 18, 70, 13, 61, 92, 137, 29, 119, 103, 66, 30, 94, 27, 163, 191, 205, 180, 215, 151, 20, 215, 253, 218, 192, 112, 79, 25, 191, 246, 214, 61, 140, 217, 95, 235, 89, 153, 209, 70, 250, 219, 190, 50, 215, 75, 167, 97, 41, 247, 78, 41, 240, 143, 168, 102, 142, 15, 19, 63, 29, 162, 199, 99, 216, 215, 216, 26, 17, 237, 143, 77, 110, 133, 180, 50, 58, 44, 43, 39, 2, 218, 151, 226, 225]
    }
}

var oraclize4 = {
    "name": "oraclize4",
    "main": {
        "IP": "52.221.246.106",
        "port": "10011",
        "DI": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2018-01-01&InstanceId=i-e1ae5746&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=IHvmNvRC0KTtoZ4JN8e3YbtcjuOgDkBH1cHV%2BNQMewg%3D",
        "DV": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-72196daf&Signature=OVw4KfRyjOCVyhS6Icq6QRSQXIZ6OF3JCIc7W%2BB1yRE%3D",
        "GCO": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2018-01-01&InstanceId=i-e1ae5746&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=lYJxdvVWWT6grbF782emRbJNAK7QzNmXXlacGHS0CIc%3D",
        "GU": "https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2018-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=72kIbKEhCgnXpenvG8oZLzxRdsnxXzOKGafOeTDddxM%3D",
        "DIA": "https://ec2.ap-southeast-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2018-01-01&InstanceId=i-e1ae5746&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=%2BoDSwuhchgC%2FAMPONQkXCHbQ4c1ygs%2FMPk2XcqPt2Ns%3D",
        "instanceId": "i-e1ae5746"
    },
    "sig": {
        "modulus": [184, 227, 99, 146, 69, 62, 141, 20, 30, 88, 188, 11, 237, 71, 195, 149, 181, 32, 127, 85, 139, 227, 98, 235, 88, 15, 233, 61, 66, 37, 239, 94, 9, 9, 2, 57, 254, 6, 175, 9, 238, 0, 32, 182, 42, 7, 126, 169, 155, 188, 1, 126, 41, 108, 90, 109, 82, 93, 88, 119, 29, 214, 57, 19, 240, 93, 54, 67, 147, 25, 211, 110, 29, 184, 235, 87, 120, 213, 20, 175, 71, 4, 211, 48, 53, 186, 221, 57, 229, 37, 172, 170, 139, 142, 53, 244, 171, 179, 189, 172, 170, 123, 149, 181, 59, 116, 161, 178, 123, 172, 162, 120, 91, 137, 199, 170, 238, 195, 15, 237, 216, 78, 233, 123, 162, 220, 82, 79, 118, 170, 19, 146, 208, 153, 152, 42, 85, 193, 169, 92, 103, 55, 255, 79, 14, 209, 153, 253, 57, 193, 116, 127, 124, 216, 150, 239, 225, 56, 93, 102, 252, 12, 94, 182, 240, 233, 19, 242, 121, 59, 137, 223, 195, 238, 185, 239, 129, 178, 219, 252, 165, 187, 150, 54, 242, 112, 17, 96, 254, 47, 132, 224, 138, 167, 251, 163, 20, 191, 240, 81, 173, 118, 48, 4, 221, 20, 117, 54, 104, 53, 228, 48, 97, 107, 138, 198, 56, 127, 123, 191, 14, 122, 227, 244, 97, 182, 3, 185, 155, 96, 99, 250, 93, 13, 210, 22, 234, 183, 154, 228, 214, 252, 12, 46, 78, 203, 234, 62, 174, 149, 131, 192, 65, 2, 107, 225, 84, 51, 86, 148, 2, 22, 70, 102, 34, 33, 212, 60, 101, 246, 34, 162, 38, 39, 2, 14, 212, 111, 225, 254, 179, 1, 247, 230, 205, 213, 245, 113, 49, 159, 23, 193, 135, 63, 203, 141, 124, 45, 205, 121, 80, 122, 238, 30, 79, 18, 81, 39, 83, 212, 147, 1, 36, 75, 194, 206, 216, 98, 201, 241, 56, 95, 222, 135, 42, 205, 47, 136, 141, 202, 231, 243, 47, 188, 116, 211, 187, 35, 59, 16, 223, 217, 212, 243, 2, 41, 36, 196, 192, 204, 171, 131, 54, 238, 198, 179, 142, 0, 185, 215, 227, 232, 193, 240, 162, 81, 202, 243, 42, 243, 225, 65, 31, 39, 140, 122, 98, 22, 245, 227, 247, 219, 193, 68, 216, 45, 225, 124, 24, 170, 203, 244, 180, 179, 19, 239, 57, 107, 82, 239, 211, 247, 175, 190, 109, 222, 187, 34, 65, 133, 100, 197, 213, 13, 241, 58, 151, 157, 224, 166, 11, 138, 102, 106, 182, 30, 74, 172, 154, 148, 45, 95, 203, 56, 78, 27, 168, 37, 128, 151, 72, 235, 186, 51, 34, 209, 141, 231, 4, 168, 135, 29, 95, 45, 145, 34, 94, 127, 198, 49, 194, 119, 121, 160, 165, 104, 48, 183, 202, 157, 176, 86, 152, 108, 45, 181, 197, 152, 117, 97, 144, 232, 166, 103, 104, 135, 142, 163, 174, 100, 28, 45, 205, 79, 38, 154, 238, 130, 17, 189, 129, 97, 248, 210, 1, 198, 100, 67, 144, 184, 56, 17]
    }
}

var oraclize5 = {
	"name": "oraclize5",
	"main": {
		"IP": "52.90.90.9",
		"port": "10011",
    "DI":"https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2019-01-01&InstanceId=i-006259213b8edb2ce&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=H4zPn42aYytRSe3NOyJoqhPCTxxtohMZwg8q8xszvq8%3D",
    "DV":"https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-02247b60d940968cd&Signature=mcWgNdX0nu7kJ45kg6LdYRJCLp0FK0s7hlXyV1fnfSM%3D",
    "GCO":"https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2019-01-01&InstanceId=i-006259213b8edb2ce&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=pXCXcdfJXwiVsyaClr2j4IBF0pS%2BHDKMTl2hnELIvCY%3D",
    "GU":"https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=P7KohfMsstvrdvsDZVsaC1vWWnXgPUT9d2%2B0AdrOC0A%3D",
    "DIA":"https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2019-01-01&InstanceId=i-006259213b8edb2ce&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=bOqAqVojguvycC6CjMwNCqf7WT7My0obbeONS99nbJU%3D",
    "instanceId": "i-006259213b8edb2ce"
	},
	"sig": {
		"modulus": [186, 207, 38, 201, 153, 246, 95, 38, 213, 220, 154, 136, 124, 73, 92, 13, 234, 97, 118, 163, 232, 135, 219, 154, 47, 207, 195, 46, 79, 84, 168, 200, 75, 11, 201, 149, 58, 101, 232, 67, 46, 131, 163, 245, 10, 230, 184, 60, 90, 156, 201, 203, 175, 4, 176, 74, 108, 188, 15, 44, 214, 129, 96, 74, 80, 109, 57, 119, 221, 70, 46, 219, 89, 137, 147, 59, 221, 66, 178, 45, 154, 144, 189, 85, 35, 69, 219, 59, 167, 243, 214, 174, 28, 102, 114, 195, 210, 190, 30, 130, 141, 114, 0, 227, 163, 163, 247, 248, 101, 234, 123, 212, 23, 13, 88, 199, 234, 185, 243, 115, 121, 157, 104, 233, 105, 28, 248, 26, 76, 123, 178, 232, 95, 50, 7, 158, 246, 81, 241, 144, 46, 9, 73, 216, 83, 80, 48, 175, 119, 232, 7, 145, 80, 24, 223, 107, 73, 22, 155, 176, 217, 244, 148, 42, 75, 112, 113, 91, 45, 112, 123, 174, 88, 213, 106, 20, 177, 216, 130, 229, 24, 5, 22, 241, 159, 34, 124, 215, 243, 34, 120, 94, 183, 40, 97, 163, 28, 65, 156, 170, 156, 111, 226, 155, 134, 168, 111, 209, 67, 109, 64, 28, 208, 224, 199, 224, 167, 17, 74, 3, 56, 253, 79, 53, 132, 60, 68, 162, 184, 190, 249, 216, 180, 191, 1, 253, 40, 170, 45, 108, 225, 212, 29, 42, 53, 4, 95, 158, 233, 240, 95, 132, 223, 88, 121, 95, 14, 227, 149, 51, 214, 250, 190, 54, 79, 255, 188, 170, 57, 152, 108, 235, 221, 1, 145, 156, 107, 183, 60, 89, 28, 36, 50, 72, 221, 182, 213, 112, 144, 11, 236, 225, 185, 159, 43, 90, 130, 245, 59, 65, 254, 25, 123, 208, 118, 99, 233, 66, 159, 165, 155, 158, 6, 101, 77, 200, 63, 77, 181, 10, 202, 26, 39, 85, 245, 18, 89, 95, 46, 164, 32, 55, 50, 66, 215, 176, 56, 156, 91, 26, 125, 140, 182, 145, 143, 235, 74, 208, 148, 60, 239, 74, 27, 76, 15, 3, 115, 223, 42, 11, 182, 100, 152, 125, 159, 234, 173, 177, 106, 204, 242, 188, 99, 190, 150, 23, 69, 58, 85, 16, 179, 95, 225, 28, 127, 245, 27, 111, 181, 51, 227, 247, 108, 120, 115, 145, 120, 167, 220, 126, 168, 235, 26, 55, 247, 18, 221, 196, 47, 11, 168, 146, 212, 165, 210, 45, 14, 237, 195, 0, 160, 57, 3, 118, 156, 176, 199, 156, 188, 213, 238, 97, 218, 124, 218, 92, 215, 75, 13, 164, 161, 156, 139, 68, 23, 133, 21, 59, 66, 114, 237, 170, 237, 124, 68, 122, 123, 20, 106, 18, 13, 223, 166, 120, 53, 33, 229, 124, 153, 143, 109, 181, 207, 203, 96, 26, 136, 10, 159, 18, 159, 62, 130, 95, 79, 237, 249, 163, 99, 146, 183, 247, 12, 224, 97, 155, 24, 130, 227, 215, 38, 152, 127, 1, 237, 92, 15, 185, 165, 11, 8, 91]
  }
}

var oraclize6 = {
	"name": "oraclize6",
	"main": {
		"IP": "54.226.2.137",
		"port": "10011",
    "DI":"https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2019-01-01&InstanceId=i-0441b1549e6dd7a56&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=F6aqDDAYomEltO3JCP%2FdVOr0r%2FoqaR%2FfUhFholQa9vw%3D",
    "DV":"https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-0c91fe09ff8945ba5&Signature=T9VHwfNi2KAa34aQFAyaSamulTESrg1OUk70aWujG4I%3D",
    "GCO":"https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2019-01-01&InstanceId=i-0441b1549e6dd7a56&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=06WHUv5JE1w%2BpOmnel5uDYFAzeYi%2BpoDxaRYhnVgEtU%3D",
    "GU":"https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=P7KohfMsstvrdvsDZVsaC1vWWnXgPUT9d2%2B0AdrOC0A%3D",
    "DIA":"https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2019-01-01&InstanceId=i-0441b1549e6dd7a56&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=I95C8Efx9gE9AnRcpAQ1fmm7sl4rAwcCnQWitYvCxsA%3D",    "instanceId": "i-0441b1549e6dd7a56"
   },
	"sig": {
		"modulus": [224, 17, 214, 115, 152, 207, 24, 236, 145, 65, 236, 182, 219, 189, 122, 202, 216, 127, 25, 94, 166, 20, 144, 152, 99, 19, 144, 106, 55, 250, 82, 151, 23, 209, 164, 246, 45, 129, 204, 253, 239, 144, 114, 126, 48, 243, 30, 129, 186, 65, 118, 213, 21, 206, 146, 83, 1, 108, 185, 63, 235, 98, 207, 212, 166, 34, 164, 99, 21, 185, 204, 117, 17, 80, 88, 188, 23, 51, 159, 220, 106, 222, 10, 96, 195, 36, 175, 45, 221, 31, 179, 127, 139, 171, 243, 128, 107, 126, 108, 168, 116, 171, 94, 102, 116, 139, 160, 89, 71, 92, 72, 106, 241, 193, 140, 211, 114, 112, 5, 88, 138, 27, 232, 4, 229, 67, 167, 149, 112, 94, 246, 135, 55, 78, 249, 169, 52, 40, 85, 206, 71, 48, 165, 147, 59, 229, 177, 66, 144, 71, 26, 42, 201, 181, 36, 190, 143, 90, 242, 211, 30, 147, 17, 183, 204, 43, 158, 149, 232, 65, 240, 181, 65, 209, 198, 70, 81, 156, 153, 83, 187, 96, 73, 249, 238, 139, 43, 110, 90, 253, 232, 234, 158, 17, 89, 200, 159, 72, 114, 130, 233, 162, 56, 96, 182, 129, 116, 207, 186, 185, 8, 165, 204, 235, 239, 196, 123, 250, 168, 73, 156, 209, 225, 174, 167, 181, 106, 248, 181, 103, 32, 110, 46, 122, 44, 33, 30, 72, 179, 242, 33, 246, 4, 244, 132, 51, 174, 180, 10, 210, 252, 207, 31, 143, 206, 155, 139, 13, 131, 116, 75, 154, 29, 204, 217, 24, 161, 46, 77, 204, 10, 79, 183, 186, 114, 8, 85, 51, 110, 177, 37, 243, 65, 228, 78, 132, 111, 205, 156, 155, 150, 4, 201, 82, 22, 138, 59, 91, 89, 35, 108, 201, 91, 215, 43, 94, 115, 214, 170, 239, 73, 133, 221, 242, 157, 176, 85, 132, 36, 200, 141, 251, 130, 235, 12, 69, 39, 221, 230, 59, 207, 118, 180, 91, 13, 67, 38, 105, 160, 45, 25, 93, 214, 68, 6, 230, 72, 149, 120, 33, 143, 40, 16, 200, 83, 184, 22, 75, 190, 173, 206, 189, 203, 126, 204, 243, 56, 43, 76, 94, 12, 255, 1, 116, 250, 251, 36, 160, 255, 206, 228, 13, 84, 229, 98, 86, 201, 102, 32, 42, 35, 248, 127, 158, 88, 46, 245, 44, 113, 81, 251, 186, 20, 165, 137, 248, 73, 206, 41, 45, 195, 119, 164, 213, 71, 150, 88, 51, 188, 48, 91, 218, 76, 14, 227, 42, 250, 203, 254, 155, 246, 72, 81, 160, 29, 74, 58, 176, 146, 30, 78, 108, 218, 42, 238, 105, 123, 161, 117, 1, 169, 82, 149, 246, 132, 110, 168, 192, 34, 85, 64, 13, 141, 18, 141, 239, 212, 202, 108, 30, 4, 102, 17, 105, 44, 241, 41, 191, 244, 80, 251, 184, 92, 110, 144, 92, 66, 81, 211, 40, 249, 210, 32, 199, 199, 66, 226, 67, 4, 95, 12, 173, 103, 179, 201, 157, 46, 135, 166, 214, 28, 159]
  }
}

var oraclize7 = {
    "name": "oraclize7b",
    "main": {
        "IP": "52.207.238.28",
        "port": "10011",
        "DI": "https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstances&Expires=2019-01-01&InstanceId=i-06ab1aa0a097cc3cf&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=Eg3MXnJlrPu8JqcFwLfUCNq%2BfEG76or7JAjSLFlUIZM%3D",
        "DV": "https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeVolumes&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&VolumeId=vol-00db8493781c33e4d&Signature=rSuyO51LFJLFSOMzePh4Y40X5aXg8eVKH8kWE4RPi5I%3D",
        "GCO": "https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetConsoleOutput&Expires=2019-01-01&InstanceId=i-06ab1aa0a097cc3cf&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=nt%2FJpcDH3QTJF%2B%2BUJ5qukQeVyi%2F%2F79FbcOdGTaAhUF0%3D",
        "GU": "https://iam.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=GetUser&Expires=2019-01-01&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2010-05-08&Signature=P7KohfMsstvrdvsDZVsaC1vWWnXgPUT9d2%2B0AdrOC0A%3D",
        "DIA": "https://ec2.us-east-1.amazonaws.com/?AWSAccessKeyId=AKIAI7NVQ33GYQCJDJKA&Action=DescribeInstanceAttribute&Attribute=userData&Expires=2019-01-01&InstanceId=i-06ab1aa0a097cc3cf&SignatureMethod=HmacSHA256&SignatureVersion=2&Version=2014-10-01&Signature=lMJv89gkaWH%2FfqdYfYePGtjneUyxsMH17I%2BaDLT8rww%3D",
        "instanceId": "i-06ab1aa0a097cc3cf"
    },
    "modulus": [221, 152, 239, 128, 69, 115, 173, 154, 77, 113, 242, 54, 167, 45, 26, 123, 181, 145, 27, 78, 190, 10, 129, 131, 243, 240, 241, 184, 235, 207, 243, 184, 55, 213, 9, 214, 132, 240, 150, 48, 25, 222, 193, 69, 202, 204, 176, 179, 48, 174, 35, 72, 184, 211, 77, 195, 10, 40, 17, 7, 90, 160, 172, 246, 36, 64, 35, 201, 133, 103, 127, 47, 1, 205, 90, 195, 66, 78, 228, 55, 249, 252, 214, 232, 80, 47, 110, 212, 9, 23, 254, 77, 185, 223, 214, 242, 234, 69, 133, 23, 238, 252, 101, 47, 66, 164, 2, 212, 147, 22, 84, 34, 188, 168, 244, 99, 182, 3, 110, 206, 193, 85, 27, 247, 62, 49, 26, 77, 48, 240, 169, 153, 249, 127, 152, 155, 123, 245, 53, 35, 137, 42, 90, 178, 164, 170, 183, 37, 76, 129, 103, 108, 109, 179, 252, 15, 172, 249, 148, 234, 142, 145, 115, 230, 119, 146, 12, 220, 98, 116, 53, 103, 113, 114, 58, 229, 3, 205, 254, 180, 4, 141, 195, 213, 5, 178, 51, 215, 11, 65, 69, 176, 91, 104, 119, 191, 196, 11, 202, 184, 217, 243, 33, 151, 40, 64, 158, 42, 193, 57, 126, 21, 133, 189, 118, 52, 249, 247, 238, 100, 145, 165, 21, 87, 124, 75, 236, 80, 211, 37, 48, 249, 43, 119, 129, 248, 161, 11, 186, 60, 94, 136, 43, 198, 163, 194, 57, 122, 212, 39, 18, 82, 243, 14, 27, 165, 140, 97, 209, 124, 31, 253, 136, 125, 243, 184, 216, 78, 231, 119, 247, 210, 222, 208, 172, 59, 28, 245, 171, 27, 4, 177, 49, 213, 190, 244, 111, 252, 80, 104, 95, 5, 97, 124, 203, 84, 192, 162, 13, 76, 224, 44, 33, 98, 234, 136, 237, 72, 138, 33, 230, 18, 20, 162, 106, 17, 70, 159, 213, 223, 224, 104, 255, 224, 80, 96, 83, 174, 205, 208, 21, 105, 111, 205, 1, 232, 155, 210, 243, 63, 12, 20, 181, 140, 233, 220, 67, 117, 133, 45, 74, 147, 22, 31, 235, 209, 217, 157, 91, 110, 1, 202, 64, 35, 98, 202, 228, 78, 162, 34, 77, 167, 246, 4, 195, 79, 129, 24, 153, 135, 244, 149, 217, 86, 244, 18, 190, 217, 26, 6, 13, 129, 245, 229, 242, 89, 79, 124, 151, 86, 31, 37, 249, 105, 166, 48, 54, 207, 22, 68, 84, 39, 4, 192, 111, 78, 70, 132, 161, 199, 106, 224, 99, 252, 207, 155, 30, 26, 55, 5, 154, 147, 97, 209, 5, 79, 42, 49, 7, 196, 230, 9, 43, 58, 103, 71, 109, 15, 8, 49, 47, 229, 189, 22, 166, 240, 92, 227, 63, 44, 51, 135, 9, 110, 164, 220, 113, 21, 92, 98, 84, 53, 191, 113, 63, 244, 167, 230, 104, 212, 218, 5, 113, 63, 71, 136, 86, 210, 107, 48, 183, 63, 138, 131, 232, 31, 156, 229, 157, 97, 42, 200, 135, 89, 73, 183, 38, 226, 228, 35, 98, 95]
}

//there can be potentially multiple oracles to choose from
var oracles = new Array(1);
//1st index denotes the tlsn proof version
oracles.push([oraclize4]); //v1
oracles.push([oraclize5, oraclize6, oraclize7]); //v2
//console.log(oracles[1]);
//all servers trusted to perform notary (including non-oracles)
//TODO: configurable
var pagesigner_servers = [oraclize4]; //oracle, waxwing];

//assuming both events happened on the same day, get the time
//difference between them in seconds
//the time string looks like "2015-04-15T19:00:59.000Z"
function getSecondsDelta(later, sooner) {
    assert(later.length == 24);
    if (later.slice(0, 11) !== sooner.slice(0, 11)) {
        return 999999; //not on the same day
    }
    var laterTime = later.slice(11, 19).split(':');
    var soonerTime = sooner.slice(11, 19).split(':');
    var laterSecs = parseInt(laterTime[0]) * 3600 + parseInt(laterTime[1]) * 60 + parseInt(laterTime[2]);
    var soonerSecs = parseInt(soonerTime[0]) * 3600 + parseInt(soonerTime[1]) * 60 + parseInt(soonerTime[2]);
    return laterSecs - soonerSecs;
}



function modulus_from_pubkey(pem_pubkey) {
    var b64_str = '';
    var lines = pem_pubkey.split('\n');
    //omit header and footer lines
    for (var i = 1; i < (lines.length - 1); i++) {
        b64_str += lines[i];
    }
    var der = b64decode(b64_str);
    //last 5 bytes are 2 DER bytes and 3 bytes exponent, our pubkey is the preceding 512 bytes
    var pubkey = der.slice(der.length - 517, der.length - 5);
    return pubkey;
}


function checkDescribeInstances(xmlDoc, instanceId, IP, type) {
    try {
        var imageID;
        var snapshotID;
        if (type === 'main') {
            imageID = imageID_main;
            snapshotID = snapshotID_main;
        } else if (type === 'sig') {
            imageID = imageID_sig;
            snapshotID = snapshotID_sig;
        } else { throw ('unknown oracle type'); }

        var rs = xmlDoc.getElementsByTagName('reservationSet');
        assert(rs.length === 1);
        var rs_items = rs[0].children;
        assert(rs_items.length === 1);
        var ownerId = rs_items[0].getElementsByTagName('ownerId')[0].textContent;
        var isets = rs_items[0].getElementsByTagName('instancesSet');
        assert(isets.length === 1);
        var instances = isets[0].children;
        assert(instances.length === 1);
        var parent = instances[0];
        assert(parent.getElementsByTagName('instanceId')[0].textContent === instanceId);
        assert(parent.getElementsByTagName('imageId')[0].textContent === imageID);
        assert(parent.getElementsByTagName('instanceState')[0].getElementsByTagName('name')[0].textContent === 'running');
        var launchTime = parent.getElementsByTagName('launchTime')[0].textContent;
        assert(parent.getElementsByTagName('kernelId')[0].textContent === kernelId);
        assert(parent.getElementsByTagName('ipAddress')[0].textContent === IP);
        assert(parent.getElementsByTagName('rootDeviceType')[0].textContent === 'ebs');
        assert(parent.getElementsByTagName('rootDeviceName')[0].textContent === '/dev/xvda');
        var devices = parent.getElementsByTagName('blockDeviceMapping')[0].getElementsByTagName('item');
        assert(devices.length === 1);
        assert(devices[0].getElementsByTagName('deviceName')[0].textContent === '/dev/xvda');
        assert(devices[0].getElementsByTagName('ebs')[0].getElementsByTagName('status')[0].textContent === 'attached');
        var volAttachTime = devices[0].getElementsByTagName('ebs')[0].getElementsByTagName('attachTime')[0].textContent;
        var volumeId = devices[0].getElementsByTagName('ebs')[0].getElementsByTagName('volumeId')[0].textContent;
        //get seconds from "2015-04-15T19:00:59.000Z"
        assert(getSecondsDelta(volAttachTime, launchTime) <= 3);
    } catch (e) {
        return false;
    }
    return { 'ownerId': ownerId, 'volumeId': volumeId, 'volAttachTime': volAttachTime, 'launchTime': launchTime };
}


function checkDescribeVolumes(xmlDoc, instanceId, volumeId, volAttachTime, type) {
    try {
        var imageID;
        var snapshotID;
        if (type === 'main') {
            imageID = imageID_main;
            snapshotID = snapshotID_main;
        } else if (type === 'sig') {
            imageID = imageID_sig;
            snapshotID = snapshotID_sig;
        } else { throw ('unknown oracle type'); }

        var volumes = xmlDoc.getElementsByTagName('volumeSet')[0].children;
        assert(volumes.length === 1);
        var volume = volumes[0];
        assert(volume.getElementsByTagName('volumeId')[0].textContent === volumeId);
        assert(volume.getElementsByTagName('snapshotId')[0].textContent === snapshotID);
        assert(volume.getElementsByTagName('status')[0].textContent === 'in-use');
        var volCreateTime = volume.getElementsByTagName('createTime')[0].textContent;
        var attVolumes = volume.getElementsByTagName('attachmentSet')[0].getElementsByTagName('item');
        assert(attVolumes.length === 1);
        var attVolume = attVolumes[0];
        assert(attVolume.getElementsByTagName('volumeId')[0].textContent === volumeId);
        assert(attVolume.getElementsByTagName('instanceId')[0].textContent === instanceId);
        assert(attVolume.getElementsByTagName('device')[0].textContent === '/dev/xvda');
        assert(attVolume.getElementsByTagName('status')[0].textContent === 'attached');
        var attTime = attVolume.getElementsByTagName('attachTime')[0].textContent;
        assert(volAttachTime === attTime);
        //Crucial: volume was created from snapshot and attached at the same instant
        //this guarantees that there was no time window to modify it
        assert(getSecondsDelta(attTime, volCreateTime) === 0);
    } catch (e) {
        return false;
    }
    return true;
}


function checkGetConsoleOutput(xmlDoc, instanceId, launchTime, type, main_pubkey) {
    try {
        assert(xmlDoc.getElementsByTagName('instanceId')[0].textContent === instanceId);
        var timestamp = xmlDoc.getElementsByTagName('timestamp')[0].textContent;
        //prevent funny business: last consoleLog entry no later than 4 minutes after instance starts
        assert(getSecondsDelta(timestamp, launchTime) <= 240);
        var b64data = xmlDoc.getElementsByTagName('output')[0].textContent;
        var logstr = ba2str(b64decode(b64data));
        //no other string starting with xvd except for xvda
        assert(logstr.search(/xvd[^a]/g) === -1);
        var mainmark = 'TLSNotary main server pubkey which is embedded into the signing server:';
        var sigmark = 'TLSNotary siging server pubkey:';
        var sigimportedmark = 'TLSNotary imported main server pubkey:'
        var pkstartmark = '-----BEGIN PUBLIC KEY-----';
        var pkendmark = '-----END PUBLIC KEY-----';

        if (type === 'main') {
            var mark_start = logstr.search(mainmark);
            assert(mark_start !== -1);
            var pubkey_start = mark_start + logstr.slice(mark_start).search(pkstartmark);
            var pubkey_end = pubkey_start + logstr.slice(pubkey_start).search(pkendmark) + pkendmark.length;
            var pubkey = logstr.slice(pubkey_start, pubkey_end);
            assert(pubkey.length > 0);
            return pubkey;
        } else if (type === 'sig') {
            var mark_start = logstr.search(sigmark);
            assert(mark_start !== -1);
            var pubkey_start = mark_start + logstr.slice(mark_start).search(pkstartmark);
            var pubkey_end = pubkey_start + logstr.slice(pubkey_start).search(pkendmark) + pkendmark.length;
            var mypubkey = logstr.slice(pubkey_start, pubkey_end);
            assert(mypubkey.length > 0);

            mark_start = logstr.search(sigimportedmark);
            assert(mark_start !== -1);
            pubkey_start = mark_start + logstr.slice(mark_start).search(pkstartmark);
            pubkey_end = pubkey_start + logstr.slice(pubkey_start).search(pkendmark) + pkendmark.length;
            var hispubkey = logstr.slice(pubkey_start, pubkey_end);
            assert(main_pubkey === hispubkey);

            return mypubkey;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

// "userData" allows to pass an arbitrary script to the instance at launch. It MUST be empty.
// This is a sanity check because the instance is stripped of the code which parses userData.
function checkDescribeInstanceAttribute(xmlDoc, instanceId) {
    try {
        assert(xmlDoc.getElementsByTagName('instanceId')[0].textContent === instanceId);
        assert(xmlDoc.getElementsByTagName('userData')[0].textContent === "");
    } catch (e) {
        return false;
    }
    return true;
}


function checkGetUser(xmlDoc, ownerId) {
    try {
        assert(xmlDoc.getElementsByTagName('UserId')[0].textContent === ownerId);
        assert(xmlDoc.getElementsByTagName('Arn')[0].textContent.slice(-(ownerId.length + ':root'.length)) === ownerId + ':root');
    } catch (e) {
        return false;
    }
    return true;
}


function check_oracle(o, type, main_pubkey) {
    return new Promise(function (resolve, reject) {
            var xhr = get_xhr();
            xhr.open('GET', o.DI, true);
            xhr.onload = function () {
                var xmlDoc = xhr.responseXML;
                var result = checkDescribeInstances(xmlDoc, o.instanceId, o.IP, type);
                if (!result) {
                    reject('checkDescribeInstances');
                } else {
                    resolve(result);
                }
            };
            xhr.send();
        })
        .then(function (args) {
            return new Promise(function (resolve, reject) {
                var xhr = get_xhr();
                xhr.open('GET', o.DV, true);
                xhr.onload = function () {
                    var xmlDoc = xhr.responseXML;
                    var result = checkDescribeVolumes(xmlDoc, o.instanceId, args.volumeId, args.volAttachTime, type);
                    if (!result) {
                        reject('checkDescribeVolumes');
                    } else {
                        resolve({ 'ownerId': args.ownerId, 'launchTime': args.launchTime });
                    }
                };
                xhr.send();
            });
        })
        .then(function (args) {
            return new Promise(function (resolve, reject) {
                var xhr = get_xhr();
                xhr.open('GET', o.GU, true);
                xhr.onload = function () {
                    var xmlDoc = xhr.responseXML;
                    var result = checkGetUser(xmlDoc, args.ownerId);
                    if (!result) {
                        reject('checkGetUser');
                    } else {
                        resolve(args.launchTime);
                    }
                };
                xhr.send();
            });
        })
        .then(function (launchTime) {
            return new Promise(function (resolve, reject) {
                var xhr = get_xhr();
                xhr.open('GET', o.GCO, true);
                xhr.onload = function () {
                    var xmlDoc = xhr.responseXML;
                    var result = checkGetConsoleOutput(xmlDoc, o.instanceId, launchTime, type, main_pubkey.pubkey);
                    if (!result) {
                        reject('checkGetConsoleOutput');
                    } else {
                        var yes = true;
                        if (type === 'main') {
                            main_pubkey.pubkey = result;
                        } else if (type === 'sig') {
                            if (modulus_from_pubkey(result).toString() !== o.modulus.toString()) {
                                reject('modulus_from_pubkey');
                            }
                        }
                        resolve();
                    }
                };
                xhr.send();
            });
        })
        .then(function () {
            return new Promise(function (resolve, reject) {
                var xhr = get_xhr();
                xhr.open('GET', o.DIA, true);
                xhr.onload = function () {
                    var xmlDoc = xhr.responseXML;
                    var result = checkDescribeInstanceAttribute(xmlDoc, o.instanceId);
                    if (!result) {
                        reject('checkDescribeInstanceAttribute');
                    } else {
                        resolve();
                    }
                };
                xhr.send();
            });
        })
        .then(function () {
            var mark = 'AWSAccessKeyId=';
            var start;
            var id;
            var ids = [];
            //"AWSAccessKeyId" should be the same to prove that the queries are made on behalf of AWS user "root".
            //The attacker can be a user with limited privileges for whom the API would report only partial information.
            for (var url in [o.DI, o.DV, o.GU, o.GCO, o.DIA]) {
                start = url.search(mark) + mark.length;
                id = url.slice(start, start + url.slice(start).search('&'));
                ids.push(id);
            }
            assert(new Set(ids).size === 1);
            console.log('oracle verification successfully finished');
        });
}

//could use original file and make exporter
module.exports = oracles;
