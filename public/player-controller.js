const rightKey="ArrowRight";
const leftKey="ArrowLeft";
const jumpKey="ArrowUp";

class PlayerController{
    constructor(socket){
        this.currentHorizontalKey=null;
        this.socket=socket;
        this.alreadyPressed=[];

        this.addEvents();
    }

    addEvents(){
        document.addEventListener("keydown", (event) => {
            let keyname=event.key;

            if(!this.alreadyPressed.includes(keyname)){
                this.alreadyPressed.push(keyname);

                if(keyname==rightKey || keyname==leftKey){ 
                    this.currentHorizontalKey=keyname;
                    
                    let direction;
                    if(keyname==rightKey){
                        direction=1;
                    }
                    else{
                        direction=-1;
                    }

                    this.socket.emit('horizontal', direction);
                }
            }
        });

        document.addEventListener("keyup", (event) => {
            let keyname=event.key;
            this.alreadyPressed.splice(this.alreadyPressed.indexOf(keyname), 1);

            if(keyname==this.currentHorizontalKey){
                console.log("stop");
                this.currentHorizontalKey=null;
                this.socket.emit('horizontal', 0);

            }
        });
    }
}

export default PlayerController;