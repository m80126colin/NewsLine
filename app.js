
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');

var public_dir	= __dirname + '/Public';
var package_dir	= __dirname + '/node_modules';
var controllers	= require('./Controllers');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(express.cookieParser(process.env.COOKIE_SECRET));
//app.use(express.session());

// https://github.com/jaredhanson/passport#middleware
app.use(passport.initialize());
app.use(passport.session());
// Session based flash messages
app.use(flash());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// public source
app.use('/public/bootstrap', express.static(public_dir + '/bootstrap'));
app.use('/public/d3', express.static(path.join(package_dir + '/d3')));
app.use('/public/vis', express.static(path.join(package_dir + '/vis/dist')));
app.use('/public/custom', express.static(path.join(public_dir + '/custom')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', controllers.renderIndex);
//app.get('/', function(req, res){
//  var messages = req.flash('info');
//  res.render('index', {messages: messages});
//});
app.get('/newsline/:tag', controllers.renderTimeLine);

// apis
app.get('/api/newsline/:tag', controllers.getNewsByTag);
app.get('/api/tags', controllers.getTags);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
