import { Entity } from '../../game-engine/entity';
import { Controls } from '../../game-engine/entity/types';
import { createRotationMatrix } from '../../game-engine/physics/matrix';
import { Vector } from '../../game-engine/physics/vector';
import { Rectangle } from '../../game-engine/shapes/rectangle';
import { BoxSettings, LinearMovementMap } from './types';

export class Box extends Entity {
    width: number;
    color: string;
    strokeColor: string;
    length: number;
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

        this.components = [
            new Rectangle({
                firstPoint,
                secondPoint,
                color,
                strokeColor,
                width
            })
        ];

        this.width = width;
        this.color = color ?? 'black';
        this.strokeColor = strokeColor ?? 'black';

        this.length = secondPoint.subtract(firstPoint).magnitude();

        this.inertia = (this.mass * this.width ** 2 + this.length ** 2) / 12;

        if (this.mass === 0) {
            this.inverseInertia = 0;
        } else {
            this.inverseInertia = 1 / this.inertia;
        }
    }
    override draw(ctx: CanvasRenderingContext2D): void {
        this.components.forEach((component) => component.draw(ctx));
    }

    override reposition(): void {
        this.acceleration = this.acceleration.unit().multiply(this.accelerationFactor);

        this.speed = this.speed.add(this.acceleration).multiply(1 - this.friction);
        this.angle += this.angleSpeed;

        this.components.forEach((component) => component.move(this.speed, this.angle));

        this.angleSpeed *= 1 - this.friction;
    }

    override handlePressedKeys(pressedKeysMap: Controls<LinearMovementMap>): void {
        const UP =
            pressedKeysMap.get(LinearMovementMap.UP) ||
            pressedKeysMap.get(LinearMovementMap.ALT_UP);
        const DOWN =
            pressedKeysMap.get(LinearMovementMap.DOWN) ||
            pressedKeysMap.get(LinearMovementMap.ALT_DOWN);
        const LEFT =
            pressedKeysMap.get(LinearMovementMap.LEFT) ||
            pressedKeysMap.get(LinearMovementMap.ALT_LEFT);
        const RIGHT =
            pressedKeysMap.get(LinearMovementMap.RIGHT) ||
            pressedKeysMap.get(LinearMovementMap.ALT_RIGHT);

        this.components.forEach((component) => {
            const rectangle = component as Rectangle;

            if (UP) {
                this.acceleration = rectangle.direction.multiply(-this.accelerationFactor);
            }

            if (DOWN) {
                this.acceleration = rectangle.direction.multiply(this.accelerationFactor);
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
        });
    }
}
