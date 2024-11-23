import Shape from "./objects/shape.js";
import { Body, Bodies, categoryEnum } from "./global.js";

const speedX=4;
const jumpForce=-0.05;

class Player extends Shape{
    constructor(color){
        let size=20;

        const body=Bodies.circle(0, 0, size, { 
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
        Body.setVelocity(this.body, {x: speedX*direction, y: this.body.velocity.y});
    }

    jump(){
        let canJump=(Math.abs(this.body.velocity.y)<=0.1 && this.touchGround);
        console.log(this.touchGround);

        if(canJump){
            Body.setVelocity(this.body, {x: this.body.velocity.x, y: 0});
            Body.applyForce( this.body, {x: this.body.position.x, y: this.body.position.y}, {x: 0, y: jumpForce});
        }

        return canJump;
    }
}

export default Player;