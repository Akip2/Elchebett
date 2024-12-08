import { width, height, Body, Composite } from "../global.js";

class Shape{
    constructor(body, w, h, color="black"){
        this.body=body;
        this.width=w;
        this.height=h;
        this.color=color;
    }

    place(x, y){
        Body.setPosition(this.body, { x: x, y: y});
    }

    placeDefault(position){
        let x=width/2 + (width/2)*position[0] - (this.width/2)*position[0];
        let y=height/2 + (height/2)*position[1] - (this.height/2)*position[1];

        this.place(x,y);
    }

    /**
     * Place Shape on the left or right border of the object of reference
     */
    placeNextToHorizontal(ref, position){
        const posRef=ref.getPosition();
        const xRef=posRef.x;
        const yRef=posRef.y;

        const widthRef=ref.width;
        const heightRef=ref.height;

        let x=xRef + (widthRef/2)*position[0] + (this.width/2)*position[0];
        let y=yRef + (heightRef/2)*position[1] - (this.height/2)*position[1] * (position[0]==0 ? -1 : 1);

        this.place(x,y);
    }

    /**
     * Place Shape on the top or bottom border of the object of reference
     */
    placeNextToVertical(ref, position){
        const posRef=ref.getPosition();
        const xRef=posRef.x;
        const yRef=posRef.y;

        const widthRef=ref.width;
        const heightRef=ref.height;

        let x=xRef + (widthRef/2)*position[0] - (this.width/2)*position[0] * (position[1]==0 ? -1 : 1);
        let y=yRef + (heightRef/2)*position[1] + (this.height/2)*position[1];

        this.place(x,y);
    }

    addX(x){
        this.place(this.body.x+x, this.body.y);
    }

    addY(y){
        this.place(this.body.x, this.body.y+y);
    }

    getPosition(){
        return this.body.position;
    }

    addToEnv(world){
        Composite.add(world, this.body);
    }

    serialize(){
        return {
            type: this.type,
            color: this.color,
            position: this.getPosition(),
            width: this.width,
            height: this.height,
        };
    }
}

export default Shape;