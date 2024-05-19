import './style.css';
import { Engine } from './game-engine/engine';
import { Ball } from './test/entities/Ball';
import {
    genRandomBalls,
    RNGPosition,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    genRandomWalls,
    genRandomCapsules,
    genRandomBoxes
} from './test/utils';
import { CanvasSettings } from './game-engine/engine/types';
import { Vector } from './game-engine/physics/vector';

import { BallSettings, CapsuleSettings } from './test/entities/types';

import { Entity } from './game-engine/entity';

let entities: Entity[] = [];

const canvasSettings: CanvasSettings = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    styleClass: 'game__canvas',
    id: 'game'
};

const sharedSettings = {
    position: RNGPosition(),
    speed: new Vector(0, 0),
    accelerationFactor: Math.random() * 1 + 0.5,
    elasticity: 1,
    mass: 40 * 0.06,
    acceleration: new Vector(0, 0),
    friction: Math.random() * 0.5,
    angle: 0,
    rotationFactor: 0.1,
    DEBUG: true
};

const ballInitialSettings: BallSettings = {
    ...sharedSettings,
    id: 'Player-Entity',
    radius: 40,
    color: 'transparent',
    strokeColor: 'black'
};

const capsuleInitialSettings: CapsuleSettings = {
    ...sharedSettings,
    id: 'Player-Entity',
    end: new Vector(0, 0),
    start: new Vector(1, 1),
    radius: 40,
    color: 'transparent',
    strokeColor: 'black'
};

const boxInitialSettings = {
    ...sharedSettings,
    id: 'Player-Entity',
    firstPoint: new Vector(0, 0),
    secondPoint: new Vector(1, 1),
    width: 40,
    friction: 0.6,
    color: 'transparent',
    strokeColor: 'black'
};

const mainBall = new Ball(ballInitialSettings);

entities.push(mainBall);

entities.push(...genRandomBalls(4, ballInitialSettings));

entities.push(...genRandomCapsules(1, capsuleInitialSettings));

entities.push(...genRandomWalls(1));

entities.push(...genRandomBoxes(1, boxInitialSettings));

const engine = new Engine({
    canvas: canvasSettings,
    DEBUG: false
});

engine.initEngine();

engine.initMainLoop({ entities });
