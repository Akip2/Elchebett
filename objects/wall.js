const Shape = require("./shape.js");
const { Bodies, categoryEnum} = require("../global.js");

class Wall extends Shape{
    constructor(width, height, color, ground=false, x=0, y=0){
        const body=Bodies.rectangle(0, 0, width, height, { 
            isStatic: true,
            collisionFilter: {
                category: ground ? categoryEnum.GROUND : categoryEnum.DEFAULT,
            },
            render: {
              fillStyle : color
            }
        });

<<<<<<< HEAD
        super(body, width, height, x, y);
=======
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
>>>>>>> d2f8e7c2b2ff7d6d24a3790c34fc0ba1d1602aeb
    }
}

module.exports=Wall;