var express = require('express');
var router = express.Router();

/**
 * Determines if input is a valid phone number by calling validatePhone
 * @function
 * @return {String} - A string in one of the following forms:
 *     - if valid:
 *         - "123-456-7890 is a valid phone number!"
 *     - if invalid:
 *         - "123-456-7891 is not a valid phone number!
 */
router.get('/', function(req, res, next){
	//Grab phone number from request
	const phoneNumber = req.query.phoneNumber;

	//Set up response header
	res.header('Access-Control-Allow-Origin', "*");

	//Check against regex
	if(validatePhone(phoneNumber)){
		return res.json({
			'err' : false,
			'message' : phoneNumber + ' is a valid phone number!'
		})
	} else {
		return res.json({
			'err' : true,
			'message' : phoneNumber + ' is not a valid phone number!'
		})
	}
});

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

module.exports = router;
