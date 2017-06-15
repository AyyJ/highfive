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

	smooch.appUsers.create(email, {
		givenName: name,
		surname: surname,
		email: email
	}).then((response) => {
		smooch.appUsers.linkChannel(email, {
			type: 'twilio',
			phoneNumber: "+1"+phoneNumber,
			confirmation: {
				type: 'immediate'
			}		
		}).then((response) => {
			sendMessage(allClear, email);
		});
		smooch.appUsers.linkChannel(email, {
			type: 'messenger',
			givenName: name,
			surname: surname,
			phoneNumber: "+1"+phoneNumber,
			confirmation: {
				type: 'immediate'
			}
		}).then((response) => {
			console.log("linked to messenger");
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
            console.log("Appointment date: "+year+"-"+month+"-"+day);
            console.log("Actual date: "+currDate.getFullYear()+"-"+currDate.getMonth()+"-"+currDate.getDate());
            if(year == currDate.getFullYear() && month == currDate.getMonth() && day == currDate.getDate()){
                Company.findOne({_id: item.company_id}, function(err, company) {
                    if(err)
                        return;
                    if(currDate.getHours() == 0){
                        notifyEmployees(genMessage(item, 0), company.id);
                    }
                    if(hour == currDate.getHours() + 1){
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
    switch(code){
        case 0:
            message = "Your appointment with "+item.first_name+" "+item.last_name+" is happening today!";
            break;
        case 1:
            message = 'You made an appointment with '+item.first_name+" "+item.last_name+"!";
            break;
        case 2:
            message = 'Your appointment with '+item.first_name+" "+item.last_name+" is happening in an hour!";
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