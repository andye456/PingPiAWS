console.log('routes loaded');
module.exports = function(app) {
var fs = require('fs');
	
	app.get('*', function(req, res) {
		// load the single view file (angular will handle the page changes on the front-end)
		res.sendfile('public/index.html'); 
    });

}
