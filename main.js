import { Engine, Render,Runner,Bodies,Composite, World, width, height, positionEnum, categoryEnum} from "./global.js";
import Wall from "./objects/wall.js";
import Player from "./player.js";
import Keyboard from "./keyboard.js";

let engine, runner, render;
let objects=[];

const players=[];

const canvasContainer=document.getElementById("canvas-container");

function setup(){
  engine=Engine.create(); 
  engine.gravity.y=1.25;

  runner= Runner.create(); 
  render = Render.create({
    element: canvasContainer,
    engine: engine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: "#4A919E"
    }
  });

  const ground=new Wall(width, 300, "green", true);
  ground.placeDefault(positionEnum.DOWN);
  objects.push(ground);

  let player=new Player("blue");
  player.placeDefault(positionEnum.CENTER);

  let keyboard = new Keyboard(player);
  keyboard.addEvents();

  objects.push(player);
  players.push(player)
  
  addObjectsToEnv();
  addCollisionEvents();

  Render.run(render);
  Runner.run(runner, engine);
}

function addObjectsToEnv(){
  objects.forEach(obj => {
    obj.addToEnv(engine.world);
  });
}

function addCollisionEvents(){
  Matter.Events.on(engine, 'collisionStart', function(event) {
    event.pairs.forEach(pair => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      players.forEach(player => {
        if (bodyA === player.body || bodyB === player.body) {
          const otherBody = (bodyA === player.body) ? bodyB : bodyA;

          if (otherBody.collisionFilter.category === categoryEnum.GROUND) {
            player.touchGround = true;
          }
        }
      });
    });
  });

  Matter.Events.on(engine, 'collisionEnd', function(event) {
    event.pairs.forEach(pair => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      players.forEach(player => {
        if (bodyA === player.body || bodyB === player.body) {
          const otherBody = (bodyA === player.body) ? bodyB : bodyA;

          if (otherBody.collisionFilter.category === categoryEnum.GROUND) {
            player.touchGround = false;
          }
        }
      });
    });
  });
}

function clearEnv() {  
  objects = [];

  World.clear(engine.world);
  Engine.clear(engine);
  Render.stop(render);
  Runner.stop(runner);
  render.canvas.remove();
  render.canvas = null;
  render.context = null;
  render.textures = {};

  Composite.clear(engine.world, false);
}

setup();