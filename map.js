const Player = require("./objects/player.js");
const Matter = require("matter-js");
const { width, height, positionEnum } = require("./global.js");
const Wall=require("./objects/wall.js");

const Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine = Engine.create();
engine.gravity.y = 2.5;

var players=[];

const ground=new Wall(width, 300, "#404040", true);
ground.placeDefault(positionEnum.DOWN);
var objects=[ground];

var simulation;

const defaultSpawns = [{x:400, y:0}, {x:900, y:0}];

/**
 * Class containing all objects, and runs the matter js environment
 */
class Map {
    constructor(clients, spawnPositions = defaultSpawns) {
        this.spawnPositions = spawnPositions;
        //this.objects = objects;
        this.playerInfos = [];


        this.ids = [];
        clients.forEach((client) => {
            this.ids.push(client.id);
        });
    }

    load() {
        objects.forEach((obj) => {
            obj.addToEnv(engine.world);
        });

        for (let i = 0; i < this.ids.length; i++) {
            let position = this.spawnPositions[i];

            let player = new Player(this.ids[i], "blue", position.x, position.y);

            players.push(player);   

            Composite.add(engine.world, player.body);
        }

        simulation=setInterval(() => {
            Matter.Engine.update(engine, 10);
            this.playerInfos=[];

            players.forEach((player) =>{
                this.playerInfos.push(player.serialize());
            })
        }, 10);
    }

    removePlayer(index) {
        this.playerInfos.splice(index, 1);

        const removedBody = players.splice(index, 1)[0].body;
        Composite.remove(engine.world, removedBody);
    }
}

module.exports = Map;
