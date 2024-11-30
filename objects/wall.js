const Shape = require("./shape.js");
const { Bodies, categoryEnum} = require("../global.js");

class Wall extends Shape{
    constructor(width, height, color, ground=false){
        const body=Bodies.rectangle(0, 0, width, height, { 
            isStatic: true,
            collisionFilter: {
                category: ground ? categoryEnum.GROUND : categoryEnum.DEFAULT,
            },
            render: {
              fillStyle : color
            }
        });

        super(body, width, height);

        this.color=color;
    }

    serialize(){
        return {
            type: "rectangle",
            color: this.color,
            position: this.getPosition(),
            width: this.width,
            height: this.height,
        };
    }
}

module.exports=Wall;