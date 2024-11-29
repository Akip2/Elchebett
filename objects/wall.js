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
    }
}

module.exports=Wall;