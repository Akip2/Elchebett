const Party=require("./party.js");

class PartyManager{
    constructor(){
        this.parties=[];
    }

    addPlayer(socket){
        let freeParty=this.getFreeParty();
        freeParty.addPlayer(socket);
    }

    removePlayer(socket){
        let playerFound=false;
        let i=0;
        
        while(!playerFound && i<this.parties.length){
            let party=this.parties[i];
            if(party.containsPlayer(socket)){
                playerFound=true;
                party.removePlayer(socket);

                if(party.isEmpty()){
                    this.parties.splice(i,1);
                }
            }
            i++;
        }
    }

    getFreeParty(){
        let freeParty=null;

        this.parties.forEach((party) => {
            if(party.isFree() && (freeParty==null || party.getPlayerNb()<freeParty.getPlayerNb())){
                freeParty=party;
            }
        });

        if(freeParty==null){ //no party available, we create a new one
            freeParty=new Party();
            this.parties.push(freeParty);
        }

        return freeParty;
    }
}

module.exports=PartyManager;