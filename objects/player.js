const Shape =require("./shape.js");
const { Body, Bodies, categoryEnum } = require("../global.js");

const maxSpeedX=8;
const speedX=0.25;
const jumpForce=-0.12;

class Player extends Shape{

    constructor(id, color, x=0, y=0){
        let size=20;

        const body=Bodies.circle(x, y, size, { 
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

        super(body, size*2, size*2, color);
        this.touchGround=false;
        this.id=id;
        this.type="player";

        this.horizontalInterval=null;
        this.jumpInterval=null;
    }

    move(direction){
        clearInterval(this.horizontalInterval);

        this.horizontalInterval = setInterval(() =>{
            let currentSpeed=this.body.velocity.x+speedX*direction;
            currentSpeed=Math.abs(currentSpeed)>maxSpeedX ? maxSpeedX*direction : currentSpeed;

            Body.setVelocity(this.body, {x: currentSpeed, y: this.body.velocity.y});
        }, 10);
    }

    stopMoving(){
        clearInterval(this.horizontalInterval);
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

    serialize(){
        let json=super.serialize();
        json.id=this.id;

        return json;
    }
}

module.exports=Player;