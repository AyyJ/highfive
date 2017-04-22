const functions = require('firebase-functions');

exports.isValidPhone = functions.https.onRequest((req, res) => {
	//Grab phone number from request 
	const phoneNumber = req.query.phoneNumber;
	
	// //Set up regexes
	// const validPhone = new RegExp('[(][0-9]{3}[)][0-9]{3}[-][0-9]{4}');
	// const validPhoneDigitsOnly = new RegExp('[0-9]{10}');
	
	// //Strip white space
	// phoneNumberTemp = phoneNumber.replace(/ /gi, "");

	// //Set up response header
	// res.header('Access-Control-Allow-Origin', "*");

	//Check against regex
	if(validifyPhone(phoneNumber)){
		res.send(phoneNumber + " is a valid phone number!");
	}
	else{
		res.send(phoneNumber + " is not a valid phone number!");
	}
});

exports.formatPhone = functions.https.onRequest((req, res) => {
	//Set up response header
	res.header('Access-Control-Allow-Origin', "*");

	//Grab phone number from request
	const phoneNumber = req.query.phoneNumber;

	//If not valid, stop and notify of failure
	if(!validifyPhone(phoneNumber)){
		res.send(phoneNumber + " is not a valid phone number!");
		return;
	}

	//It's all good, begin formatting!
});

const validifyPhone = function(phoneNumber){
	//Set up regexes
	const validPhone = new RegExp('[(][0-9]{3}[)][0-9]{3}[-][0-9]{4}');
	const validPhoneDigitsOnly = new RegExp('[0-9]{10}');

	//Strip white space
	phoneNumberTemp = phoneNumber.replace(/ /gi, "");

	//Check against regex
	if(validPhone.test(phoneNumberTemp) || validPhoneDigitsOnly.test(phoneNumberTemp)){
		return true;
	}
	else{
		return false;
	}
}