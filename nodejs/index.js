#!/usr/bin/env node

console.log('Hello from index.js :-)')

//Websocket Setup
var WebSocketServer = require('websocket').server;
var http = require('http');

//I2C Setup
var i2c = require('i2c');
var address = 0x6d; // Address of the Board
var wire = new i2c(address, {device: '/dev/i2c-1'}); // point to your i2c address, debug provides REPL interface

/* Overwrite controls*/
wire.write([0x1000 & 0xFF, 0x1000 >> 8,0x01], function(err) {
	console.log(err);
});

/* Overwrite Tally */
wire.write([0x1000 & 0xFF, 0x1000 >> 8,0x03], function(err) {
        console.log(err);
});


wire.write([0x4001 & 0xFF, 0x4001 >> 8,1 & 0xFF,1 >>8], function(err) {
        console.log(err);
});

wire.write([0x4100 & 0xFF, 0x4100 >> 8,0x01], function(err) {
        console.log(err);
});

/*
wire.readBytes(10, function(err, res) {
console.log(err + res);
});
*/
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
