const Map= require("./map.js");

class Party{
    constructor(maxPlayer=3){
        this.sockets=[];
        this.map=null;
        this.maxPlayer=maxPlayer;
        this.updateInterval = setInterval(() =>this.notifyPlayers(), 10);
    }

    setMap(map){
        this.map=map;
    }

    addPlayer(socket){
        this.sockets.push(socket);

        if(this.getPlayerNb()>=2){
            this.loadMap(new Map([[50, 50], [200, 200]]));
        }
    }

    removePlayer(socket){
        let index = this.sockets.indexOf(socket);
        this.sockets.splice(index, 1);
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
        this.map=map;

        this.map.load(this.getPlayerNb());

        this.sockets.forEach((socket) => {
            socket.emit('loadMap', this.map);
        })
    }

    notifyPlayers(){
        this.sockets.forEach((socket) => {
            socket.emit('update', this.map);
        })
    }
}

module.exports=Party;