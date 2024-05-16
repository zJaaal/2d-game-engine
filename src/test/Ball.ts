import { Entity } from '../game-engine/Entity';
import { EntitySettings } from '../game-engine/Entity/types';
import { Player } from '../game-engine/player';
import { KeyCodes, PlayerSettings } from '../game-engine/player/types';

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
        strokeColor
    }: BallSettings) {
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

        this.controls = {
            [BallControlMap.UP]: this.moveUp.bind(this),
            [BallControlMap.DOWN]: this.moveDown.bind(this),
            [BallControlMap.LEFT]: this.moveLeft.bind(this),
            [BallControlMap.RIGHT]: this.moveRight.bind(this),
            [BallControlMap.ALT_UP]: this.moveUp.bind(this),
            [BallControlMap.ALT_DOWN]: this.moveDown.bind(this),
            [BallControlMap.ALT_LEFT]: this.moveLeft.bind(this),
            [BallControlMap.ALT_RIGHT]: this.moveRight.bind(this)
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
    }

    private moveUp() {
        this.y -= this.speed;
    }

    private moveDown() {
        this.y += this.speed;
    }

    private moveLeft() {
        this.x -= this.speed;
    }

    private moveRight() {
        this.x += this.speed;
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
