const Shape = require("./shape.js");
const { Bodies} = require("../global.js");

class Circle extends Shape{
    constructor(radius, color, x=0, y=0,){
        const body=Bodies.circle(x, y, radius, { 
            render: {
              fillStyle : color
            }
        });

        super(body, radius*2, radius*2,color);
    }
}

module.exports=Circle;