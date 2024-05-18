import './style.css';
import { Engine } from './game-engine/engine';
import { Ball } from './test/entities/Ball';
import {
    genRandomBalls,
    RNGPosition,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    genRandomWalls,
    genRandomCapsules
} from './test/utils';
import { CanvasSettings, DebugEntity } from './game-engine/engine/types';
import { Vector } from './game-engine/physics/vector';

import { BallSettings, CapsuleSettings } from './test/entities/types';
import { Wall } from './test/entities/Wall';

const canvasSettings: CanvasSettings = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    styleClass: 'game__canvas',
    id: 'game'
};

const sharedSettings = {
    position: RNGPosition(),
    speed: new Vector(0, 0),
    accelerationFactor: 1,
    elasticity: 1,
    mass: 40 * 0.06,
    acceleration: new Vector(0, 0),
    friction: 0.1,
    angle: 0,
    rotationFactor: 0.1
};

const ballInitialSettings: BallSettings = {
    ...sharedSettings,
    id: 'MainBall',
    radius: 40,
    color: 'transparent',
    strokeColor: 'black',
    DEBUG: true
};

const capsuleInitialSettings: CapsuleSettings = {
    ...sharedSettings,
    id: 'MainCapsule',
    endPosition: new Vector(100, 100),
    radius: 40,
    color: 'transparent',
    strokeColor: 'black'
};

const ball = new Ball(ballInitialSettings);

// const balls = genRandomBalls(20, ballInitialSettings);
const balls: Ball[] = [];

const capsules = genRandomCapsules(5, capsuleInitialSettings);

// const walls = genRandomWalls(5);
const walls: Wall[] = [];

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

engine.initMainLoop(ball, balls, walls, capsules, debugEntity);
