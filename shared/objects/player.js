import Shape from "./shape.js";
import { Bodies, Body, categoryEnum} from "../global.js";


const isServer = typeof window === 'undefined';

var Matter;
if(isServer){
    const matterModule=await import('matter-js');
    Matter = matterModule.default;
}
else{
    Matter=window.Matter;
}

const maxSpeedX=12;
const speedX=0.12;
const jumpForce=-0.03;

const bodyTypeEnum = Object.freeze({
    CIRCLE: "circle",
    SQUARE: "square"
});

class Player extends Shape{
    constructor(id, color){
        super(null, 0, 0, color);

        this.touchGround=false;
        this.id=id;

        this.horizontalInterval=null;
        this.jumpInterval=null;
    }

    executeOrder(order){
        switch(order.type){
            case "horizontal":
                if(order.direction!=0){
                    this.move(order.direction);
                }
                else{
                    this.stopMoving();
                }
                break;

            case "jump":
                if(order.activate){
                    this.jump();
                }
                else{
                    this.stopJumping();
                }
                break;
            
            default:
                console.log("Unknown order");
        }
    }

    move(direction){
        clearInterval(this.horizontalInterval);

        if(isServer){
            Body.setVelocity(this.body, {x: 10*(10/7)*direction, y: this.body.velocity.y});
        }
        else{
            Body.setVelocity(this.body, {x: 10*direction, y: this.body.velocity.y});
        }
        
        /*

        this.horizontalInterval = setInterval(() =>{
            let currentSpeed=this.body.velocity.x+speedX*direction;
            currentSpeed=Math.abs(currentSpeed)>maxSpeedX ? maxSpeedX*direction : currentSpeed;

            Body.setVelocity(this.body, {x: currentSpeed, y: this.body.velocity.y});
        }, 10);
        */
    }

    stopMoving(){
        //clearInterval(this.horizontalInterval);
        Body.setVelocity(this.body, {x: 0, y: this.body.velocity.y});
    }

    canJump(){
        return (Math.abs(this.body.velocity.y)<=1 && this.touchGround);
    }

    jump(){
        clearInterval(this.jumpInterval);
        if(this.canJump()){
            this.touchGround=false;
            Body.applyForce( this.body, {x: this.body.position.x, y: this.body.position.y}, {x: 0, y: jumpForce});
        }
        
        this.jumpInterval = setInterval(() =>{
            if(this.canJump()){
                this.touchGround=false;
                Body.setVelocity(this.body, {x: this.body.velocity.x, y: 0});
                Body.applyForce( this.body, {x: this.body.position.x, y: this.body.position.y}, {x: 0, y: jumpForce});
            }
        }, 50);
    }

    stopJumping(){
        clearInterval(this.jumpInterval);
    }

    createBody(type="circle", size=40){
        let newBody;

        switch(type){
            case bodyTypeEnum.CIRCLE:
                newBody=Bodies.circle(0, 0, size/2);
                break;
            
            case bodyTypeEnum.SQUARE:
                newBody=Bodies.rectangle(0, 0, size, size);
                break;
            
            default:
                console.log("Unknown body type");
        }

        newBody.friction=0;
        newBody.frictionStatic=0;
        newBody.frictionAir=0;
        newBody.render.fillStyle=this.color;
        
        this.body=newBody;

        this.width=size;
        this.height=size;
        this.type=type;
    }

    serialize(){
        let json=super.serialize();
        json.id=this.id;

        return json;
    }
}

export{
    Player,
    bodyTypeEnum
};

export default Player;