const Party=require("./party.js");
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);

class Server{
    constructor(){
        this.parties=[];
    }

    addPlayer(socket){
        let freeParty=this.getFreeParty();
        freeParty.addPlayer(socket);
    }

    removePlayer(socket){
        let index=this.getPlayerPartyIndex(socket);
        let party=this.parties[index];
        party.removePlayer(socket);

        if(party.isEmpty()){
            this.parties.splice(index,1);
        }
    }

    getFreeParty(){
        let freeParty=null;

        this.parties.forEach((party) => {
            if(party.isFree() && (freeParty==null || party.getPlayerNb()<freeParty.getPlayerNb())){
                freeParty=party;
            }
        });

        if(freeParty==null){ //no party available, we create a new one
            freeParty=new Party();
            this.parties.push(freeParty);
        }

        return freeParty;
    }

    getPlayerPartyIndex(socket){
        let party=null;
        let playerFound=false;
        let i=0;
        
        while(!playerFound && i<this.parties.length){
            party=this.parties[i];
            if(party.containsPlayer(socket)){
                playerFound=true;
            }
            else{
                i++;
            }
        }

        return i;
    }

    moveHorizontal(socket, direction){
        let index=this.getPlayerPartyIndex(socket);
        let party=this.parties[index];

        party.moveHorizontal(socket, direction);
    }
}

const serverObj=new Server();

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

    serverObj.addPlayer(socket);

    socket.on('disconnect', function() {
        console.log('Socket disconnected');

        serverObj.removePlayer(socket);
    });

    socket.on("horizontal", function(val){
        serverObj.moveHorizontal(socket, val);
    })
});

server.listen(8001, function () {
    console.log("Server is running on port 8001.");
});