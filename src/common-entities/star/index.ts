import { Vector } from '../../game-engine/physics/vector';
import { Entity } from '../../game-engine/primitives/entity';
import { Controls } from '../../game-engine/primitives/entity/types';

import { Triangle } from '../../game-engine/shapes/triangle';
import { LinearMovementMap } from '../const';
import { StarSettings } from './types';

export class Star extends Entity {
    radius: number;
    centralPoint: Vector;

    constructor({
        position,
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
        DEBUG,
        radius,
        centralPoint
    }: StarSettings) {
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
            id,
            color,
            strokeColor,
            speed: new Vector(0, 0)
        });

        this.radius = radius;
        this.centralPoint = centralPoint;
        let upDirection = new Vector(0, -1);

        [1, -1].forEach((sign) => {
            let upPoint = centralPoint.add(upDirection.multiply(radius * sign));
            let downPoint = centralPoint.add(upDirection.multiply((-radius / 2) * sign));

            let vertexA = upPoint;
            let vertexB = downPoint.add(
                upDirection.normal().multiply((-radius * Math.sqrt(3)) / 2)
            );
            let vertexC = downPoint.add(upDirection.normal().multiply((radius * Math.sqrt(3)) / 2));

            this.components.push(
                new Triangle({
                    vertexA,
                    vertexB,
                    vertexC,
                    color,
                    strokeColor
                })
            );
        });

        this.inertia = (this.mass * (2 * this.radius) ** 2) / 12;
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

        const triangle = this.components[0] as Triangle;

        if (UP) {
            this.acceleration = triangle.direction.multiply(-this.accelerationFactor);
        }

        if (DOWN) {
            this.acceleration = triangle.direction.multiply(this.accelerationFactor);
        }

        if (LEFT) {
            this.angleSpeed = -this.rotationFactor;
        }

        if (RIGHT) {
            this.angleSpeed = this.rotationFactor;
        }

        if (!UP && !DOWN) {
            this.acceleration.set(0, 0);
        }
    }

    override reposition(): void {
        this.acceleration = this.acceleration.unit().multiply(this.accelerationFactor);

        this.speed = this.speed.add(this.acceleration).multiply(1 - this.friction);

        this.position = this.position.add(this.speed);

        this.angle += this.angleSpeed;
        this.angleSpeed *= 1 - this.friction;

        this.components.forEach((component) => {
            component.move(this.speed, this.angle);
        });
    }
}
