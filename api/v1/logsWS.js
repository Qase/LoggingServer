"use strict";

const  webSocketsServerPort = 12345;
const webSocketServer = require('websocket').server;
const  http = require('http');

const LogRepository = require('../../repositories/logRepository');

var clients = [];

function log(message) {
    console.log((new Date()) + " " + message);
}

var server = http.createServer(function(request, response) {});

server.listen(webSocketsServerPort, function() {
    log("Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    log('New Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    log('Connection accepted.');

    connection.on('message', function(message) {
        log('Received Message from client ' + index + ': ' + message);
        var logObject =  JSON.parse(message);

        // TODO validate here

        LogRepository.create(logObject).then(
            (val) => {
                return res.status(val.code).send(val.value);
            },
            (reason) => {
                return res.status(reason.code).send(reason.value);
            });
    });

    connection.on('close', function(connection) {
        log("Peer " + index + " disconnected.");
        clients.splice(index, 1);
    });
});
