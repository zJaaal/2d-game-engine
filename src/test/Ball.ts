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
        initialAcceleration,
        currentAcceleration,
        friction,
        DEBUG
    }: BallSettings) {
        super({ x, y, speed, id, initialAcceleration, currentAcceleration, friction, DEBUG });

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
            initialAcceleration,
            currentAcceleration,
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

            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + this.currentAcceleration.x * 100,
                this.y + this.currentAcceleration.y * 100
            );
            ctx.strokeStyle = 'green';
            ctx.stroke();

            ctx.beginPath();

            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.speed.x * 10, this.y + this.speed.y * 10);
            ctx.strokeStyle = 'blue';
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
            this.currentAcceleration.y = -this.initialAcceleration.y;
        }

        if (DOWN) {
            this.currentAcceleration.y = this.initialAcceleration.y;
        }

        if (LEFT) {
            this.currentAcceleration.x = -this.initialAcceleration.x;
        }

        if (RIGHT) {
            this.currentAcceleration.x = this.initialAcceleration.x;
        }

        if (!UP && !DOWN) {
            this.currentAcceleration.y = 0;
        }

        if (!LEFT && !RIGHT) {
            this.currentAcceleration.x = 0;
        }

        this.speed.x += this.currentAcceleration.x;
        this.speed.y += this.currentAcceleration.y;

        this.speed.x *= 1 - this.ballSettings.friction;
        this.speed.y *= 1 - this.ballSettings.friction;

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
