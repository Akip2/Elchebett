class CanvasManager{
    constructor(canvas){
        this.height=canvas.height;
        this.width=canvas.width;

        this.ctx=canvas.getContext("2d");
    }

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    setBackground(color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawPlayer(player, self=false){
        this.ctx.fillStyle=self ? "red" : player.color;

        this.ctx.beginPath();
        this.ctx.arc(player.position.x, player.position.y, player.radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }

    drawObject(obj){
        switch(obj.type){
            case "rectangle":
                this.drawRectangle(obj);
                break;

            default:
                console.log("Unknown object type");
        }
    }

    drawRectangle(rec){
        this.ctx.fillStyle = rec.color;
        this.ctx.fillRect(rec.position.x-rec.width/2, rec.position.y-rec.height/2, rec.width, rec.height);
    }
}

function createCanvas(){
    let canvasContainer=document.getElementById("canvas-container");

    let canvas = document.createElement('canvas');
    canvas.id     = "game";
    canvas.width  = 1920;
    canvas.height = 1080;

    canvasContainer.append(canvas);
    return canvas;
}


const canvasManager=new CanvasManager(createCanvas());

export default canvasManager;