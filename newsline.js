var express		= require('express'),
	controllers	= require('./Controllers'),
	public_dir	= __dirname + '/Public',
	package_dir	= __dirname + '/node_modules',
	port		= 5000;

express()
// all environments
.set('port', process.env.PORT || port)
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.use(express.favicon())
.use(express.logger('dev'))
.use(express.json())
.use(express.urlencoded())
.use(express.methodOverride())
.use(express.cookieParser(process.env.COOKIE_SECRET))
.use(express.session())
.use(express.bodyParser())
// public source
.use('/public/bootstrap', express.static(public_dir + '/bootstrap'))
.use('/public/d3', express.static(package_dir + '/d3'))
.use('/public/vis', express.static(package_dir + '/vis/dist'))
.use('/public/custom', express.static(public_dir + '/custom'))
// pages
.get('/', controllers.renderIndex)
.get('/newsline/:tag', controllers.renderTimeLine)
// apis
.get('/api/newsline/:tag', controllers.getNewsByTag)
.get('/api/tags', controllers.getTags);