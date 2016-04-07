var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var _ = require('lodash');
var cors = require('cors');
var path = require('path');

// Create the application
var app = express();
var http = require('http').Server(app);
app.io = require('socket.io')(http);

app.settings = require('./settings');
app.jarPath = path.join(__dirname, "jssp.jar");
console.log("Jar path: " + app.jarPath);

// Add Middleware necessary for REST API's
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(cors());

app.get('/', function(req, res, next) {
  return res.status(200).send("Welcome to the API");
});

// Connect to MongoDB
mongoose.connect(app.settings.dbhost);
mongoose.connection.once('open', function() {
  console.log("API started.");
  console.log("Connected with the database.");

  // socket connections
  app.io.on('connection', function(socket) {
    console.log("Dashboard connected.");
    app.socket = socket;
  })

	// Load the models
	app.models = require('./models/index');

	// Load the routes
	var routes = require('./routes');
	_.each(routes, function(controller, route) {
		app.use(route, controller(app, route));
	});

	console.log('Listening on port ' + app.settings.port);
  http.listen(app.settings.port, function() {
    console.log('Listening on port ' + app.settings.port);
  });
});
