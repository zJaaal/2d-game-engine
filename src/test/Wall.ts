import { Vector } from '../game-engine/Vector';
import { Entity } from '../game-engine/entity';
import { Controls, EntitySettings, KeyCodes } from '../game-engine/entity/types';
import { createRotationMatrix } from './utils';

export interface WallSettings extends Partial<EntitySettings> {
    endPosition: Vector;
    color: string;
}

export enum WallControls {
    MOVE_END_X_ANTI_CLOCKWISE = KeyCodes.KEY_K,
    MOVE_END_Y_CLOCKWISE = KeyCodes.KEY_L,
    MOVE_END_X_ANTI_CLOCKWISE_ALT = KeyCodes.KEY_Q,
    MOVE_END_X_CLOCKWISE_ALT = KeyCodes.KEY_E
}

export class Wall extends Entity {
    endPosition: Vector;
    color: string;
    center: Vector;
    length: number;
    refEndPosition: Vector;
    refStartPosition: Vector;
    refUnit: Vector;
    angleSpeed: number = 0;

    constructor({
        position,
        endPosition,
        id,
        color,
        elasticity,
        angle,
        rotationFactor,
        friction
    }: WallSettings) {
        super({
            position: position ?? new Vector(0, 0),
            elasticity: elasticity ?? 1,
            speed: new Vector(0, 0),
            acceleration: new Vector(0, 0),
            accelerationFactor: 1,
            friction: friction ?? 0,
            mass: 0,
            id: 'Wall-' + id,
            rotationFactor: rotationFactor ?? 0,
            angle: angle ?? 0
        });

        this.endPosition = endPosition;
        this.color = color;

        this.center = this.position.add(this.endPosition).multiply(0.5);
        this.length = this.endPosition.subtract(this.position).magnitude();
        this.refStartPosition = new Vector(this.position.x, this.position.y);
        this.refEndPosition = new Vector(this.endPosition.x, this.endPosition.y);
        this.refUnit = this.endPosition.subtract(this.position).unit();
    }

    drawEntity(ctx: CanvasRenderingContext2D): void {
        let rotationMatrix = createRotationMatrix(this.angle);
        let newDirection = rotationMatrix.multiplyVector(this.refUnit);

        this.position = this.center.subtract(newDirection.multiply(this.length / 2));
        this.endPosition = this.center.add(newDirection.multiply(this.length / 2));

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.endPosition.x, this.endPosition.y);
        ctx.stroke();
        ctx.closePath();
    }

    wallUnit() {
        return this.endPosition.subtract(this.position).unit();
    }

    handleControls(controlMap: Controls<WallControls>): void {
        const MOVE_END_X_ANTI_CLOCKWISE =
            controlMap.get(WallControls.MOVE_END_X_ANTI_CLOCKWISE) ||
            controlMap.get(WallControls.MOVE_END_X_ANTI_CLOCKWISE_ALT);

        const MOVE_END_X_CLOCKWISE =
            controlMap.get(WallControls.MOVE_END_Y_CLOCKWISE) ||
            controlMap.get(WallControls.MOVE_END_X_CLOCKWISE_ALT);

        if (MOVE_END_X_ANTI_CLOCKWISE) {
            this.angleSpeed = -this.rotationFactor;
        }
        if (MOVE_END_X_CLOCKWISE) {
            this.angleSpeed = this.rotationFactor;
        }
    }

    reposition(): void {
        this.angle += this.angleSpeed;

        this.angleSpeed *= this.friction;
    }
}
