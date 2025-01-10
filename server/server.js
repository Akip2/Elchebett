import Party from "./party.js";
import express from 'express';
import path from 'path';
import { dirname } from 'path'; 
import { fileURLToPath } from 'url';
import http from "http";
import Server from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();
var server = http.createServer(app);

var parties=[];


function addPlayer(socket){
    let freeParty=getFreeParty();
    freeParty.addPlayer(socket);
}

function removePlayer(socket){
    let index=getPlayerPartyIndex(socket);
    let party=parties[index];
    party.removePlayer(socket);

    if(party.isEmpty()){
        parties.splice(index,1);
    }
}

function getFreeParty(){
    let freeParty=null;

    parties.forEach((party) => {
        if(party.isFree() && (freeParty==null || party.getPlayerNb()<freeParty.getPlayerNb())){
            freeParty=party;
        }
    });

    if(freeParty==null){ //no party available, we create a new one
        freeParty=new Party();
        parties.push(freeParty);
    }

    return freeParty;
}

function getPlayerPartyIndex(socket){
    let party=null;
    let playerFound=false;
    let i=0;
        
    while(!playerFound && i<parties.length){
        party=parties[i];
        if(party.containsPlayer(socket)){
            playerFound=true;
        }
        else{
            i++;
        }
    }

    return i;
}

function sendPlayerOrder(socket, order){
    let index=getPlayerPartyIndex(socket);
    let party=parties[index];

    party.sendPlayerOrder(socket.id, order);
}

var io = Server.listen(server, {
    //path: '/test',
    //serveClient: false,
    // below are engine.IO options
    pingInterval: 30000,
    pingTimeout: 5000,
    //cookie: false
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/../client/index.html'));
});

app.use(express.static(path.join(__dirname, '/../client/')));
app.use(express.static(path.join(__dirname, '/../shared/')));

io.sockets.on('connection', function (socket) {
    console.log('Socket connected: ' + socket.conn.remoteAddress);
    
    addPlayer(socket);

    socket.on('disconnect', function() {
        console.log('Socket disconnected');

        removePlayer(socket);
    });

    socket.on("player", function(order){
        sendPlayerOrder(socket, order);
    })

    socket.on("callback", function(date){
        let index = getPlayerPartyIndex(socket);
        let party = parties[index];

        let latency = (Date.now() - date);
        party.setLatency(socket.id, latency);
    });

    socket.on("upda", function(){
        let index = getPlayerPartyIndex(socket);
        let party = parties[index];

        party.synchronize();
    });
});

server.listen(8001, function () {
    console.log("Server is running on port 8001.");
});