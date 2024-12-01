const Environment= require("./environment.js");
const maps=require("./maps.json");

class Party{
    constructor(maxPlayer=2){
        this.sockets=[];
        this.map=null;
        this.maxPlayer=maxPlayer;
        this.env=new Environment();
    }

    addPlayer(socket){
        this.sockets.push(socket);

        if(this.getPlayerNb()>=1){
            this.loadMap(maps[0]);
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
        this.env.load(map);

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