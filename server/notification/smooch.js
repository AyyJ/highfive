var express = require('express');
var router = express.Router();
var exports = module.exports;

const Smooch = require('smooch-core');
const KEY_ID = 'app_593f1cc81d2c082d00e98d45';
const SECRET = 'MwxBQOtHYoc06nyifOba2FCS';

var Appointment = require('../models/Appointment');
var Company = require('../models/Company');
var Employee = require('../models/Employee');
var schedule = require('node-schedule');

const smooch = new Smooch({
    keyId: KEY_ID,
    secret: SECRET,
    scope: 'app'
});

exports.sendMessage = function(message, appUserId){
	localSendMessage(message, appUserId);
}

exports.createSmoochUser = function(name, surname, email, phoneNumber){
	var allClear = "Hello "+name+" "+surname+"! Echelon will contact you with important info through here, welcome!";
	var uniqueId = email;
	if(email == ""){
		uniqueId = phoneNumber;
	}

	smooch.appUsers.create(uniqueId, {
		givenName: name,
		surname: surname,
		email: email
	}).then((response) => {
		//Link twilio for SMS
		smooch.appUsers.linkChannel(uniqueId, {
			type: 'twilio',
			phoneNumber: "+1"+phoneNumber,
			confirmation: {
				type: 'immediate'
		}		
		}).then((response) => {
			console.log('Linked to twilio');
			localSendMessage(allClear, uniqueId);
		}).catch((err) => {
			console.log('CANNOT LINK TWILIO:',err);
		});

		//Link fb messenger
		smooch.appUsers.linkChannel(uniqueId, {
			type: 'messenger',
			givenName: name,
			surname: surname,
			phoneNumber: "+1"+phoneNumber,
			confirmation: {
				type: 'immediate'
			}
		}).then((response) => {
			console.log("linked to messenger");
		}).catch((err) => {
			console.log('CANNOT LINK MESSENGER:',err);
		});	

		//Link mailgun
		smooch.appUsers.linkChannel(uniqueId, {
			type: 'mailgun',
			address: email,
			confirmation: {
				type: 'immediate'
			},
			subject: 'Welcome to smooch!'
		}).then((response) => {
			console.log("linked to mailgun");
		}).catch((err) => {
			console.log('CANNOT LINK MAILGUN:', err);
		});
	}).catch((err) => {
		console.log('ACCOUNT CREATION ERROR: ', err);
	});
}

exports.updateSmoochUser = function(name, surname, email, phoneNumber){
	var uniqueId = email;
	if(email == ""){
		uniqueId = phoneNumber;
	}

	smooch.appUsers.update(uniqueId, {
		givenName: name,
		surname: surname,
		email: email,
		phoneNumber: phoneNumber
	});
}

exports.deleteSmoochUser = function(uniqueId){
	smooch.appUsers.deleteProfile(uniqueId).then((response) => {
		console.log('smooch user '+uniqueId+' deleted!');
	}).catch((err) => {
		console.log('DELETION ERROR: ', err);
	});
}

//Check which appointments are about to happen once an hour, send reminder
var job = schedule.scheduleJob('0 * * * *', function(){
    console.log('Starting next cronjob...');
    sendReminders();
});

var sendReminders = function(){
    var message = '';

    Appointment.find({}, function(err, result){
        if(err){
            return;
        }
        result.forEach(function(item){
            var year = item.date.getFullYear();
            var month = item.date.getMonth();
            var day = item.date.getDate();
            var hour = item.date.getHours();
            var currDate = new Date();
            // console.log("Appointment date: "+year+"-"+month+"-"+day);
            // console.log("Actual date: "+currDate.getFullYear()+"-"+currDate.getMonth()+"-"+currDate.getDate());
            if(year == currDate.getFullYear() && month == currDate.getMonth() && day == currDate.getDate()){
            	//Notify client
                Company.findOne({_id: item.company_id}, function(err, company) {
                    if(err)
                        return;
                    if(currDate.getHours() == 0){
                    	if(item.notify){
                        	localSendMessage(genMessage(item, 3), item.phone_number);
                        }
                        notifyEmployees(genMessage(item, 0), company.id);
                    }
                    if(hour == currDate.getHours() + 1){
                    	if(item.notify){
                        	localSendMessage(genMessage(item, 4), item.phone_number);
                        }
                        notifyEmployees(genMessage(item, 2), company.id);
                    }
                });            
            }
        });
    });
}

exports.notifyEmployees = function(companyId, message){
    Employee.find({company_id: companyId}, {password: 0}, function(err, employees){
        if(err){
            return;
        }
        console.log(employees.length);
        employees.forEach(function(employee){
        	// console.log('notifying '+employee.first_name);
            localSendMessage(message, employee.email);
        });
    });
}

var genMessage = function(item, code){
    var message ="";
    var patientName = item.first_name+" "+item.last_name;

    switch(code){
        case 0:
            message = "Your appointment with "+patientName+" is happening today!";
            break;
        case 1:
            message = 'You made an appointment with '+patientName+'!';
            break;
        case 2:
            message = 'Your appointment with '+patientName+" is happening in an hour!";
            break;
        case 3:
        	message = 'Your appointment with '+item.provider_name+' is happening today!';
        	break;
        case 4:
        	message = 'Your appointment with '+item.provider_name+' is happening in an hour!';
        	break;
        default:
            message = "I don't know what I'm sending, or why!";
    }

    return message;
}

var localSendMessage = function(message, appUserId){
	if(appUserId == ""){
		console.log('No app user ID, exiting....');
		return;
	}

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