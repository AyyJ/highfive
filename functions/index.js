var functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.isValidPhone = functions.https.onRequest((req, res) => {
	//Grab phone number from request 
	var phoneNumber = req.query.phoneNumber;
	var validPhone = new RegExp('[(]0-9{3}[)]0-9{3}-0-9{4}');

	//Strip white space
	phoneNumber.replace(" ", "");

	//Set up response header
	res.header('Access-Control-Allow-Origin', '*');

	//Check against regex
	if(phoneNumber === validPhone){
		res.send(phoneNumber + " is a valid phone number!");
	}
	else{
		res.send(phoneNumber + " is not a valid phone number!");
	}
});

// exports.formatPhone = functions.https.onRequest((req, res) => {

// });