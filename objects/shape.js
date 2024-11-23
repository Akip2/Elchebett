import { width, height, Body, Composite } from "../global.js";

class Shape{
    constructor(body,w, h){
        this.body=body;
        this.width=w;
        this.height=h;
    }

    place(x, y){
        Body.setPosition(this.body, { x: x, y: y});
    }

    placeDefault(position){
        let x=width/2 + (width/2)*position[0] - (this.width/2)*position[0];
        let y=height/2 + (height/2)*position[1] - (this.height/2)*position[1];

        this.place(x,y);
    }

    getPosition(){
        return this.body.position;
    }

    addToEnv(world){
        Composite.add(world, this.body);
    }
}

export default Shape;