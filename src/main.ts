import './style.css';
import { Engine } from './game-engine/engine';
import { Ball, BallSettings } from './test/Ball';
import {
    genEntityBalls,
    RNGPosition,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    genRandomWalls
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
    elasticity: 1,
    mass: 40 * 0.06,
    acceleration: new Vector(0, 0),
    id: 'MainBall',
    radius: 40,
    color: 'transparent',
    strokeColor: 'black',
    DEBUG: true,
    friction: 0.1
};

const ball = new Ball(ballSettings);

const entities = genEntityBalls(20, ballSettings);
// const entities: Ball[] = [];

const walls = genRandomWalls(4);

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

engine.initMainLoop(ball, entities, walls, debugEntity);
