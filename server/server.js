// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var multer  = require('multer');
var bodyParser = require('body-parser');

// connect mongodb
var mongoose   = require('mongoose');
mongoose.connect('mongodb://gmusicant:pageas315@ds041150.mongolab.com:41150/petanque'); // connect to our database

// use mongo models

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({ 
	
	dest: './images/',
	rename: function (fieldname, filename) {
		return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
	}
	
}));

//var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE");
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here

require('./app/routes')(app, router);

// create a bear (accessed at POST http://localhost:8080/api/bears)

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
	
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(8080, 'api.angular.com');
console.log('Magic happens on port ');

