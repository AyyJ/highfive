var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var socketIO = require('./socket/socket');

var config = require('./config/config');
var validate = require('./config/validation');
var winstonConfig = require('./config/winston');

var index = require('../routes/index');
var hello = require('../routes/hello');
var validPhone = require('../routes/validPhone');
var formatPhone = require('../routes/formatPhone');

var app = express();

//set that young mongo connection up
mongoose.connect(config.mongoDBURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Connected to mongolab");
});

//Prepare socket stuff my guy
app.set('port', config.port);

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /../public
//app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', index);
app.use('/validPhone/', validPhone);
app.use('/formatPhone/', formatPhone);

app.use(cors());
require('./routes')(app);

//Disable api auth if we're in dev mode
if(app.get('env') !== 'development'){
  app.use('/api/*', validate);
}

//Emissary files
app.get('/settings', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/settings.html'))
});
app.get('/admin-companies', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/admin-companies.html'))
});
app.get('/admin-dashboard', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/admin-dashboard.html'))
});
app.get('/analytics_raw', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/analytics_raw.html'))
});
app.get('/appointments', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/appointments.html'))
});
app.get('/checkin', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/checkin.html'))
});
app.get('/employees', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/employees.html'))
});
app.get('/forgot-password', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/forgot-password.html'))
});
app.get('/form-builder', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/form-builder.html'))
});
app.get('/login', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/login.html'))
});
app.get('/signup', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/signup.html'))
});
app.get('/visitors', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/visitors.html'))
});
app.get('/404', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/404.html'))
});
app.get('/admin-settings', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/admin-settings.html'))
});
app.get('/index', function(req,res){
  res.sendFile(path.join(__dirname,'../public/assets/views/index.html'))
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'cse112_highfive_facebook_verification_token') {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');
    }
});


app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });
    res.sendStatus(200);
  }
});

/*
 * Facebook Methods (TODO: REFACTOR TO DIFF FILE)
 */

 function receivedMessage(event) {
   var senderID = event.sender.id;
   var recipientID = event.recipient.id;
   var timeOfMessage = event.timestamp;
   var message = event.message;

   console.log("Received message for user %d and page %d at %d with message:",
     senderID, recipientID, timeOfMessage);
   console.log(JSON.stringify(message));

   var messageId = message.mid;

   var messageText = message.text;
   var messageAttachments = message.attachments;

   if (messageText) {

     // If we receive a text message, check to see if it matches a keyword
     // and send back the example. Otherwise, just echo the text we received.
     switch (messageText) {
       case 'generic':
         sendGenericMessage(senderID);
         break;

       default:
         sendTextMessage(senderID, messageText);
     }
   } else if (messageAttachments) {
     sendTextMessage(senderID, "Message with attachment received");
   }
 }

 function sendTextMessage(recipientId, messageText) {
   var messageData = {
     recipient: {
       id: recipientId
     },
     message: {
       text: messageText
     }
   };

   callSendAPI(messageData);
 }

 function callSendAPI(messageData) {
   request({
     uri: 'https://graph.facebook.com/v2.6/me/messages',
     qs: { access_token: 'EAAa26bahF3gBAGKMqruIfH3K18dQM2JAPWijZBu7YpgkiZBMSOIP7e2ZAV88b70ODwbGHzUa1suZC2zZAHqN56ZChQe15gCrjcPAxLSq9hwJJZAYV7k5KIVNF7pWZC3qtTSlYWZBPsbuJ584dPntpaPhQWqMUvfLidmbYzI25DluJOQZDZD' },
     method: 'POST',
     json: messageData

   }, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       var recipientId = body.recipient_id;
       var messageId = body.message_id;

       console.log("Successfully sent generic message with id %s to recipient %s",
         messageId, recipientId);
     } else {
       console.error("Unable to send message.");
       console.error(response);
       console.error(error);
     }
   });
 }

 function sendGenericMessage(recipientId) {
   var messageData = {
     recipient: {
       id: recipientId
     },
     message: {
       attachment: {
         type: "template",
         payload: {
           template_type: "generic",
           elements: [{
             title: "rift",
             subtitle: "Next-generation virtual reality",
             item_url: "https://www.oculus.com/en-us/rift/",
             image_url: "http://messengerdemo.parseapp.com/img/rift.png",
             buttons: [{
               type: "web_url",
               url: "https://www.oculus.com/en-us/rift/",
               title: "Open Web URL"
             }, {
               type: "postback",
               title: "Call Postback",
               payload: "Payload for first bubble",
             }],
           }, {
             title: "touch",
             subtitle: "Your Hands, Now in VR",
             item_url: "https://www.oculus.com/en-us/touch/",
             image_url: "http://messengerdemo.parseapp.com/img/touch.png",
             buttons: [{
               type: "web_url",
               url: "https://www.oculus.com/en-us/touch/",
               title: "Open Web URL"
             }, {
               type: "postback",
               title: "Call Postback",
               payload: "Payload for second bubble",
             }]
           }]
         }
       }
     }
   };

   callSendAPI(messageData);
 }



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = require('http').createServer(app);

var io = require('socket.io')(server)
server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode',
    app.get('port'),
    app.get('env'));
});

/*
 * Create Socket.io server.
 */
var server = socketIO.createServer(io);

module.exports = app;
