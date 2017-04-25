const functions = require('firebase-functions');

/*
	Responds with result of phone validation
*/
exports.isValidPhone = functions.https.onRequest((req, res) => {
	//Grab phone number from request 
	const phoneNumber = req.query.phoneNumber;

	//Set up response header
	res.header('Access-Control-Allow-Origin', "*");

	//Check against regex
	if(exports.validatePhone(phoneNumber)){
		res.send(phoneNumber + " is a valid phone number!");
	}
	else{
		res.send(phoneNumber + " is not a valid phone number!");
	}
});

/*
	Responds with result of phone formatting
*/
exports.formatPhone = functions.https.onRequest((req, res) => {
	//Grab phone number from request
	const phoneNumber = req.query.phoneNumber;

	//Set up response header
	res.header('Access-Control-Allow-Origin', "*");

	//If not valid, stop and notify of failure
    if(!validatePhone(phoneNumber)){
        res.send("Unable to format. " + phoneNumber + " is not a valid phone number!");
    }
    else{
        res.send(format(phoneNumber));
    }
});

/*
	Logic to determine if phone number is valid
*/
function validatePhone(phoneNumber){
	//Set up regexes
	const validPhone = new RegExp('^[(][0-9]{3}[)][0-9]{3}[-]?[0-9]{4}$');
	const validPhoneDigitsOnly = new RegExp('^[0-9]{3}[-]?[0-9]{3}[-]?[0-9]{4}$');

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

/*
	Logic to format a validated 10-digit phone number
*/
function format(phoneNumber){
	const strippedNumber = phoneStrip(phoneNumber);
  return strippedNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

/*
	Strips everything in input except for digits.

 */
function phoneStrip(number){
    return number.replace(/[^\d]/g, "");
}

