// Requires
var express = require('express');
var path = require('path');
var querystring = require("querystring");
var url = require('url');

//GPIO Module
//var pio = require('pi-gpio');
var Gpio = require('onoff').Gpio;
var led = new Gpio(4,'out');

// Create app
var app = express();
var port = 8999;

// Set views
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

console.log('Initialisation complete');

// Serve files
app.get('/interface', function(request, response){
 response.sendfile('views/interface.html')
	console.log('Interface Served');
});


// Send commands to PI
app.get("/send", function(request, response){
		console.log('Send GET');
		// Get data
		var queryData = url.parse(request.url, true).query;
		console.log("State " + queryData.state + " received.");
		
		// Apply command
		if (queryData.state == 'on') {
			console.log('Blinker active');
			led.writeSync(0);
		    setTimeout(led.writeSync(1),500);
		}
		if (queryData.state == 'off') {
			console.log('Off');
			led.writeSync(0);
			led.unexport();
			console.log('Exit');
			process.exit();
		} 
		// Answer
		response.writeHead(200, {"Content-Type": "text/html"});
		response.end();
});

// Start server
app.listen(port, '0.0.0.0');
console.log("Listening on port " + port);
