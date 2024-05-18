import { Entity } from '../../game-engine/entity';
import { Controls } from '../../game-engine/entity/types';
import { createRotationMatrix } from '../../game-engine/physics/matrix';
import { Vector } from '../../game-engine/physics/vector';

import { CapsuleSettings, LinearMovementMap } from './types';

export class Capsule extends Entity {
    end: Vector;
    start: Vector;
    radius: number;
    refDirection: Vector;
    strokeColor: string;
    color: string;
    length: number;
    direction: Vector;
    refAngle: number;
    angleSpeed: number = 0;

    constructor({
        position,
        end,
        start,
        radius,
        id,
        strokeColor,
        color,
        elasticity,
        acceleration,
        accelerationFactor,
        friction,
        mass,
        rotationFactor,
        angle,
        DEBUG
    }: CapsuleSettings) {
        super({
            position,
            elasticity,
            acceleration,
            accelerationFactor,
            friction,
            mass,
            rotationFactor,
            angle,
            DEBUG,
            speed: new Vector(0, 0),
            id: id
        });

        this.end = end;
        this.start = start;
        this.radius = radius;
        this.position = this.start.add(this.end).multiply(0.5);
        this.length = this.end.subtract(this.start).magnitude();

        this.direction = this.end.subtract(this.start).unit();

        this.refDirection = this.end.subtract(this.start).unit();

        this.refAngle = Math.acos(Vector.dot(this.refDirection, new Vector(1, 0)));

        if (Vector.cross(this.refDirection, new Vector(1, 0)) > 0) {
            this.refAngle *= -1;
        }

        this.strokeColor = strokeColor;
        this.color = color;
    }

    drawEntity(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.color;
        ctx.arc(
            this.start.x,
            this.start.y,
            this.radius,
            this.refAngle + this.angle + Math.PI / 2,
            this.refAngle + this.angle + (3 * Math.PI) / 2
        );

        ctx.arc(
            this.end.x,
            this.end.y,
            this.radius,
            this.refAngle + this.angle - Math.PI / 2,
            this.refAngle + this.angle + Math.PI / 2
        );
        ctx.closePath();

        if (this.DEBUG) {
            ctx.moveTo(this.start.x, this.start.y);
            ctx.lineTo(this.end.x, this.end.y);
        }

        ctx.stroke();
        ctx.fill();
    }

    handleControls(controlMap: Controls<LinearMovementMap>): void {
        const UP = controlMap.get(LinearMovementMap.UP) || controlMap.get(LinearMovementMap.ALT_UP);
        const DOWN =
            controlMap.get(LinearMovementMap.DOWN) || controlMap.get(LinearMovementMap.ALT_DOWN);
        const LEFT =
            controlMap.get(LinearMovementMap.LEFT) || controlMap.get(LinearMovementMap.ALT_LEFT);
        const RIGHT =
            controlMap.get(LinearMovementMap.RIGHT) || controlMap.get(LinearMovementMap.ALT_RIGHT);

        if (UP) {
            this.acceleration = this.direction.multiply(-this.accelerationFactor);
        }

        if (DOWN) {
            this.acceleration = this.direction.multiply(this.accelerationFactor);
        }

        if (!UP && !DOWN) {
            this.acceleration = new Vector(0, 0);
        }

        if (LEFT) {
            this.angleSpeed = -this.rotationFactor;
        }

        if (RIGHT) {
            this.angleSpeed = this.rotationFactor;
        }
    }

    reposition(): void {
        this.acceleration = this.acceleration.unit().multiply(this.accelerationFactor);

        this.speed = this.speed.add(this.acceleration).multiply(1 - this.friction);

        this.position = this.position.add(this.speed);

        this.angle += this.angleSpeed;
        this.angleSpeed *= 1 - this.friction;

        let rotationMatrix = createRotationMatrix(this.angle);

        this.direction = rotationMatrix.multiplyVector(this.refDirection);

        this.start = this.position.subtract(this.direction.multiply(this.length / 2));

        this.end = this.position.add(this.direction.multiply(this.length / 2));
    }
}
