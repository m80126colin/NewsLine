var express		= require('express'),
	controllers	= require('./Controllers'),
	public_dir	= __dirname + '/Public',
	package_dir	= __dirname + '/node_modules',
	port		= 5000,
	app			= express();

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
app.use('/public/bootstrap', express.static(public_dir + '/bootstrap';))
app.use('/public/d3', express.static(package_dir + '/d3'));
app.use('/public/vis', express.static(package_dir + '/vis/dist'));
app.use('/public/custom', express.static(public_dir + '/custom'));
// pages
app.get('/', controllers.renderIndex);
app.get('/newsline/:tag', controllers.renderTimeLine);
// apis
app.get('/api/newsline/:tag', controllers.getNewsByTag);
app.get('/api/tags', controllers.getTags);