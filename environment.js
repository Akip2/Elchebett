const Player = require("./objects/player.js");
const Matter = require("matter-js");
const { width, height, positionEnum, categoryEnum } = require("./global.js");
const Wall=require("./objects/wall.js");

const Engine = Matter.Engine,
    Composite = Matter.Composite;

var engine = Engine.create();
engine.gravity.y = 3;

var players=[];
var objects=[];

var simulation;

/**
 * Class containing all objects, and runs the matter js environment
 */
class Environment {
    createObject(json){
        let res;

        switch(json.type){
            case "wall":
                res=new Wall(json.width, json.height, json.color, json.isGround, json.position.x, json.position.y);
                break;
            
            default:
                console.log("Unknown object type");
        }

        return res;
    }

    load(mapObj, sockets) {
        this.spawnPositions = mapObj.spawnPositions;
        
        this.staticObjects=[];
        mapObj.staticObjects.forEach((json) =>{
            let obj=this.createObject(json);
            this.staticObjects.push(obj.serialize());
            Composite.add(engine.world, obj.body);
        })

        let movingObjects=mapObj.movingObjects;
        if(movingObjects!==undefined){
            mapObj.movingObjects.forEach((json) =>{
                let obj=this.createObject(json);
                objects.push(obj);
                Composite.add(engine.world, obj.body);
            })
        }

        /*
        for (let i = 0; i < this.ids.length; i++) {
            let position = this.spawnPositions[i];

            let player = new Player(this.ids[i], "blue", position.x, position.y);

            players.push(player);   

            Composite.add(engine.world, player.body);
        }
            */

        Matter.Events.on(engine, 'collisionStart', function(event) {
            event.pairs.forEach(pair => {
              const bodyA = pair.bodyA;
              const bodyB = pair.bodyB;
        
              players.forEach(player => {
                if (bodyA === player.body || bodyB === player.body) {
                  const otherBody = (bodyA === player.body) ? bodyB : bodyA;
        
                  if (otherBody.collisionFilter.category === categoryEnum.GROUND) {
                    player.touchGround = true;
                  }
                }
              });
            });
          });

        simulation=setInterval(()=>this.update(), 10);
    }

    update(){
        const currTime = 0.001 * Date.now();
        Engine.update(engine, 1000/60, this.lastTime ? currTime / this.lastTime : 1);
        this.lastTime = currTime;
        
        this.playerInfos=[];
        this.movingObjects=[];

        players.forEach((player) =>{
            this.playerInfos.push(player.serialize());
        });

        objects.forEach((obj) =>{
            this.movingObjects.push(obj.serialize());
        });
    }

    moveHorizontal(id, direction){
        let player=this.getPlayerById(id);
        if(direction!=0){
            player.move(direction);
        }
        else{
            player.stopMoving();
        }
    }

    jump(id, activate){
        let player=this.getPlayerById(id);
        if(activate){
            player.jump();
        }
        else{
            player.stopJumping();
        }
    }

    getPlayerById(id){
        let player=players[0];

        let i=1;
        while(player.id!=id && i<players.length){
            player=players[i];
            i++;
        }

        return player;
    }

    removePlayer(index) {
        this.playerInfos.splice(index, 1);

        const removedBody = players.splice(index, 1)[0].body;
        Composite.remove(engine.world, removedBody);
    }

    serialize(){
        return {
            objects: this.movingObjects,
            players: this.playerInfos
        }
    }

    getStaticDatas(){
        return {
            objects : this.staticObjects
        };
    }
}

module.exports = Environment;