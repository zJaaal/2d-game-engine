import { Entity } from '../game-engine/Entity';
import { EntitySettings } from '../game-engine/Entity/types';

import { Player } from '../game-engine/player';
import { Controls, KeyCodes, PlayerSettings } from '../game-engine/player/types';

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

export interface BallSettings extends PlayerSettings {
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

export class Ball extends Player {
    ballSettings: BallSettings;

    constructor({
        x,
        y,
        speed,
        id,
        radius,
        startAngle,
        endAngle,
        color,
        strokeColor,
        accelerationFactor,
        acceleration,
        friction,
        DEBUG
    }: BallSettings) {
        super({
            x,
            y,
            speed,
            id,
            accelerationFactor,
            acceleration,
            friction,
            DEBUG
        });

        this.ballSettings = {
            x,
            y,
            speed,
            id,
            radius,
            startAngle,
            endAngle,
            color,
            strokeColor,
            accelerationFactor,
            acceleration,
            friction
        };
    }

    override drawPlayer(ctx: CanvasRenderingContext2D) {
        const {
            radius,
            startAngle = 0,
            endAngle = FULL_DEGREES,
            strokeColor = 'black',
            color = 'black'
        } = this.ballSettings;
        ctx.beginPath();

        ctx.arc(this.x, this.y, radius, startAngle, endAngle);

        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();

        if (this.DEBUG) {
            ctx.beginPath();
            this.acceleration.drawVector({
                x: this.x,
                y: this.y,
                color: 'green',
                scalar: 100,
                ctx
            });

            this.speed.drawVector({
                x: this.x,
                y: this.y,
                color: 'blue',
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

        this.speed = this.speed.add(this.acceleration);
        this.speed = this.speed.multiply(1 - this.ballSettings.friction);

        this.x += this.speed.x;
        this.y += this.speed.y;
    }
}

export class EntityBall extends Entity {
    ballSettings: EntityBallSettings;

    constructor({
        x,
        y,
        speed,
        id,
        radius,
        startAngle,
        endAngle,
        color,
        strokeColor
    }: EntityBallSettings) {
        super({ x, y, speed, id });

        this.ballSettings = {
            x,
            y,
            speed,
            id,
            radius,
            startAngle,
            endAngle,
            color,
            strokeColor
        };
    }

    override drawEntity(ctx: CanvasRenderingContext2D) {
        const {
            radius,
            startAngle = 0,
            endAngle = FULL_DEGREES,
            strokeColor = 'black',
            color = 'black'
        } = this.ballSettings;
        ctx.beginPath();

        ctx.arc(this.x, this.y, radius, startAngle, endAngle);

        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
    }
}
