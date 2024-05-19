import { Entity } from '../../game-engine/entity';
import { Controls } from '../../game-engine/entity/types';
import { Circle } from '../../game-engine/shapes/circle';
import { BallSettings, FULL_DEGREES, LinearMovementMap } from './types';

export class Ball extends Entity {
    radius: number;
    startAngle: number;
    endAngle: number;
    color: string;
    strokeColor: string;

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
            components
        });

        this.radius = radius;
        this.startAngle = startAngle ?? 0;
        this.endAngle = endAngle ?? FULL_DEGREES;
        this.color = color ?? 'black';
        this.strokeColor = strokeColor ?? 'black';

        this.inertia = 0;

        this.components = [new Circle({ position, radius, color, strokeColor })];
    }

    override draw(ctx: CanvasRenderingContext2D) {
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
