var express		= require('express'),
	controllers	= require('./Controllers'),
	public_dir	= __dirname + '/Public',
	host		= '127.0.0.1',
	port		= 5000;

express()
.set('view engine', 'ejs')
.use(express.bodyParser())
// public source
.use('/public/bootstrap', express.static(public_dir + '/bootstrap'))
.use('/public/d3', express.static(public_dir + '/d3'))
.use('/public/vis', express.static(public_dir + '/vis/dist'))
.use('/public/custom', express.static(public_dir + '/custom'))
// pages
.get('/', controllers.renderIndex)
.get('/newsline/:tag', controllers.renderTimeLine)
// apis
.get('/api/newsline/:tag', controllers.getNewsByTag)
.get('/api/tags', controllers.getTags)
.listen(port, host);