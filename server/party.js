import Environment from "./environment.js";
//import maps from "./maps.json";
import { Player } from "../shared/objects/player.js";

import { readFile } from 'fs/promises';


const maps = JSON.parse(
  await readFile(
    new URL('./maps.json', import.meta.url)
  )
);

const colors=["blue", "lime", "cyan", "orange", "yellow"];

class Party{
    constructor(maxPlayer=2){
        this.sockets=[];
        this.players=[];
        this.latencies=[];

        this.maxPlayer=maxPlayer;
        this.env=new Environment();
    }

    addPlayer(socket){
        this.sockets.push(socket);

        let newPlayer=new Player(socket.id, colors[this.getPlayerNb()-1]);
        this.players.push(newPlayer);

        this.latencies.push(0);

        if(this.getPlayerNb()>=2){
            this.loadMap(maps[0]);
        }
    }

    removePlayer(id){
        let index = this.getPlayerIndexById(id);
        this.sockets.splice(index, 1);
        this.players.splice(index, 1);
        this.latencies.splice(index, 1);

        this.map.removePlayer(index);
    }

    sendPlayerOrder(id, order){
        let player=this.getPlayerById(id);
        player.executeOrder(order);

        order.id=id;
        this.notifyPlayers("player", order)
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

    getPlayerIndexById(id){
        let i=0;
        while(this.players[i].id!=id && i<this.players.length){
            i++;
        }

        if(i<this.players.length){
            return i;
        }
        else{
            return -1;
        }
    }

    setLatency(id, latency){
        let index = this.getPlayerIndexById(id);
        this.latencies[index] = latency;

        console.log(this.latencies);
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
        this.notifyPlayers("load", this.env.serialize());


        clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
            this.notifyPlayers("heartbeat", Date.now());
        }, 1);
    }

    notifyPlayers(msg, data){
        const maxLatency=Math.max(this.latencies);
        for(let i = 0; i < this.sockets.length; i++){
            let socket = this.sockets[i];
            let latency = this.latencies[i];

            let delay = maxLatency-latency;

            setTimeout(() => {
                socket.emit(msg, data);
            }, delay);
        }
    }
}

export default Party;