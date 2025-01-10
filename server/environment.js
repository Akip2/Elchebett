import Matter from "matter-js";
import { width, height, positionEnum, categoryEnum, FPS } from "../shared/global.js";
import { createObject } from "../shared/global.js";

const Engine = Matter.Engine

var engine = Engine.create();
engine.gravity.y = 0.5;

var players=[];
var objects=[];

/**
 * Class containing all objects, and runs the matter js environment server-side
 */
class Environment {
    load(mapObj, playerArray) {
        this.background=mapObj.background;

        this.staticObjects=[];
        mapObj.staticObjects.forEach((json) => {
            let obj=createObject(json);
            obj.addToEnv(engine.world);
            
            this.staticObjects.push(obj.serialize());
        });

        this.movingObjects=[];
        if(mapObj.movingObjects!==undefined){
            mapObj.movingObjects.forEach((json)=>{
                let obj=createObject(json);
                obj.addToEnv(engine.world);
                objects.push(obj);

                this.movingObjects.push(obj.serialize());
            });
        }

        this.playerInfos=[];
        for (let i = 0; i < playerArray.length; i++) {
            let position = mapObj.spawnPositions[i];

            let player=playerArray[i];
            player.createBody();
            player.place(position.x, position.y);

            players.push(player);   
            player.addToEnv(engine.world);

            this.playerInfos.push(player.serialize());
        }

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
    }

    update(){
        Engine.update(engine, 1000 / FPS)
        
        this.playerInfos=[];
        this.movingObjects=[];

        players.forEach((player) =>{
            this.playerInfos.push(player.getBodyData());
        });

        objects.forEach((obj) =>{
            this.movingObjects.push(obj.getBodyData());
        });
    }

    removePlayer(id) {
        //TO DO
    }

    getMovingObjects(){
        return {
            movingObjects: this.movingObjects,
            players: this.playerInfos
        }
    }

    serialize(){
        return {
            background : this.background,
            staticObjects : this.staticObjects,
            movingObjects : this.movingObjects,
            players : this.playerInfos
        };
    }
}

export default Environment;