
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

require('./config/db'); // TODO [DB] : Connect to database
require('./config/passport'); // TODO [FB] : Passport configuration
var port		= 5000;

var app = express();

// all environments
app.set('port', process.env.PORT || port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(process.env.COOKIE_SECRET));
app.use(express.session());

// https://github.com/jaredhanson/passport#middleware
app.use(passport.initialize());
app.use(passport.session());
// Session based flash messages
app.use(flash());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  var messages = req.flash('info');
  res.render('index', {messages: messages});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
