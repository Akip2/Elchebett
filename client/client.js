import PlayerController from "./player-controller.js";
import GameManager from "./game-manager.js";

var engine, runner, render;

const canvasContainer=document.getElementById("canvas-container");
console.log(typeof window);

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
        //staticObjects=staticDatas.objects;
    });

    /*
    socket.on('update', function(map) {
        canvasManager.clear();
        canvasManager.setBackground(backgroundColor);

        staticObjects.forEach((obj) =>{
            canvasManager.drawObject(obj);
        });

        map.objects.forEach((obj) =>{
            canvasManager.drawObject(obj);
        });

        map.players.forEach((player) =>{
            canvasManager.drawPlayer(player, player.id==id);
        });
    });
    */
});