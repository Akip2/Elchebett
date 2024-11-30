const Shape = require("./shape.js");
const { Bodies} = require("../global.js");

class Circle extends Shape{
    constructor(radius, color){
        const body=Bodies.circle(0, 0, radius, { 
            render: {
              fillStyle : color
            }
        });

        super(body, radius*2, radius*2);
    }
}

export default Circle;