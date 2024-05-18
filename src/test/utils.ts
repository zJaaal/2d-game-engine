import { Vector } from '../game-engine/physics/Vector';
import { Matrix } from '../game-engine/physics/matrix';
import { Ball } from './entities/Ball';

import { Wall } from './entities/Wall';
import { BallSettings } from './entities/types';

export const PADDING = 100;
export const ASPECT_RATIO = 1.7; // 16:9

export const CANVAS_HEIGHT = window.document.body.clientHeight - PADDING;
export const CANVAS_WIDTH = CANVAS_HEIGHT * ASPECT_RATIO;
export const CANVAS_ENTITY_PADDING = 100;

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
                position: RNGPosition(),
                endPosition: RNGPosition(),
                id: `wall-${i}`,
                color: RNGColor(),
                elasticity: 0,
                angle: 0,
                rotationFactor: Math.random() * 0.3,
                friction: Math.random() * 0.3
            })
        );
    }
    return walls;
}

export function closestPointFromBallToWall(ball: Ball, wall: Wall) {
    let ballToWallStart = wall.position.subtract(ball.position);

    if (Vector.dot(wall.wallUnit(), ballToWallStart) > 0) {
        return wall.position;
    }

    let wallEndToBall = ball.position.subtract(wall.endPosition);

    if (Vector.dot(wall.wallUnit(), wallEndToBall) > 0) {
        return wall.endPosition;
    }

    let closestDistanceToWall = Vector.dot(wall.wallUnit(), ballToWallStart);
    let closestVector = wall.wallUnit().multiply(closestDistanceToWall);

    return wall.position.subtract(closestVector);
}

export function detectCollisionWithWall(ball: Ball, wall: Wall) {
    let closestPoint = closestPointFromBallToWall(ball, wall).subtract(ball.position);

    return closestPoint.magnitude() <= ball.radius;
}

export function penetrationResolutionWithWall(ball: Ball, wall: Wall) {
    let penetrationVector = ball.position.subtract(closestPointFromBallToWall(ball, wall));

    let collisionDepth = ball.radius - penetrationVector.magnitude();

    let penetrationResolution = penetrationVector.unit().multiply(collisionDepth);

    ball.position = ball.position.add(penetrationResolution);
}

export function collisionResolutionWithWall(ball: Ball, wall: Wall) {
    let normal = ball.position.subtract(closestPointFromBallToWall(ball, wall)).unit();

    let separatingVelocity = Vector.dot(ball.speed, normal);

    let newSeparatingVelocity = -separatingVelocity * ball.elasticity;

    let separatingVelocityDiff = separatingVelocity - newSeparatingVelocity;

    ball.speed = ball.speed.add(normal.multiply(-separatingVelocityDiff));
}

export function detectCollision(b1: Ball, b2: Ball) {
    // The distance between the two balls is less than the sum of their radius
    return b1.radius + b2.radius > b1.position.subtract(b2.position).magnitude();
}

export function penetrationResolution(b1: Ball, b2: Ball) {
    let distanceBetween = b1.position.subtract(b2.position);

    // The depth of the collision is the sum of the radius minus the distance between the two balls
    let collisionDepth = b1.radius + b2.radius - distanceBetween.magnitude();

    // The collision resolution is the unit vector of the distance between the two balls multiplied by half the collision depth
    let penetrationResolution = distanceBetween
        .unit()
        .multiply(collisionDepth / (b1.inverseMass + b2.inverseMass));

    // Move the balls apart by the collision resolution
    b1.position = b1.position.add(penetrationResolution.multiply(b1.inverseMass));
    b2.position = b2.position.add(penetrationResolution.multiply(-b2.inverseMass));
}

// I need to understand this better, I remember a bit about this from my physics classes
export function collisionResolution(b1: Ball, b2: Ball) {
    let normal = b1.position.subtract(b2.position).unit();
    let relativeVelocity = b1.speed.subtract(b2.speed);
    let separatingVelocity = Vector.dot(relativeVelocity, normal);

    let newSeparatingVelocity = -separatingVelocity * Math.min(b1.elasticity, b2.elasticity);

    let separatingVelocityDiff = newSeparatingVelocity - separatingVelocity;

    let impulse = separatingVelocityDiff / (b1.inverseMass + b2.inverseMass);

    let impulseVector = normal.multiply(impulse);

    b1.speed = b1.speed.add(impulseVector.multiply(b1.inverseMass));
    b2.speed = b2.speed.add(impulseVector.multiply(-b2.inverseMass));
}

export function createRotationMatrix(angle: number) {
    let matrix = new Matrix(2, 2);

    matrix.data[0][0] = Math.cos(angle);
    matrix.data[0][1] = -Math.sin(angle);
    matrix.data[1][0] = Math.sin(angle);
    matrix.data[1][1] = Math.cos(angle);

    return matrix;
}
