import './style.css';
import { Engine } from './game-engine/engine';
import { Ball } from './common-entities/ball';
import {
    genRandomBalls,
    RNGPosition,
    genRandomWalls,
    genRandomCapsules,
    genRandomBoxes,
    genCanvasWalls
} from './common-entities/utils';
import { CanvasSettings } from './game-engine/engine/types';
import { Vector } from './game-engine/physics/vector';

import { Entity } from './game-engine/primitives/entity';
import { BallSettings } from './common-entities/ball/types';
import { CapsuleSettings } from './common-entities/capsule/types';
import { Star } from './common-entities/star';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './common-entities/const';
import { Triangle } from './game-engine/shapes/triangle';

let entities: Entity[] = [];

const canvasSettings: CanvasSettings = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    styleClass: 'game__canvas',
    id: 'game'
};

const sharedSettings = {
    position: RNGPosition(),
    speed: Vector.origin(),
    angleSpeed: 0,
    accelerationFactor: Math.random() * 1 + 0.5,
    elasticity: 2,
    mass: 40 * 0.06,
    acceleration: Vector.origin(),
    friction: 0,
    angle: 0,
    rotationFactor: 0.1,
    DEBUG: true,
    angularFriction: 0.1,
    maxSpeed: 2,
    layer: 1
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
    end: Vector.origin(),
    start: new Vector(1, 1),
    radius: 40,
    color: 'transparent',
    strokeColor: 'black'
};

const boxInitialSettings = {
    ...sharedSettings,
    id: 'Player-Entity',
    firstPoint: Vector.origin(),
    secondPoint: new Vector(1, 1),
    width: 40,
    color: 'transparent',
    strokeColor: 'black'
};
const star = new Star({
    id: 'Player-Entity',
    strokeColor: 'black',
    color: 'transparent',
    elasticity: 1,
    acceleration: Vector.origin(),
    accelerationFactor: Math.random() * 1 + 0.5,
    friction: 0,
    mass: 40 * 0.06,
    rotationFactor: 0.1,
    angle: 0,
    DEBUG: true,
    radius: 20,
    centralPoint: new Vector(500, 500),
    position: Vector.origin(),
    speed: Vector.origin(),
    maxSpeed: 2,
    angularFriction: 0.1,
    layer: 2
});

const mainBall = new Ball(ballInitialSettings);

// entities.push(mainBall);

entities.push(...genCanvasWalls(CANVAS_WIDTH, CANVAS_HEIGHT));

entities.push(...genRandomBalls(4, ballInitialSettings));

// entities.push(...genRandomCapsules(3, capsuleInitialSettings));

entities.push(...genRandomWalls(1));

// entities.push(...genRandomBoxes(2, boxInitialSettings));

entities.push(star);

const engine = new Engine({
    canvas: canvasSettings,
    DEBUG: false
});

engine.gameLogic = (entities: Entity[]) => {
    entities.forEach((entity) => {
        if (entity.id !== star.id) {
            const { penetrationDepth } = engine.collide(entity, star);

            if (isFinite(penetrationDepth)) {
                entity.removeNextFrame(); // this will remove all the walls in this state
            }
        }
    });
};

engine.initEngine().initMainLoop({ entities });
