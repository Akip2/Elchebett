import canvasManager from "./canvas-manager.js";

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
    });
});