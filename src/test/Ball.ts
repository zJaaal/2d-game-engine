import { Entity } from '../game-engine/entity';
import { Controls, EntitySettings, KeyCodes } from '../game-engine/entity/types';

export enum BallControlMap {
    UP = KeyCodes.KEY_W,
    DOWN = KeyCodes.KEY_S,
    LEFT = KeyCodes.KEY_A,
    RIGHT = KeyCodes.KEY_D,
    ALT_UP = KeyCodes.ARROW_UP,
    ALT_DOWN = KeyCodes.ARROW_DOWN,
    ALT_LEFT = KeyCodes.ARROW_LEFT,
    ALT_RIGHT = KeyCodes.ARROW_RIGHT
}

export interface BallSettings extends EntitySettings {
    radius: number;
    startAngle?: number;
    endAngle?: number;
    color?: string;
    strokeColor?: string;
}

export interface EntityBallSettings extends EntitySettings {
    radius: number;
    startAngle?: number;
    endAngle?: number;
    color?: string;
    strokeColor?: string;
}

const FULL_DEGREES = Math.PI * 2;

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
            elasticity
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
            const DEBUG_X = ctx.canvas.width - 100;
            const DEBUG_Y = ctx.canvas.height - 100;

            ctx.beginPath();
            this.acceleration.unit().drawVector({
                x: DEBUG_X,
                y: DEBUG_Y,
                color: 'blue',
                scalar: 50,
                ctx
            });

            this.speed.drawVector({
                x: DEBUG_X,
                y: DEBUG_Y,
                color: 'green',
                scalar: 10,
                ctx
            });

            this.acceleration.normal().drawVector({
                x: DEBUG_X,
                y: DEBUG_Y,
                color: 'black',
                scalar: 50,
                ctx
            });
            ctx.beginPath();

            ctx.arc(DEBUG_X, DEBUG_Y, 50, this.startAngle, this.endAngle);

            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
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

export class EntityBall extends Ball {
    radius: number;
    startAngle: number;
    endAngle: number;
    color: string;
    strokeColor: string;

    constructor({
        position,
        speed,
        id,
        acceleration,
        mass,
        accelerationFactor,
        elasticity,
        friction,
        radius,
        startAngle,
        endAngle,
        color,
        strokeColor
    }: EntityBallSettings) {
        super({
            position,
            speed,
            id,
            radius,
            startAngle,
            endAngle,
            color,
            mass,
            elasticity,
            strokeColor,
            acceleration,
            accelerationFactor,
            friction
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
    }

    override handleControls(_controlMap: Controls<BallControlMap>) {}
}
