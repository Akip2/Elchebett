const Player=require("./objects/player.js");

class Map{
    constructor(spawnPositions, objects=[]){
        this.spawnPositions=spawnPositions;
        this.objects=objects;

        this.players=[];
    }

    load(nbPlayer){
        for(let i=0; i<nbPlayer; i++){
            let position=this.spawnPositions[i];

            let player=new Player("blue", position[0], position[1]);
            this.players.push(player);
        }

        console.log("map loaded");
    }
}

module.exports=Map;