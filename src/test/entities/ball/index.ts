import { Entity } from '../../../game-engine/primitives/entity';
import { Controls } from '../../../game-engine/primitives/entity/types';

import { Circle } from '../../../game-engine/shapes/circle';
import { BallSettings } from './types';
import { FULL_DEGREES } from '../../../game-engine/const';
import { LinearMovementMap } from '../../const';

export class Ball extends Entity {
    radius: number;
    startAngle: number;
    endAngle: number;

    constructor({
        components,
        position,
        speed,
        id,
        accelerationFactor,
        acceleration,
        friction,
        DEBUG,
        mass,
        elasticity,
        rotationFactor,
        angle,
        radius,
        startAngle,
        endAngle,
        color,
        strokeColor
    }: BallSettings) {
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
            rotationFactor,
            components,
            strokeColor,
            color
        });

        this.radius = radius;
        this.startAngle = startAngle ?? 0;
        this.endAngle = endAngle ?? FULL_DEGREES;

        this.components = [new Circle({ position, radius, color, strokeColor })];
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

        if (UP) {
            this.acceleration.y = -this.accelerationFactor;
        }

        if (DOWN) {
            this.acceleration.y = this.accelerationFactor;
        }

        if (LEFT) {
            this.acceleration.x = -this.accelerationFactor;
        }

        if (RIGHT) {
            this.acceleration.x = this.accelerationFactor;
        }

        if (!UP && !DOWN) {
            this.acceleration.y = 0;
        }

        if (!LEFT && !RIGHT) {
            this.acceleration.x = 0;
        }
    }

    override reposition() {
        this.acceleration = this.acceleration.unit().multiply(this.accelerationFactor);
        this.speed = this.speed.add(this.acceleration);
        this.speed = this.speed.multiply(1 - this.friction);

        this.components.forEach((component) => {
            component.move(this.speed);
        });
    }
}
