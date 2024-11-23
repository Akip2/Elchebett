const rightKey="ArrowRight";
const leftKey="ArrowLeft";
const jumpKey="ArrowUp";

class Keyboard{
    constructor(player){
        this.player=player;
        this.keypressed=[];
        this.horizontalInterval;
        this.jumpInterval;

        this.currentHorizontalKey=null;
    }

    addEvents(){
        document.addEventListener("keydown", (event) => {
            let keyname=event.key;
            if(!this.keypressed.includes(keyname)){ //Not already pressed
                this.keypressed.push(keyname);

                if(keyname==rightKey || keyname==leftKey){ //Left or right
                    clearInterval(this.horizontalInterval);
                    this.currentHorizontalKey=keyname;

                    let direction=keyname==rightKey ? 1 : -1;
                    this.horizontalInterval = setInterval(() =>this.player.move(direction), 10);
                }
                else if(keyname==jumpKey){ //Jump
                    this.jump();
                }
            }
        });

        document.addEventListener("keyup", (event) => {
            let keyname=event.key;

            this.keypressed.splice(this.keypressed.indexOf(keyname), 1);

            if(keyname==this.currentHorizontalKey){
                this.currentHorizontalKey=null;
                clearInterval(this.horizontalInterval);
            }
            else if(keyname==jumpKey){
                clearInterval(this.jumpInterval);
            }
        });
    }

    jump(){
        this.player.jump();
        this.jumpInterval=setInterval(() =>{
            this.player.jump();
        }, 50);
    }
}

export default Keyboard;