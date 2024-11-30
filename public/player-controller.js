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

    createHorizontalOrder(direction){
        return {
            type: "horizontal",
            direction: direction
        }
    }

    createJumpOrder(activate){
        return {
            type: "jump",
            activate: activate
        }
    }

    sendPlayerOrder(order){
        this.socket.emit('player', order);
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

                    this.sendPlayerOrder(this.createHorizontalOrder(direction));
                }
                else if(keyname==jumpKey){
                    this.sendPlayerOrder(this.createJumpOrder(true));
                }
            }
        });

        document.addEventListener("keyup", (event) => {
            let keyname=event.key;
            this.alreadyPressed.splice(this.alreadyPressed.indexOf(keyname), 1);

            if(keyname==this.currentHorizontalKey){
                console.log("stop");
                this.currentHorizontalKey=null;

                this.sendPlayerOrder(this.createHorizontalOrder(0));
            }
            else if(keyname==jumpKey){
                this.sendPlayerOrder(this.createJumpOrder(false));
            }
        });
    }
}

export default PlayerController;