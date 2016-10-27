const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({
    region: 'eu-central-1'
});


/*
    Initilizing Instance parameters
*/
var imageId = process.argv[3];
var instanceType = process.argv[4];
var instanceName = process.argv[5];

/*
    If the user arg is "list", show the lists of all the instances
*/
if (process.argv[2] == "list") {
    ec2.describeInstances(function(error, data) {
        if (error) {
            console.log(error); // an error occurred
        } else {
            console.log(data); // request succeeded
        }
    });
    console.log("liste");
}


/*
    If the user arg is "create", create a new instances with the arguments [AMI] [Instance Type] [Name].
    eg : node index create ami-875042eb t2.micro Name

*/
else if (process.argv[2] === "create") {

    var params = {
        ImageId: imageId, // RHEL 7 ami-875042eb
        InstanceType: instanceType,
        MinCount: 1,
        MaxCount: 1
    };
    ec2.runInstances(params, function(err, data) {
        if (err) {
            console.log("Could not create instance", err);
            return;
        }

        var instanceId = data.Instances[0].InstanceId;
        console.log("Created instance", instanceId);

        // Add tags to the instance
        params = {
            Resources: [instanceId],
            Tags: [{
                Key: 'Name',
                Value: instanceName,
            }]
        };
        ec2.createTags(params, function(err) {
            console.log("Tagging instance", err ? "failure" : "success");
            console.log("Image id : " + imageId);
            console.log("Type : " + instanceType);
            console.log("Nom : " + instanceName);
        });
    });
}


/*
    If the input is neither list nor create, show this error
*/
else {
    console.log("Error : The input must be either 'list' or 'create'.");
}
