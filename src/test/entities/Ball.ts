import { Entity } from '../../game-engine/entity';
import { Controls } from '../../game-engine/entity/types';
import { BallSettings, FULL_DEGREES, BallControlMap } from './types';

export class Ball extends Entity {
    radius: number;
    startAngle: number;
    endAngle: number;
    color: string;
    strokeColor: string;

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
            rotationFactor
        });

        this.radius = radius;
        this.startAngle = startAngle ?? 0;
        this.endAngle = endAngle ?? FULL_DEGREES;
        this.color = color ?? 'black';
        this.strokeColor = strokeColor ?? 'black';
    }

    override drawEntity(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.radius, this.startAngle, this.endAngle);

        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();

        if (this.DEBUG) {
            ctx.beginPath();
            this.acceleration.unit().draw({
                x: this.position.x,
                y: this.position.y,
                color: 'blue',
                scalar: 50,
                ctx
            });

            this.speed.draw({
                x: this.position.x,
                y: this.position.y,
                color: 'green',
                scalar: 10,
                ctx
            });
        }
    }

    override handleControls(controlMap: Controls<BallControlMap>): void {
        const UP = controlMap.get(BallControlMap.UP) || controlMap.get(BallControlMap.ALT_UP);
        const DOWN = controlMap.get(BallControlMap.DOWN) || controlMap.get(BallControlMap.ALT_DOWN);
        const LEFT = controlMap.get(BallControlMap.LEFT) || controlMap.get(BallControlMap.ALT_LEFT);
        const RIGHT =
            controlMap.get(BallControlMap.RIGHT) || controlMap.get(BallControlMap.ALT_RIGHT);

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

        this.position = this.position.add(this.speed);
    }
}
