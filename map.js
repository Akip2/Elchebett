const Player = require("./objects/player.js");
const Matter = require("matter-js");
const { width, height, positionEnum, categoryEnum } = require("./global.js");
const Wall=require("./objects/wall.js");

const Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine = Engine.create();
engine.gravity.y = 3;

var players=[];

const ground=new Wall(width, 300, "#404040", true);
ground.placeDefault(positionEnum.DOWN);
var objects=[ground];

var simulation;

const defaultSpawns = [{x:400, y:350}, {x:width-400, y:350}];

/**
 * Class containing all objects, and runs the matter js environment
 */
class Map {
    constructor(clients, spawnPositions = defaultSpawns) {
        this.spawnPositions = spawnPositions;
        
        this.objectInfos = [];
        this.playerInfos = [];


        this.ids = [];
        clients.forEach((client) => {
            this.ids.push(client.id);
        });
    }

    load() {
        objects.forEach((obj) => {
            obj.addToEnv(engine.world);
        });

        for (let i = 0; i < this.ids.length; i++) {
            let position = this.spawnPositions[i];

            let player = new Player(this.ids[i], "blue", position.x, position.y);

            players.push(player);   

            Composite.add(engine.world, player.body);
        }

        objects.forEach((obj)=>{
            Composite.add(engine.world, obj.body);
        });

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

        simulation=setInterval(() => {
            Matter.Engine.update(engine, 10);
            this.playerInfos=[];
            this.objectInfos=[];

            players.forEach((player) =>{
                this.playerInfos.push(player.serialize());
            });

            objects.forEach((obj) =>{
                this.objectInfos.push(obj.serialize());
            })
        }, 10);
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
}

module.exports = Map;