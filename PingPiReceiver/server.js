//********************************************************************//
//   RASPBERRY PI version!!!!!
//********************************************************************//


// This is running on the Raspberry Pi and is used to collect ping data and output it in
// JSON format when the URL is called.

// server.js

console.log("****** Ping receiver *******");

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.json());                                     // parse application/json

// load the routes
require('./app/routes')(app);


// configuration =================
// connect to mongoDB database on localhost 
var database = require('./config/database');
mongoose.connect(database.url); // url comes from the require above.

// Get connection status - global
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log('Mongodb connection success!!');
});

app.listen("8090");
console.log("Receiver listening on port 8090");

