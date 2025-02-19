import Shape from "./shape.js";
import { Bodies} from "../global.js";

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

export default Circle;