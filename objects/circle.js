import Shape from "./shape.js";
import { Bodies} from "../global.js";

class Circle extends Shape{
    constructor(radius, color, x=0, y=0,){
        const body=Bodies.circle(0, 0, radius, { 
            render: {
              fillStyle : color
            }
        });

        super(body, radius*2, radius*2, x, y);
    }
}

export default Circle;