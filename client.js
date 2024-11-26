var socket = io();

socket.on('connect', function () {
    console.log('Connecté au serveur avec l\'ID :', socket.id);
});

window.addEventListener('click', function () {
    console.log('Fenêtre cliquée. Message test au serveur...');
    socket.emit('test', 'Message de test du client');
});