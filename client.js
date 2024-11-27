var socket = io();

socket.on('connect', function () {
    console.log('Connecté au serveur avec l\'ID :', socket.id);
});