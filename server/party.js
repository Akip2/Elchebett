const Environment= require("./environment.js");
const maps=require("./maps.json");
const { Player } = require("../shared/objects/player.js");

const colors=["blue", "lime", "cyan", "orange", "yellow"];

class Party{
    constructor(maxPlayer=2){
        this.sockets=[];
        this.players=[];
        this.maxPlayer=maxPlayer;
        this.env=new Environment();
    }

    addPlayer(socket){
        this.sockets.push(socket);

        let newPlayer=new Player(socket.id, colors[this.getPlayerNb()-1]);
        this.players.push(newPlayer);

        if(this.getPlayerNb()>=2){
            this.loadMap(maps[0]);
        }
    }

    removePlayer(socket){
        let index = this.sockets.indexOf(socket);
        this.sockets.splice(index, 1);

        this.map.removePlayer(index);
    }

    sendPlayerOrder(id, order){
        let player=this.getPlayerById(id);
        player.executeOrder(order);
    }

    getPlayerById(id){
        let i=0;
        while(this.players[i].id!=id && i<this.players.length){
            i++;
        }

        if(i<this.players.length){
            return this.players[i];
        }
        else{
            return null;
        }
    }

    containsPlayer(socket){
        return this.sockets.includes(socket);
    }

    isFree(){
        return this.sockets.length<this.maxPlayer;
    }

    isEmpty(){
        return this.sockets.length==0;
    }

    getPlayerNb(){
        return this.sockets.length;
    }

    loadMap(map){
        this.env.load(map, this.players);

        clearInterval(this.updateInterval);
        this.notifyPlayers("load", this.env.getStaticDatas());
        this.updateInterval = setInterval(() =>this.notifyPlayers("update", this.env.serialize()), 10);
    }

    notifyPlayers(msg, data){
        this.sockets.forEach((socket) => {
            socket.emit(msg, data);
        })
    }
}

module.exports=Party;