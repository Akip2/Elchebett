var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
//io = require('socket.io').listen(server, {

var io = require('socket.io').listen(server, {
    //path: '/test',
    //serveClient: false,
    // below are engine.IO options
    pingInterval: 30000,
    pingTimeout: 5000,
    //cookie: false
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname)));

io.sockets.on('connection', function (socket) {

    console.log('Socket connected: ' + socket.conn.remoteAddress);

    socket.on('test', function (val) {
        console.log('Received ping: ' + val);
    });

    socket.on('disconnect', function(socket) {
        console.log('Socket disconnected');
    });
});

server.listen(8001, function () {
    console.log("Server is running on port 8001.");
});