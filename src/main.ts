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
    genCanvasWalls,
    genRandomBoxes
} from './test/utils';
import { CanvasSettings, DebugEntity } from './game-engine/engine/types';
import { Vector } from './game-engine/physics/vector';

import { BallSettings, CapsuleSettings } from './test/entities/types';

import { Capsule } from './test/entities/Capsule';

import { Entity } from './game-engine/entity';

let capsules: Capsule[] = [];

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

const debugEntity: DebugEntity = (ctx, entity, engine, i) => {
    ctx!.fillText(
        `Mass: ${entity.mass.toFixed(2)}\nElasticity: ${entity.elasticity.toFixed(2)}`,
        entity.position.x + entity.radius,
        entity.position.y + entity.radius
    );
};

engine.initMainLoop({ entities, capsules, debugEntity });
