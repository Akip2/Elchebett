import Shape from "./shape.js";
import { Bodies, categoryEnum} from "../global.js";

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

        super(body, width, height, x, y);
    }
}

export default Wall;