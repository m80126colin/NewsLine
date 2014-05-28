var express = require('express');
var controllers = require('./Controllers');
var host = '127.0.0.1';
var port = 5000;

express()
.set('view engine', 'ejs')
.use(express.bodyParser())
.use('/public', express.static(__dirname + '/Public'))
.get('/newsline/:tag', controllers.getTag)
.listen(port, host);