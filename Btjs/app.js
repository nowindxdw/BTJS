
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var partials = require('express-partials');
var path =require('path');
var serveStatic = require('serve-static');


var app = module.exports = express.createServer();

// Configuration
global.__base = __dirname;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
//init DB
var dbConfig ={
  "connectionLimit"     : 10,
      "host"            : "127.0.0.1",
      "user"            : "root",
      "password"        : "100821",
      "logSql"		    : true
};
var mysql = require('mysql');
var pool  = mysql.createPool(dbConfig);
global.__mysql = pool;
//init logger
var logger = require(__dirname+'/modules/logService');
global.__logService = logger;
// Routes
app.get('/', routes.index);
var track = require('./routes/track');
app.get('/track',track.index );
var tracklist = require('./routes/tracklist');
app.get('/track/list',tracklist.index );
var map = require('./routes/map');
app.get('/map',map.index );
var update = require('./routes/update');
app.get('/update',update.index );
//app.get('/shopping', routes.shopping);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d", process.env.PORT || 3000);
});
