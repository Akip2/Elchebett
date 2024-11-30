import canvasManager from "./canvas-manager.js";

const rightKey="ArrowRight";
const leftKey="ArrowLeft";
const jumpKey="ArrowUp";

const alreadyPressed=[];

var socket = io();

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

document.addEventListener("keydown", (event) => {
    let keyname=event.key;

    if(keyname==rightKey){ 
        socket.emit('horizontal', 1);
    }
});