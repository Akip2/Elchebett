import CanvasManager from "./canvas-manager.js";
import PlayerController from "./player-controller.js";

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

var socket = io();

const controller=new PlayerController(socket);

socket.on('connect', function () {
    console.log('Connecté au serveur avec l\'ID :', socket.id);

    const id=socket.id;


    socket.on('update', function(map) {
        canvasManager.clear();
        canvasManager.setBackground("#4A919E");

        map.playerInfos.forEach((player) =>{
            canvasManager.drawPlayer(player, player.id==id);
        })

        map.objectInfos.forEach((obj) =>{
            canvasManager.drawObject(obj);
        })
    });
});