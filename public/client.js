var socket = io();

socket.on('connect', function () {
    console.log('Connecté au serveur avec l\'ID :', socket.id);

    /*
    socket.on('update', function(val) {
        console.log('Updating environment');
    });
    */

    socket.on('loadMap', function(map) {
        console.log(map);
    });
});