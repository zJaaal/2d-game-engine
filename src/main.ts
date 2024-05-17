import './style.css';
import { Engine } from './game-engine/engine';
import { Ball, BallSettings } from './test/Ball';
import { genEntityBalls } from './test/utils';
import { CanvasSettings, MainLoop } from './game-engine/engine/types';
import { Vector } from './game-engine/Vector';
import { Entity } from './game-engine/Entity';

const PADDING = 100;
const ASPECT_RATIO = 1.7; // 16:9

const canvasHeight = window.document.body.clientHeight - PADDING;
const canvasWidth = canvasHeight * ASPECT_RATIO;

const canvasSettings: CanvasSettings = {
    width: canvasWidth,
    height: canvasHeight,
    styleClass: 'game__canvas',
    id: 'game'
};

const randomString = Math.random().toString(36).substring(7);

const ballSettings: BallSettings = {
    x: 100,
    y: 100,
    speed: new Vector(0, 0),
    accelerationFactor: 1,
    acceleration: new Vector(0, 0),
    id: randomString,
    radius: 20,
    color: 'red',
    strokeColor: 'black',
    DEBUG: true,
    friction: 0.1
};

const ball = new Ball(ballSettings);

// const entityBalls = genEntityBalls(10, canvasWidth, canvasHeight);
const entityBalls: Entity[] = [];

const engine = new Engine({
    canvas: canvasSettings
});

engine.initEngine();

const mainLoop: MainLoop = (ctx, pressedKeys) => {
    ctx?.clearRect(0, 0, canvasSettings.width, canvasSettings.height);

    ball.drawPlayer(ctx as CanvasRenderingContext2D);

    entityBalls.forEach((entity) => {
        entity.drawEntity(ctx as CanvasRenderingContext2D);
    });

    ball.handleControls(pressedKeys);
};

engine.initMainLoop(mainLoop);
