console.log('routes loaded');
module.exports = function(app) {
var fs = require('fs');


	var getPingFromFile = function(req,res) {

		let rawdata = fs.readFileSync('ping_data.json');  
		let ping_data = JSON.parse(rawdata);
		res.send(ping_data)
		console.log(ping_data);  
	};
	
	var writePingToFile = function(req,res) {
		fs.writeFileSync('some_data.json',req);
		console.log(">>>");
		console.dir(req);
	};

	app.get('/api/ping/', function(req,res) {
		console.log("endpoint hit!");
		getPingFromFile(req,res);
	});
	
	app.post('/api/pingdata/', function(req,res) {

		console.log(req.body);
		res.send(req.body); // return the json string
		req.on('data', function(data) {
			fs.writeFileSync('some_data.json',data);

		});


//		console.log("Write ping");
//		writePingToFile(req,res);
	});
	
	app.get('*', function(req, res) {
		// load the single view file (angular will handle the page changes on the front-end)
		res.sendfile('public/index.html'); 
    });

}
