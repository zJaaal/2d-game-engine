import './style.css';
import { Engine } from './game-engine/engine';
import { Ball, BallSettings } from './test/Ball';
import {
    penetrationResolution,
    detectCollision,
    genEntityBalls,
    collisionResolution,
    RNGPosition,
    CANVAS_HEIGHT,
    CANVAS_WIDTH
} from './test/utils';
import { CanvasSettings, DebugEntity } from './game-engine/engine/types';
import { Vector } from './game-engine/Vector';

const canvasSettings: CanvasSettings = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    styleClass: 'game__canvas',
    id: 'game'
};

const ballSettings: BallSettings = {
    position: RNGPosition(),
    speed: new Vector(0, 0),
    accelerationFactor: 1,
    elasticity: Math.random(),
    mass: 50 * 0.06,
    acceleration: new Vector(0, 0),
    id: 'MainBall',
    radius: 50,
    color: 'red',
    strokeColor: 'black',
    DEBUG: true,
    friction: 0.1
};

const ball = new Ball(ballSettings);

const entityBalls = genEntityBalls(20, ballSettings);
// const entityBalls: Entity[] = [];

const engine = new Engine({
    canvas: canvasSettings
});

engine.initEngine();

const debugEntity: DebugEntity<Ball> = (ctx, entity, engine, i) => {
    ctx!.fillText(
        `Mass: ${entity.mass.toFixed(2)}\nElasticity: ${entity.elasticity.toFixed(2)}`,
        entity.position.x + entity.radius,
        entity.position.y + entity.radius
    );
};

engine.initMainLoop(
    ball,
    entityBalls,
    detectCollision,
    penetrationResolution,
    collisionResolution,
    debugEntity
);
