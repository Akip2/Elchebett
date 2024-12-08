import { createObject, categoryEnum } from "./global.js";
import Player from "./objects/player.js";

class GameManager{
    constructor(canvasContainer){
        this.isRunning=false;
        this.players=[];
        this.movingObjects=[];
        this.canvasContainer=canvasContainer;
    }

    load(json){
        if(this.isRunning){
            this.clearGame();
        }
        this.canvasContainer.innerHTML="";

        this.engine=Matter.Engine.create(); 
        this.engine.gravity.y=0.5;
      
        this.runner= Matter.Runner.create(); 
        this.render = Matter.Render.create({
          element: this.canvasContainer,
          engine: this.engine,
          options: {
            width: 1920,
            height: 1080,
            wireframes: false,
            background: json.background
          }
        });


        //Adding objects to simulation
        json.staticObjects.forEach((jsonObj) =>{
            let obj=createObject(jsonObj);
            obj.addToEnv(this.engine.world);
        });

        json.players.forEach((jsonPlayer) =>{
            let player=new Player(jsonPlayer.id, jsonPlayer.color);
            player.createBody();
            player.place(jsonPlayer.position.x, jsonPlayer.position.y);

            player.addToEnv(this.engine.world);
            this.players.push(player);
        });

        Matter.Render.run(this.render);
        Matter.Runner.run(this.runner, this.engine);

        Matter.Events.on(this.engine, 'collisionStart', (event) => {
            event.pairs.forEach(pair => {
              const bodyA = pair.bodyA;
              const bodyB = pair.bodyB;

              this.players.forEach(player => {
                if (bodyA === player.body || bodyB === player.body) {
                  const otherBody = (bodyA === player.body) ? bodyB : bodyA;
        
                  if (otherBody.collisionFilter.category === categoryEnum.GROUND) {
                    player.touchGround = true;
                  }
                }
              });
            });
          });

        this.isRunning=true;
    }

    clearGame(){
        //TO DO
        this.isRunning=false;
    }

    sendPlayerOrder(order){
        console.log("sending player order");
        let player=null;
        let playerFound=false;
        let i=0;
            
        while(!playerFound && i<this.players.length){
            player=this.players[i];
            if(player.id==order.id){
                playerFound=true;
                player.executeOrder(order);
            }
            else{
                i++;
            }
        }
    }
}

export default GameManager;