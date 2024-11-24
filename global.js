const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    World=Matter.World,
    Body=Matter.Body;


const width=1280;
const height=720;

const positionEnum = Object.freeze({
    CENTER: [0,0],

    LEFT: [-1, 0],
    RIGHT: [1, 0],

    UP: [0, -1],
    DOWN: [0, 1],

    LEFT_UP: [-1, -1],
    LEFT_DOWN: [-1, 1],

    RIGHT_UP: [1, -1],
    RIGHT_DOWN: [1, 1]
});

const categoryEnum=Object.freeze({
    DEFAULT: 0x0001,
    PLAYER: 0x0002,
    GROUND: 0x0004
});

export{
    Engine,
    Render,
    Runner,
    Bodies,
    World,
    Composite,
    Body,
    width,
    height,
    positionEnum,
    categoryEnum
}