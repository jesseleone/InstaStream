
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , conf = require('./conf')
  , path = require('path');

var app = express();

var MongoStore = require('connect-mongo')(express);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({ 
	secret: 'secret',
	store: new MongoStore({
		db:'Test',
		url: conf.mongo_uri
	})
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes')(app)

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
