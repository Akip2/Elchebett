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