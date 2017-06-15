'use strict';

/*This module is meant to house the functions
 * used by the authorization (auth) API. The
 * actual API is set up in index.js

 Functions:
 authSignup()
 authLogin()
 authResetCredentials()
 */


/* need this to enable cross origin resource sharing.If disabled, we might
 * not need this later. This is just to get the example to work
 * when front end is served from a something other than our app server.
 */
var Appointment = require('../../models/Appointment');
var Company = require('../../models/Company');
var schedule = require('node-schedule');
var smooch = require('../../notification/smooch');

/****** Company TEMPLATE ROUTES ******/
module.exports.template = {};

module.exports.template.create = function(req, res) {
    var appointment = new Appointment();
    var param = req.body;

    //require provided info
    appointment.first_name = param.first_name;
    appointment.last_name = param.last_name;
    appointment.phone_number = param.phone_number;
    appointment.date = param.date;
    appointment.company_id = param.company_id;
    appointment.provider_name = param.provider_name;

    var relatedCompany = Company.findOne({_id: req.params.id}, function(err, company) {
        if(err){
            console.log('couldn\'t find related company while making appt');
            return;
        }
        return company;
    });

    Appointment.find(
        {
            company_id:param.company_id,
            date:param.date
        }, function(err, appointments){
            if(err) return res.status(400).json({error: "Could Not Find"});
            if(appointments.length==0) {
                appointment.save(function (err, a) {
                    if (err)
                        return res.status(400).json({error: "Could Not Save"});
                    console.log('sending message');
                    smooch.sendMessage(genMessage(appointment,1), relatedCompany.email);
                    return res.status(200).json(a);
                });
            }else{
                return res.status(400).json({error: "Already Created"});
            }
        });
};

module.exports.template.getAll = function(req, res) {
    Appointment.find({company_id: req.params.id}, function(err, result){
            if(err){
                return res.status(400).json(err);
            }
            return res.status(200).json(result);
        });
};

module.exports.template.get = function(req, res) {
    Appointment.findOne({_id: req.params.id}, function(err, a) {
        if(err || !a)
            return res.status(400).send({error: "Could Not Find"});
        return res.status(200).json(a);
    });
};

module.exports.template.update = function(req, res){
    Appointment.findOne({_id: req.params.id}, function (err, a) {
        if(err || !a)
            return res.status(401).json({error: "Could Not Find"});

        if (req.body.first_name !== undefined)
            a.first_name = req.body.first_name;

        if (req.body.last_name !== undefined)
            a.last_name = req.body.last_name;

        if (req.body.phone_number !== undefined)
            a.phone_number  = req.body.phone_number ;

        if (req.body.date!== undefined)
            a.date = req.body.date;
        if (req.body.provider_name!== undefined)
            a.provider_name = req.body.provider_name;
        //TODO check if the date is taken already
        a.save(function(err) {
            if(err) {
                return res.status(400).json({error: "Could Not Save"});
            }
            return res.status(200).json(a);
        });
    });
};

module.exports.template.delete = function(req, res){
    Appointment.findById(req.params.id, function(err, a) {
        if(err)
            res.status(400).json({error: "Could Not Find"});
        a.remove(function(err) {
            if(err) {
                res.status(400).json({error: "Could Not Save"});
            } else {
                return res.status(200).json(a);
            }
        });
    });
};

//Check which appointments are about to happen, send reminder
var job = schedule.scheduleJob('* * * * *', function(){
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
            var currDate = new Date();
            console.log("Appointment date: "+year+"-"+month+"-"+day);
            console.log("Actual date: "+currDate.getFullYear()+"-"+currDate.getMonth()+"-"+currDate.getDate());
            if(year == currDate.getFullYear() && month == currDate.getMonth() && day == currDate.getDate()){
                Company.findOne({_id: item.company_id}, function(err, company) {
                    if(err)
                        return;
                    console.log('sending reminder');
                    smooch.sendMessage(genMessage(item, 0), company.email);
                });            
            }
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
        default:
            message = "I don't know what I'm sending, or why!";
    }

    return message;
}