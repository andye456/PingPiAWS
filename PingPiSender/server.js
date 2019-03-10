//********************************************************************//
//   RASPBERRY PI version!!!!!
//********************************************************************//


// This is running on the Raspberry Pi and is used to collect ping data and output it in
// JSON format when the URL is called.

// server.js

console.log("****** Must run as root *******");

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
// This is needed to do the ping monitoring
var ping = require ("net-ping");
var http = require('http');


app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


// load the routes
interval=5000; // default time period

app.listen("8090");


// read the data file with temp val every $timeperiod seconds
var run = setInterval(sendPingData,interval); // every 5 seconds


var ping_options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 1,
    sessionId: (process.pid % 65535),
    timeout: 4000,
    ttl: 128
};


var session = ping.createSession(ping_options);

function sendPingData() {
    console.log("PING!\n");
    var target = "8.8.8.8";
    
    session.pingHost (target, function (error, target, sent, rcvd) {
	var ms = rcvd - sent;
	// TODO: Maybe only write failure to the Mongo DB to save data.
	if(error) {
	    if (error instanceof ping.RequestTimedOutError) {
		    var pingobj = {'date':getDateTime(), 'outcome':'timeout', 'time':4000};	
	    } else {
		    var pingobj = {'date':getDateTime(), 'outcome':'unreachable', 'time':0};
	    }
	} else {
	    var pingobj = {'date':getDateTime(), 'outcome':'success', 'time':ms};	    
	}
	data = JSON.stringify(pingobj);  
	// This is the info for the remote server	    
	var options = {
	    host: '35.176.56.125',
	    //host: 'localhost',
	    port: 8090,
	    path: '/receiver',
	    method: 'POST',
	    headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': Buffer.byteLength(data)
	    }
	};
	// Set up the HTTP request based on the above options
	var httpreq = http.request(options, function (response) {
	    response.setEncoding('utf8');
	    console.log(data);
	    response.on('data', function (chunk) {
		console.log("body: " + chunk);
	    });
	    //response.on('end', function() {
		//res.send('ok');
	    //});
	});
	// write the json string to the remote location.
	httpreq.write(data);
	httpreq.end();
	
    });

};




function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec;

}



