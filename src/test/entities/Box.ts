import { Entity } from '../../game-engine/entity';
import { Controls } from '../../game-engine/entity/types';
import { createRotationMatrix } from '../../game-engine/physics/matrix';
import { Vector } from '../../game-engine/physics/vector';
import { BoxSettings, LinearMovementMap } from './types';

export class Box extends Entity {
    width: number;
    color: string;
    strokeColor: string;
    firstPoint: Vector;
    secondPoint: Vector;
    edge: Vector;
    length: number;
    direction: Vector;
    refDirection: Vector;
    angleSpeed: number = 0;
    inertia: number;
    inverseInertia: number;

    constructor({
        position,
        speed,
        id,
        accelerationFactor,
        acceleration,
        friction,
        DEBUG,
        mass,
        elasticity,
        angle,
        rotationFactor,
        width,
        color,
        strokeColor,
        firstPoint,
        secondPoint
    }: BoxSettings) {
        super({
            position,
            speed,
            id,
            accelerationFactor,
            acceleration,
            friction,
            DEBUG,
            mass,
            elasticity,
            angle,
            rotationFactor
        });

        this.firstPoint = firstPoint;
        this.secondPoint = secondPoint;

        this.width = width;
        this.color = color ?? 'black';
        this.strokeColor = strokeColor ?? 'black';
        this.vertex = [firstPoint, secondPoint];

        this.edge = this.secondPoint.subtract(this.firstPoint);

        this.length = this.edge.magnitude();
        this.direction = this.edge.unit();
        this.refDirection = this.edge.unit();
        this.position = this.vertex[0]
            .add(this.direction.multiply(this.length / 2))
            .add(this.direction.normal().multiply(this.width / 2));

        this.vertex[2] = this.vertex[1].add(this.direction.normal().multiply(this.width));
        this.vertex[3] = this.vertex[2].add(this.direction.multiply(-this.length));
        this.inertia = (this.mass * this.width ** 2 + this.length ** 2) / 12;

        if (this.mass === 0) {
            this.inverseInertia = 0;
        } else {
            this.inverseInertia = 1 / this.inertia;
        }
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.vertex[0].x, this.vertex[0].y);
        ctx.lineTo(this.vertex[1].x, this.vertex[1].y);
        ctx.lineTo(this.vertex[2].x, this.vertex[2].y);
        ctx.lineTo(this.vertex[3].x, this.vertex[3].y);
        ctx.lineTo(this.vertex[0].x, this.vertex[0].y);
        ctx.closePath();
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
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

        this.vertex[0] = this.position
            .add(this.direction.multiply(-this.length / 2))
            .add(this.direction.normal().multiply(this.width / 2));

        this.vertex[1] = this.position
            .add(this.direction.multiply(-this.length / 2))
            .add(this.direction.normal().multiply(-this.width / 2));

        this.vertex[2] = this.position
            .add(this.direction.multiply(this.length / 2))
            .add(this.direction.normal().multiply(-this.width / 2));

        this.vertex[3] = this.position
            .add(this.direction.multiply(this.length / 2))
            .add(this.direction.normal().multiply(this.width / 2));
    }
}
