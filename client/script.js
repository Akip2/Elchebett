import { initializeModel } from "./model.js";
import { Elevator } from "./elevator.js";
import { Engine, Render,Runner,Bodies,Composite, World} from "./physics.js";
import { width, height, stageSize, stageSpacing, elevatorHeight, elevatorWidth, getParameters, gravity, maxSpeed, minSpeed } from "./parameters.js";

let objects=[];
let elevator;
let engine, runner, render;

const canvasContainer=document.querySelector("#canvas-container");
const btnContainer=document.querySelector("#btn-container");


function createSimulation(){
  getParameters();

  engine=Engine.create(); 
  engine.gravity.y=gravity;

  runner= Runner.create(); 
  render = Render.create({
    element: canvasContainer,
    engine: engine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: "green"
    }
  });

  createWalls(elevatorWidth);
  
  let stagesPos=createStages(elevatorWidth, elevatorHeight, stageSize, stageSpacing);
  let elevatorObj=createElevator(elevatorWidth, elevatorHeight);

  Composite.add(engine.world, objects);


  initializeModel(elevatorObj, stagesPos);


  Render.run(render);
  Runner.run(runner, engine);


  elevator=new Elevator(elevatorObj, minSpeed, maxSpeed);

  btnContainer.innerHTML="";
  for(let i=0; i<stagesPos.length; i++){
    btnContainer.innerHTML=`<button>${i}</button>`+btnContainer.innerHTML;
  }
}

function createWalls(elevatorWidth){
  const wallSize=width/2-elevatorWidth;

  const wall1 = Bodies.rectangle(wallSize/2, height/2, wallSize, height, { 
    isStatic: true,
    render: {
      fillStyle : "black"
    }
  });
  
  const wall2 = Bodies.rectangle(width-wallSize/2, height/2, wallSize, height, {
    isStatic: true,
    render: {
      fillStyle : "black"
    }
  });

  objects.push(wall1);
  objects.push(wall2);
}

function createStages(elevatorW, elevatorH, stageHeight, spacing){
  let stagePositions=[]

  let currentHeight=height-stageHeight;
  const ground = Bodies.rectangle(width / 2, currentHeight+stageHeight/2, width, stageHeight, {
    isStatic: true,
    render: {
      fillStyle: "black"
    }
  });
  objects.push(ground);

  let nextHeight=currentHeight-spacing-stageHeight;

  stagePositions.push(currentHeight);

  while(nextHeight-elevatorH>=0){
    currentHeight=nextHeight;
    stagePositions.push(currentHeight);

    const left=Bodies.rectangle(width/2-(elevatorW)-1.5, currentHeight+stageHeight/2, elevatorW, stageHeight, {
      isStatic: true,
      render: {
        fillStyle: 'black',
      }
    });

    const right=Bodies.rectangle((width/2)+elevatorW+1.5, currentHeight+stageHeight/2, elevatorW, stageHeight, {
      isStatic: true,
      render: {
        fillStyle: 'black',
      }
    });

    objects.push(left);
    objects.push(right);

    Composite.add(engine.world, right);

    nextHeight=currentHeight-spacing-stageHeight;
  }

  return stagePositions;
}

function createElevator(elevatorWidth, elevatorHeight){
  const elevator=Bodies.rectangle(width/2, height-elevatorHeight/2-stageSize, elevatorWidth, elevatorHeight, {
    render: {
      fillStyle: 'darkblue',
    }
  });
  objects.push(elevator);

  return elevator;
}

function clearSimulation() {  
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

let reloadBtn=document.querySelector("#reload-btn");
reloadBtn.addEventListener("click", ()=>{
  clearSimulation();
  createSimulation();
});

createSimulation()

btnContainer.addEventListener("click", (event)=>{
  let stageNumber=event.target.innerText;

  if(elevator.currentStage!=stageNumber && !elevator.isMoving){
    elevator.goToStage(stageNumber);
  }
})