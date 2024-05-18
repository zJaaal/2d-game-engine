import { Vector } from '../../game-engine/physics/vector';
import { Entity } from '../../game-engine/entity';

import { createRotationMatrix } from '../utils';
import { WallSettings } from './types';
import { Ball } from './Ball';

export class Wall extends Entity {
    start: Vector;
    end: Vector;
    color: string;
    center: Vector;
    length: number;
    refEnd: Vector;
    refStart: Vector;
    refUnit: Vector;

    constructor({
        position,
        end,
        id,
        color,
        elasticity,
        angle,
        rotationFactor,
        friction,
        start
    }: WallSettings) {
        super({
            position: position ?? new Vector(0, 0),
            elasticity: elasticity ?? 1,
            speed: new Vector(0, 0),
            acceleration: new Vector(0, 0),
            accelerationFactor: 1,
            friction: friction ?? 0,
            mass: 0,
            id: 'Wall-' + id,
            rotationFactor: rotationFactor ?? 0,
            angle: angle ?? 0
        });

        this.end = end;
        this.start = start;
        this.color = color;

        this.refStart = new Vector(this.start.x, this.start.y);
        this.refEnd = new Vector(this.end.x, this.end.y);

        this.center = this.start.add(this.end).multiply(0.5);
        this.length = this.end.subtract(this.start).magnitude();
        this.refUnit = this.end.subtract(this.start).unit();
    }

    drawEntity(ctx: CanvasRenderingContext2D): void {
        let rotationMatrix = createRotationMatrix(this.angle);
        let newDirection = rotationMatrix.multiplyVector(this.refUnit);

        this.start = this.center.subtract(newDirection.multiply(this.length / 2));
        this.end = this.center.add(newDirection.multiply(this.length / 2));

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
        ctx.closePath();
    }

    wallUnit() {
        return this.end.subtract(this.start).unit();
    }
}

export function closestPointFromBallToWall(ball: Ball, wall: Wall) {
    let ballToWallStart = wall.start.subtract(ball.position);

    if (Vector.dot(wall.wallUnit(), ballToWallStart) > 0) {
        return wall.start;
    }

    let wallEndToBall = ball.position.subtract(wall.end);

    if (Vector.dot(wall.wallUnit(), wallEndToBall) > 0) {
        return wall.end;
    }

    let closestDistanceToWall = Vector.dot(wall.wallUnit(), ballToWallStart);
    let closestVector = wall.wallUnit().multiply(closestDistanceToWall);

    return wall.start.subtract(closestVector);
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
