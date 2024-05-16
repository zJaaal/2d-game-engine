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
        strokeColor,
        initialAcceleration,
        currentAcceleration
    }: BallSettings) {
        super({ x, y, speed, id, initialAcceleration, currentAcceleration });

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
            currentAcceleration
        };

        this.controls = {
            keyDown: {
                [BallControlMap.UP]: this.moveUp.bind(this),
                [BallControlMap.DOWN]: this.moveDown.bind(this),
                [BallControlMap.LEFT]: this.moveLeft.bind(this),
                [BallControlMap.RIGHT]: this.moveRight.bind(this),
                [BallControlMap.ALT_UP]: this.moveUp.bind(this),
                [BallControlMap.ALT_DOWN]: this.moveDown.bind(this),
                [BallControlMap.ALT_LEFT]: this.moveLeft.bind(this),
                [BallControlMap.ALT_RIGHT]: this.moveRight.bind(this)
            },
            keyUp: {
                [BallControlMap.UP]: this.resetVerticalMovement.bind(this),
                [BallControlMap.DOWN]: this.resetVerticalMovement.bind(this),
                [BallControlMap.LEFT]: this.resetSidewaysMovement.bind(this),
                [BallControlMap.RIGHT]: this.resetSidewaysMovement.bind(this),
                [BallControlMap.ALT_UP]: this.resetVerticalMovement.bind(this),
                [BallControlMap.ALT_DOWN]: this.resetVerticalMovement.bind(this),
                [BallControlMap.ALT_LEFT]: this.resetSidewaysMovement.bind(this),
                [BallControlMap.ALT_RIGHT]: this.resetSidewaysMovement.bind(this)
            }
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
        this.currentAcceleration.y = -this.initialAcceleration.y;

        this.speed.y += this.currentAcceleration.y;

        this.y += this.speed.y;
    }

    private moveDown() {
        this.currentAcceleration.y = this.initialAcceleration.y;

        this.speed.y += this.currentAcceleration.y;

        this.y += this.speed.y;
    }

    private moveLeft() {
        this.currentAcceleration.x = -this.initialAcceleration.x;

        this.speed.x += this.currentAcceleration.x;

        this.x += this.speed.x;
    }

    private moveRight() {
        this.currentAcceleration.x = this.initialAcceleration.x;

        this.speed.x += this.currentAcceleration.x;

        this.x += this.speed.x;
    }

    private resetSidewaysMovement() {
        this.currentAcceleration.x = 0;
        this.speed.x = 0;
    }

    private resetVerticalMovement() {
        this.currentAcceleration.y = 0;

        this.speed.y = 0;
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
