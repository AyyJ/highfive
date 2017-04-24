const functions = require('firebase-functions');

exports.isValidPhone = functions.https.onRequest((req, res) => {
	//Grab phone number from request 
	const phoneNumber = req.query.phoneNumber;

	//Set up response header
	res.header('Access-Control-Allow-Origin', "*");

	//Check against regex
	if(validifyPhone(phoneNumber)){
		res.send(phoneNumber + " is a valid phone number!");
	}
	else{
		res.send(phoneNumber + " is not a valid phone number!");
	}
});

exports.formatPhone = functions.https.onRequest((req, res) => {
	//Grab phone number from request
	const phoneNumber = req.query.phoneNumber;

	//Set up response header
	res.header('Access-Control-Allow-Origin', "*");

	//If not valid, stop and notify of failure
    if(!validifyPhone(phoneNumber)){
        res.send(phoneNumber + " is not a valid phone number!");
    }
    else{
        const phoneNumber = phoneStrip(phoneNumber);
        res.send(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"));
    }
});

function validifyPhone(phoneNumber){
	//Set up regexes
	const validPhone = new RegExp('[(][0-9]{3}[)][0-9]{3}[-]?[0-9]{4}');
	const validPhoneDigitsOnly = new RegExp('[0-9]{3}[-]?[0-9]{3}[-]?[0-9]{4}');

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
 strips the number passed to it and returns the stream of digits.

 */
function phoneStrip(number){

    return number.replace(/[^\d]/g, "");
}

