class Party{
    constructor(maxPlayer=3){
        this.sockets=[];
        this.map=null;
        this.maxPlayer=maxPlayer;

        console.log("new party");
    }

    setMap(map){
        this.map=map;
    }

    addPlayer(socket){
        this.sockets.push(socket);

        this.sockets.forEach((socket) => {
            console.log(socket.conn.remoteAddress);
        })
    }

    removePlayer(socket){
        let index = this.sockets.indexOf(socket);
        this.sockets.splice(index, 1);
    }

    containsPlayer(socket){
        return this.sockets.includes(socket);
    }

    isFree(){
        return this.sockets.length<this.maxPlayer;
    }

    isEmpty(){
        return this.sockets.length==0;
    }

    getPlayerNb(){
        return this.sockets.length;
    }

    loadMap(map){

    }
}

module.exports= Party;