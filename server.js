const PartyManager = require('./party-manager');
const partyManager=new PartyManager();

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);

var io = require('socket.io').listen(server, {
    //path: '/test',
    //serveClient: false,
    // below are engine.IO options
    pingInterval: 30000,
    pingTimeout: 5000,
    //cookie: false
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(path.join(__dirname+'/public/')));

io.sockets.on('connection', function (socket) {
    console.log('Socket connected: ' + socket.conn.remoteAddress);

    partyManager.addPlayer(socket);

    socket.on('disconnect', function() {
        console.log('Socket disconnected');

        partyManager.removePlayer(socket);
    });

    socket.on("horizontal", function(val){
        partyManager.moveHorizontal(socket, val);
    })
});

server.listen(8001, function () {
    console.log("Server is running on port 8001.");
});