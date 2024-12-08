import Wall from "./objects/wall.js";

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
        this.engine.gravity.y=0;
      
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
        /*
        json.staticObjects.forEach((jsonObj) =>{
            let obj=this.createObject(jsonObj);
            obj.addToEnv(this.engine.world);
        });
        */

        Matter.Render.run(this.render);
        Matter.Runner.run(this.runner, this.engine);

        this.isRunning=true;
    }

    clearGame(){
        //TO DO
        this.isRunning=false;
    }

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
}

export default GameManager;