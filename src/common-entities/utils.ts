import { Vector } from '../game-engine/physics/vector';
import { Ball } from './ball';
import { BallSettings } from './ball/types';
import { Box } from './box';
import { BoxSettings } from './box/types';
import { Capsule } from './capsule';
import { CapsuleSettings } from './capsule/types';
import { CANVAS_ENTITY_PADDING, CANVAS_HEIGHT, CANVAS_WIDTH } from './const';

import { Wall } from './wall';

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

        balls.push(
            new Ball({
                ...ballSettings,
                radius,
                mass,
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
                position: Vector.origin(),
                end: RNGPosition(),
                id: `wall-${i}`,
                elasticity: 1,
                strokeColor: RNGColor(),
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

        let start = RNGPosition();

        let end = start.multiply(Math.random() * 2 + 1);

        capsules.push(
            new Capsule({
                ...capsuleSettings,
                radius,
                mass,
                position: Vector.origin(),
                start,
                end,
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
            start: Vector.origin(),
            position: Vector.origin(),
            end: new Vector(canvasWidth, 0),
            id: 'wall-0',
            strokeColor: 'black',
            elasticity,
            angle: 0,
            rotationFactor: 0,
            friction: 0
        })
    );
    walls.push(
        new Wall({
            start: Vector.origin(),
            position: Vector.origin(),
            end: new Vector(0, canvasHeight),
            id: 'wall-1',
            strokeColor: 'black',
            elasticity,
            angle: 0,
            rotationFactor: 0,
            friction: 0
        })
    );
    walls.push(
        new Wall({
            start: new Vector(0, canvasHeight),
            position: Vector.origin(),
            end: new Vector(canvasWidth, canvasHeight),
            id: 'wall-2',
            strokeColor: 'black',
            elasticity,
            angle: 0,
            rotationFactor: 0,
            friction: 0
        })
    );
    walls.push(
        new Wall({
            start: new Vector(canvasWidth, 0),
            position: Vector.origin(),
            end: new Vector(canvasWidth, canvasHeight),
            id: 'wall-3',
            strokeColor: 'black',
            elasticity,
            angle: 0,
            rotationFactor: 0,
            friction: 0
        })
    );
    return walls;
}

export function genRandomBoxes(n: number, boxSettings: BoxSettings) {
    const boxes = [];
    for (let i = 0; i < n; i++) {
        let width = Math.random() * 100 + 20;

        let mass = width * 0.06;

        let firstPoint = RNGPosition();

        let secondPoint = firstPoint.multiply(Math.random() * 2 + 1);

        boxes.push(
            new Box({
                ...boxSettings,
                width,
                mass,
                firstPoint,
                secondPoint,
                id: i ? `box-${i}` : boxSettings.id,
                color: RNGColor(),
                strokeColor: RNGColor()
            })
        );
    }
    return boxes;
}
