const Map= require("./map.js");

class Party{
    constructor(maxPlayer=2){
        this.sockets=[];
        this.map=null;
        this.maxPlayer=maxPlayer;
        //this.updateInterval = setInterval(() =>this.notifyPlayers(), 10);
    }

    addPlayer(socket){
        this.sockets.push(socket);

        if(this.getPlayerNb()>=2){
            this.loadMap(new Map(this.sockets));
        }
    }

    removePlayer(socket){
        let index = this.sockets.indexOf(socket);
        this.sockets.splice(index, 1);

        this.map.removePlayer(index);
    }

    executeOrder(socket, order){
        switch(order.type){
            case "horizontal":
                this.map.moveHorizontal(socket.id, order.direction);
                break;

            case "jump":
                this.map.jump(socket.id, order.activate);
                break;
            
            default:
                console.log("Unknown order");
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
        this.map=map;
        this.map.load();
        
        clearInterval(this.updateInterval);
        this.updateInterval = setInterval(() =>this.notifyPlayers(), 10);
    }

    notifyPlayers(){
        this.sockets.forEach((socket) => {
            socket.emit('update', this.map);
        })
    }
}

module.exports=Party;