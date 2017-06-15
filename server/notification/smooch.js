var express = require('express');
var router = express.Router();
var exports = module.exports;

const Smooch = require('smooch-core');
const KEY_ID = 'app_593f1cc81d2c082d00e98d45';
const SECRET = 'MwxBQOtHYoc06nyifOba2FCS';

const smooch = new Smooch({
    keyId: KEY_ID,
    secret: SECRET,
    scope: 'app'
});

exports.sendMessage = function(message, appUserId){
	if(!appUserId){
		return;
	}

	smooch.appUsers.get(appUserId).then((response) => {
		console.log(response);
	});

	smooch.appUsers.sendMessage(appUserId, {
		type: 'text',
		text: message,
		role: 'appMaker'
	}).then((response) => {
		console.log('API RESPONSE:\n', response);
	}).catch((err) => {
		console.log('API ERROR:\n', err);
	});
}

exports.createSmoochUser = function(name, surname, email, phoneNumber){
	smooch.appUsers.create(email, {
		givenName: name,
		surname: surname,
		email: email
	}).then((response) => {
		smooch.appUsers.linkChannel(email, {
			type: 'twilio',
			phoneNumber: "+1"+phoneNumber		
		});
		smooch.appUsers.linkChannel(email, {
			type: 'messenger',
			givenName: name,
			surname: surname,
			phoneNumber: "+1"+phoneNumber
		});	
	});
}

exports.updateSmoochUser = function(name, surname, email, phoneNumber){
	smooch.appUsers.update(email, {
		givenName: name,
		surname: surname,
		email: email,
		phoneNumber: phoneNumber
	});
}