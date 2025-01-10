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

    getAngle(){
        return this.body.angle;
    }

    getAngularVelocity(){
        return this.body.angularVelocity;
    }

    getVelocity(){
        return this.body.velocity;
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

    getBodyData(){
        return {
            position: this.getPosition(),
            velocity: this.getVelocity(),

            angle: this.getAngle(),
            angularVelocity: this.getAngularVelocity()
        }
    }

    applyData(data){
        this.place(data.position.x, data.position.y);
        Body.setVelocity(this.body, data.velocity);
        Body.setAngle(this.body, data.angle);
    }

    compare(data){
        let positionDist = Math.sqrt(
            (this.getPosition().x - data.position.x)**2
            +
            (this.getPosition().y - data.position.y)**2
        );

        let velocityDist = Math.sqrt(
            (this.getVelocity().x - data.velocity.x)**2
            +
            (this.getVelocity().y - data.velocity.y)**2
        );

        let angleDist = Math.sqrt((this.getAngle() - data.angle)**2)

        let angularVelocityDist = Math.sqrt((this.getAngularVelocity() - data.angularVelocity)**2)

        /*
        console.log("SERVER : "+data.position.x+" ; "+data.position.y);
        console.log("CLIENT : "+this.getPosition().x+" ; "+this.getPosition().y);
        */

        let dif = positionDist + velocityDist + angleDist + angularVelocityDist;

        //this.applyData(data);
        return dif;
    }
}

export default Shape;