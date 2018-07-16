let AWS = require('aws-sdk');
const sns = new AWS.SNS();
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {

	id = Number(event['id']);
	name = event['name'];
	phone = event['phone'];
	email = event['email'];


	ddb.put({
		TableName: 'children',
		Item: { 'id': id, 'name': name, 'phone': phone, 'email': email }
	}, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			sns.publish({
				Message: 'You have registered your child successfully\nThank you',
				MessageAttributes: {
					'AWS.SNS.SMS.SMSType': {
						DataType: 'String',
						StringValue: 'Promotional'
					},
					'AWS.SNS.SMS.SenderID': {
						DataType: 'String',
						StringValue: 'Registered'
					},
				},
				PhoneNumber: phone
			}).promise()
				.then(data => {
					console.log("Sent message to", receiver);
					callback(null, data);
				})
				.catch(err => {
					console.log("Sending failed", err);
					callback(err);
				});
		}
	});

	callback(null, 'Successfully executed');
}