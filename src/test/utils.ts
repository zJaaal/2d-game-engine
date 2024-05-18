import { Vector } from '../game-engine/physics/vector';
import { Ball } from './entities/Ball';
import { Capsule } from './entities/Capsule';

import { Wall } from './entities/Wall';
import { BallSettings, CapsuleSettings } from './entities/types';

export const PADDING = 100;
export const ASPECT_RATIO = 1.7; // 16:9

export const CANVAS_HEIGHT = window.document.body.clientHeight - PADDING;
export const CANVAS_WIDTH = CANVAS_HEIGHT * ASPECT_RATIO;
export const CANVAS_ENTITY_PADDING = 100;

export const RNGSmallOrigin = () =>
    new Vector(Math.random() * CANVAS_ENTITY_PADDING, Math.random() * CANVAS_ENTITY_PADDING);

export const RNGPosition = () =>
    new Vector(
        Math.random() * (CANVAS_WIDTH - CANVAS_ENTITY_PADDING),
        Math.random() * (CANVAS_HEIGHT - CANVAS_ENTITY_PADDING)
    );

export const RNGColor = () =>
    `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
export function genRandomBalls(n: number, ballSettings: BallSettings): Ball[] {
    const balls = [];
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 50 + 20;

        let mass = radius * 0.06;

        let elasticity = Math.random();

        balls.push(
            new Ball({
                ...ballSettings,
                radius,
                mass,
                elasticity,
                position: RNGPosition(),
                id: `ball-${i}`,
                color: RNGColor(),
                strokeColor: RNGColor()
            })
        );
    }
    return balls;
}

export function genRandomWalls(n: number) {
    const walls = [];
    for (let i = 0; i < n; i++) {
        walls.push(
            new Wall({
                start: RNGPosition(),
                position: new Vector(0, 0),
                end: RNGPosition(),
                id: `wall-${i}`,
                color: RNGColor(),
                elasticity: 0,
                angle: 0,
                rotationFactor: 0,
                friction: 0
            })
        );
    }
    return walls;
}

export function genRandomCapsules(n: number, capsuleSettings: CapsuleSettings) {
    const capsules = [];
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 50 + 20;

        let mass = radius * 0.06;

        let elasticity = Math.random();

        capsules.push(
            new Capsule({
                ...capsuleSettings,
                radius,
                mass,
                elasticity,
                position: new Vector(0, 0),
                start: RNGPosition(),
                end: RNGPosition(),
                id: i ? `capsule-${i}` : capsuleSettings.id,
                color: 'transparent',
                strokeColor: 'black'
            })
        );
    }
    return capsules;
}

export function genCanvasWalls(canvasWidth: number, canvasHeight: number) {
    const walls = [];

    const elasticity = 1;
    walls.push(
        new Wall({
            start: new Vector(0, 0),
            position: new Vector(0, 0),
            end: new Vector(canvasWidth, 0),
            id: 'wall-0',
            color: 'black',
            elasticity,
            angle: 0,
            rotationFactor: 0,
            friction: 0
        })
    );
    walls.push(
        new Wall({
            start: new Vector(0, 0),
            position: new Vector(0, 0),
            end: new Vector(0, canvasHeight),
            id: 'wall-1',
            color: 'black',
            elasticity,
            angle: 0,
            rotationFactor: 0,
            friction: 0
        })
    );
    walls.push(
        new Wall({
            start: new Vector(0, canvasHeight),
            position: new Vector(0, 0),
            end: new Vector(canvasWidth, canvasHeight),
            id: 'wall-2',
            color: 'black',
            elasticity,
            angle: 0,
            rotationFactor: 0,
            friction: 0
        })
    );
    walls.push(
        new Wall({
            start: new Vector(canvasWidth, 0),
            position: new Vector(0, 0),
            end: new Vector(canvasWidth, canvasHeight),
            id: 'wall-3',
            color: 'black',
            elasticity,
            angle: 0,
            rotationFactor: 0,
            friction: 0
        })
    );
    return walls;
}
