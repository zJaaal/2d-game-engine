import './style.css';
import { Engine } from './game-engine/engine';
import { Ball, BallSettings } from './test/Ball';
import { genEntityBalls } from './test/utils';
import { CanvasSettings } from './game-engine/engine/types';

const canvasSettings: CanvasSettings = {
    width: 640,
    height: 480,
    styleClass: 'game__canvas',
    id: 'game'
};

const randomString = Math.random().toString(36).substring(7);

const ballSettings: BallSettings = {
    x: 100,
    y: 100,
    speed: {
        x: 0,
        y: 0
    },
    initialAcceleration: {
        x: 0.01,
        y: 0.01
    },
    currentAcceleration: {
        x: 0,
        y: 0
    },
    id: randomString,
    radius: 20,
    color: 'red',
    strokeColor: 'black',
    DEBUG: true
};

const ball = new Ball(ballSettings);

const entityBalls = genEntityBalls(10, 640, 480);

const engine = new Engine({
    canvas: canvasSettings
});

engine.initEngine();
engine.initMainLoop(ball, entityBalls);
