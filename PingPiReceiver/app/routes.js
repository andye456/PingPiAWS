console.log('routes loaded');
// get the pingdata schema def
var ping = require('./modules/pingdata');

module.exports = function(app) {
    // This writes the data received from the ping command to the mongo database.
    function writePingDataToMongo(pingobj) {
	db.collection('pingdata').insert(pingobj, function (err, result) {
	    if (err) {
		console.log("pingobj :"+pingobj);
		console.log(err);
	    } else {
		console.log('Inserted %d documents into the "pingdata" collection. The documents inserted with "_id" are:', result.length, result);
	    }
	});
    };    

    var getPingFromMongo = function(req,res) {
	// If the values of the start and end dates are set in the UI then apply them to the database search
	if (req.query.start != "" && req.query.end != "") {
	    ping.find(
		{ timestamp : { $gte: req.query.start, $lt: req.query.end } },
		function(err, pingvals) {

		if (err) {
		    res.send(err);
		    console.log(err);
		} else {
		    res.json(pingvals);
		}			
	    });
	} else {
	    ping.find(
		function(err, pingvals) {
		
		if (err) {
		    res.send(err);
		    console.log(err);
		} else {
		    res.json(pingvals);				
		}
	    });
	}

    };


    
    // Listener - when data is received at this URL it calls writePingDataToMongo with the data received as a parameter.
    app.post("/receiver",function(req,res) {
	writePingDataToMongo(req.body);
    });
    
    // Get the ping data for the date specified.
    // query would be of the form http://hostname:8090/api/pingdata?start=2019-03-13T21:03:51&end=2019-03-13T22:03:51
    app.get('/api/pingdata/', function(req,res) {
	getPingFromMongo(req,res);
    });	
    
    app.get('*', function(req, res) {
	// load the single view file (angular will handle the page changes on the front-end)
	res.sendfile('public/index.html'); 
    });


}
