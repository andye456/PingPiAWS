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
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.json());                                     // parse application/json



// Listener 
app.post("/receiver",function(req,res) {
    console.log(req.body)
    res.send("Data Received");
});
app.listen("8090");
console.log("Receiver listening on port 8090");

