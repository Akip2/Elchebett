import Shape from "./objects/shape.js";
import { Body, Bodies, categoryEnum } from "./global.js";

const maxSpeedX=8;
const speedX=0.075;
const jumpForce=-0.05;

class Player extends Shape{
    constructor(color){
        let size=20;

        const body=Bodies.circle(0, 0, size, { 
            friction: 0,         
            frictionStatic: 0,   
            frictionAir: 0.015,

            collisionFilter: {
                category: categoryEnum.PLAYER,
            },

            render: {
              fillStyle : color
            }
        });

        super(body, size*2, size*2);
        this.touchGround=false;
    }

    move(direction){
        let currentSpeed=this.body.velocity.x+speedX*direction;
        currentSpeed=Math.abs(currentSpeed)>maxSpeedX ? maxSpeedX*direction : currentSpeed;

        Body.setVelocity(this.body, {x: currentSpeed, y: this.body.velocity.y});
    }

    jump(){
        let canJump=(Math.abs(this.body.velocity.y)<=1 && this.touchGround);
        this.touchGround=false;

        console.log(this.touchGround);

        if(canJump){
            Body.setVelocity(this.body, {x: this.body.velocity.x, y: 0});
            Body.applyForce( this.body, {x: this.body.position.x, y: this.body.position.y}, {x: 0, y: jumpForce});
        }

        return canJump;
    }
}

export default Player;