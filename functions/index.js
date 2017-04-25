const functions = require('firebase-functions');

/**
 * Determines if input is a valid phone number by calling validatePhone
 * @function
 * @return {String} - A string in one of the following forms:
 *     - if valid:
 *         - "123-456-7890 is a valid phone number!"
 *     - if invalid:
 *         - "123-456-7891 is not a valid phone number!
 */
exports.isValidPhone = functions.https.onRequest((req, res) => {
	//Grab phone number from request
	const phoneNumber = req.query.phoneNumber;

	//Set up response header
	res.header('Access-Control-Allow-Origin', "*");

	//Check against regex
	if(validatePhone(phoneNumber)){
		res.send(phoneNumber + " is a valid phone number!");
	}
	else{
		res.send(phoneNumber + " is not a valid phone number!");
	}
});

/**
 * Formats user input to proper format after validation by validatePhone
 * @function
 * @returns {String} A string in one of the following forms:
 *    - if input is a valid phone number:
 *      - a string with the phone number properly formated is returned.
 *        - Example: "123-456-7890" -> "(123) 456-7890"
 *    - if input is an invalid phone number:
 *      - a string explaning that the phone number is not valid is returned.
 *        - Example: "123-456-7891" -> "123-456-7891 is not a valid phone number!"
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
    	var goodRes = format(phoneNumber);
    	goodRes += ", nice work!<br><iframe src=\"https://giphy.com/embed/3oEjHV0z8S7WM4MwnK\" width=\"480\" height=\"240.4452690166976\" frameBorder=\"0\" class=\"giphy-embed\" allowFullScreen></iframe>"
        res.send(goodRes);
    }
});

// Unit Test Entry
exports.test_validatePhone = function(phoneNumber) {
	return validatePhone(phoneNumber);
};

/**
 * Validates if phoneNumber is a valid US phone number
 * @param {string} phoneNumber User generated string that may be a phone number.
 * @return {boolean} This returns true if phone number is valid, false otherwise.
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

// Unit Test Entry
exports.test_format = function(phoneNumber) {
	return format(phoneNumber);
};

/*
	Logic to format a validated 10-digit phone number
*/
function format(phoneNumber){
	const strippedNumber = phoneStrip(phoneNumber);
  return strippedNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

/**
 * Removes all non-number characters from number
 * @param {string} number A string representing a formated number.
 * @return {string} This returns a string containing only the numbers contained in number
 */
function phoneStrip(number){
    return number.replace(/[^\d]/g, "");
}
