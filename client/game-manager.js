import { createObject, Composite } from "./global.js";
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

        console.log(this.engine.world);

        Matter.Render.run(this.render);
        Matter.Runner.run(this.runner, this.engine);

        this.isRunning=true;
    }

    clearGame(){
        //TO DO
        this.isRunning=false;
    }
}

export default GameManager;