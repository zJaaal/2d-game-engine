import { Vector } from '../../game-engine/physics/vector';
import { Entity } from '../../game-engine/entity';

import { WallSettings } from './types';
import { Ball } from './Ball';

export class Wall extends Entity {
    start: Vector;
    end: Vector;
    color: string;

    constructor({ position, end, id, color, elasticity, start }: WallSettings) {
        super({
            position: position ?? new Vector(0, 0),
            elasticity: elasticity ?? 1,
            speed: new Vector(0, 0),
            acceleration: new Vector(0, 0),
            accelerationFactor: 1,
            friction: 0,
            mass: 0,
            id: 'Wall-' + id,
            rotationFactor: 0,
            angle: 0
        });

        this.end = end;
        this.start = start;
        this.color = color;
    }

    drawEntity(ctx: CanvasRenderingContext2D): void {
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
