import { Entity } from '../../game-engine/entity';
import { Controls } from '../../game-engine/entity/types';
import { Vector } from '../../game-engine/physics/vector';
import { Circle } from '../../game-engine/shapes/circle';
import { Rectangle } from '../../game-engine/shapes/rectangle';

import { CapsuleSettings, LinearMovementMap } from './types';

export class Capsule extends Entity {
    strokeColor: string;
    color: string;
    length: number;
    angleSpeed: number = 0;
    inertia: number;
    inverseInertia: number;

    start: Vector;
    end: Vector;
    radius: number;

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

        this.components = [
            new Circle({ position: start, radius, color: color, strokeColor }),
            new Circle({ position: end, radius, color: color, strokeColor })
        ];

        const firstCircle: Circle = this.components[0] as Circle;
        const secondCircle: Circle = this.components[1] as Circle;

        const rectangleFirstVertex = secondCircle.position.add(
            secondCircle.position.subtract(firstCircle.position).unit().normal().multiply(radius)
        );

        const rectangleSecondVertex = firstCircle.position.add(
            secondCircle.position.subtract(firstCircle.position).unit().normal().multiply(radius)
        );

        this.components.unshift(
            new Rectangle({
                firstPoint: rectangleFirstVertex,
                secondPoint: rectangleSecondVertex,
                color: color,
                strokeColor: strokeColor,
                width: radius * 2
            })
        );

        this.start = start;
        this.end = end;
        this.radius = radius;

        this.length = end.subtract(start).magnitude();

        this.strokeColor = strokeColor;
        this.color = color;

        this.inertia =
            (this.mass * (this.length + this.radius * 2) ** 2 + (this.radius * 2) ** 2) / 12;

        if (this.mass === 0) {
            this.inverseInertia = 0;
        } else {
            this.inverseInertia = 1 / this.inertia;
        }
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        this.components.forEach((component) => component.draw(ctx));
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

        const rectangle = this.components[0] as Rectangle;

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
    }

    override reposition(): void {
        this.acceleration = this.acceleration.unit().multiply(this.accelerationFactor);

        this.speed = this.speed.add(this.acceleration).multiply(1 - this.friction);

        this.position = this.position.add(this.speed);

        this.angle += this.angleSpeed;
        this.angleSpeed *= 1 - this.friction;

        const rectangle = this.components[0] as Rectangle;
        const startCircle = this.components[1] as Circle;
        const endCircle = this.components[2] as Circle;

        const startCirclePosition = rectangle.position.add(
            rectangle.direction.multiply(-rectangle.length / 2)
        );
        const endCirclePosition = rectangle.position.add(
            rectangle.direction.multiply(rectangle.length / 2)
        );

        rectangle.move(this.speed, this.angle);

        startCircle.setPosition(startCirclePosition);
        endCircle.setPosition(endCirclePosition);
    }
}
