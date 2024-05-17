import './style.css';
import { Engine } from './game-engine/engine';
import { Ball, BallSettings } from './test/Ball';
import { genEntityBalls } from './test/utils';
import { CanvasSettings } from './game-engine/engine/types';
import { Vector } from './game-engine/Vector';

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
    accelerationFactor: 0.8,
    acceleration: new Vector(0, 0),
    id: randomString,
    radius: 20,
    color: 'red',
    strokeColor: 'black',
    DEBUG: true,
    friction: 0.1
};

const ball = new Ball(ballSettings);

const entityBalls = genEntityBalls(10, canvasWidth, canvasHeight);

const engine = new Engine({
    canvas: canvasSettings
});

engine.initEngine();
engine.initMainLoop(ball, entityBalls);
