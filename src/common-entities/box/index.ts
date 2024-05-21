import { Entity } from '../../game-engine/primitives/entity';
import { Controls } from '../../game-engine/primitives/entity/types';
import { Rectangle } from '../../game-engine/shapes/rectangle';

import { BoxSettings } from './types';
import { LinearMovementMap } from '../const';

export class Box extends Entity {
    width: number;

    constructor({
        color,
        strokeColor,
        firstPoint,
        secondPoint,
        width,
        ...entitySettings
    }: BoxSettings) {
        super({
            ...entitySettings,
            color,
            strokeColor
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

        const rectangle = this.components[0] as Rectangle;

        this.inertia = (this.mass * rectangle.width ** 2 + rectangle.length ** 2) / 12;

        this.position = rectangle.position;
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

            if (LEFT) {
                this.angleSpeed = -this.rotationFactor;
            }

            if (RIGHT) {
                this.angleSpeed = this.rotationFactor;
            }

            if (!UP && !DOWN) {
                this.acceleration.set(0, 0);
            }
        });
    }

    override reposition(): void {
        super.reposition();

        this.angle += this.angleSpeed;
        this.components.forEach((component) => component.move(this.speed, this.angle));
    }
}
