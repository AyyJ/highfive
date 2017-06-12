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

//Smooch parameters
const Smooch = require('smooch-core');
const KEY_ID = 'app_593f1cc81d2c082d00e98d45';
const SECRET = 'MwxBQOtHYoc06nyifOba2FCS';

const smooch = new Smooch({
    keyId: KEY_ID,
    secret: SECRET,
    scope: 'app'
});


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
//Smooch testing
app.post('/messages', function(req, res){
	console.log('webhook PAYLOAD:\n', JSON.stringify(req.body, null, 4));

  if (req.body.trigger === 'message:appUser') {
    smooch.appUsers.sendMessage(appUserId, {
      type: 'text',
      text: 'I don\'t have time for this bullshit',
      role: 'appMaker'
    }).then((response) => {
      console.log('API RESPONSE:\n', response);
      res.end();
    }).catch((err) => {
      console.log('API ERROR:\n', err);
      res.end();
    });
  }
});

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
