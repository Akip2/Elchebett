const isServer=typeof window === "undefined";

var Shape = require("./shape.js");
var { Bodies, categoryEnum} = require("../global.js");

class Wall extends Shape{
    constructor(width, height, color, isGround=false, x=0, y=0){
        const body=Bodies.rectangle(x, y, width, height, { 
            isStatic: true,
            collisionFilter: {
                category: isGround ? categoryEnum.GROUND : categoryEnum.DEFAULT,
            },
            render: {
              fillStyle : color
            }
        });

        super(body, width, height, color);
        this.type="wall";
    }
}

if(isServer){
    module.exports=Wall;
}
else{
    window.wall=Wall;
}
