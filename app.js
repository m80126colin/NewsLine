var express		= require('express');
var path		= require('path');
var controllers	= require('./Controllers');
var public_dir	= __dirname + '/Public';
var package_dir	= __dirname + '/node_modules';
var port		= 5000;
var app			= express();

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
app.use(express.bodyParser());
// public source
app.use('/public/bootstrap', express.static(public_dir + '/bootstrap'));
app.use('/public/d3', express.static(package_dir + '/d3'));
app.use('/public/vis', express.static(package_dir + '/vis/dist'));
app.use('/public/custom', express.static(public_dir + '/custom'));
// pages
app.get('/', controllers.renderIndex);
app.get('/newsline/:tag', controllers.renderTimeLine);
// apis
app.get('/api/tags', controllers.getTags);
app.get('/api/newsline/:tag', controllers.getNewsByTag);
// admin
app.get('/admin', controllers.renderAdmin);