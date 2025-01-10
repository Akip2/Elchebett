import PlayerController from "./player-controller.js";
import GameManager from "./game-manager.js";

const canvasContainer=document.getElementById("canvas-container");

function createCanvas(){
    let canvasContainer=document.getElementById("canvas-container");

    let canvas = document.createElement('canvas');
    canvas.id     = "game";
    canvas.width  = 1920;
    canvas.height = 1080;

    canvasContainer.append(canvas);
    return canvas;
}

createCanvas();

var socket = io();

const controller=new PlayerController(socket);
const gameManager=new GameManager(canvasContainer);

socket.on('connect', function () {
    console.log('Connecté au serveur avec l\'ID :', socket.id);

    const id=socket.id;

    socket.on("load", function(json){
        gameManager.load(json);
    });

    socket.on("player", function(order){
        gameManager.sendPlayerOrder(order);
    });

    socket.on("heartbeat", function(date){
        socket.emit("callback", date);
    });

    socket.on("synchro", function(json){
        gameManager.synchronize(json);
    });
});