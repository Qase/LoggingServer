"use strict";

const webSocketsServerPort = 46379;
const webSocketServer = require('websocket').server;
const http = require('http');

const DBRepository = require('../../repositories/dbRepository');

var clients = [];

function log(message) {
    console.log((new Date()) + " " + message);
}

var server = http.createServer(function(request, response) {});

server.listen(webSocketsServerPort, function() {
    log("WS Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
    httpServer: server,
    path: "/ws/v1"
});

wsServer.on('request', function(request) {
    log('New Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    log('Connection accepted.');

    connection.on('message', function(message) {
        log('Received Message from client ' + index + ': ' + message);
        try {
            if(message.type === 'utf8') {
                var logObject = JSON.parse(message.utf8Data);

                // TODO validate here

                DBRepository.create(logObject).then(
                    (val) => {
                        console.log("New log stored.");
                    },
                    (reason) => {
                        console.log("Could not store new log.");
                    });
            }
        } catch (e) {
            console.log("Received invalid message.");
        }
    });

    connection.on('close', function(connection) {
        log("Peer " + index + " disconnected.");
        clients.splice(index, 1);
    });
});
