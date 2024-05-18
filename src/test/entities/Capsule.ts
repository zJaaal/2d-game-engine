import { Entity } from '../../game-engine/entity';
import { Controls, KeyCodes } from '../../game-engine/entity/types';
import { Vector } from '../../game-engine/physics/vector';
import { CapsuleSettings } from './types';

export class Capsule extends Entity {
    endPosition: Vector;
    radius: number;
    refAngle: number = 0;
    refDirection: Vector;
    strokeColor: string;
    color: string;

    constructor({ position, endPosition, radius, id, strokeColor, color }: CapsuleSettings) {
        super({
            position: position ?? new Vector(0, 0),
            elasticity: 1,
            speed: new Vector(0, 0),
            acceleration: new Vector(0, 0),
            accelerationFactor: 1,
            friction: 0,
            mass: 0,
            id: 'Capsule-' + id,
            rotationFactor: 0,
            angle: 0
        });

        this.endPosition = endPosition;
        this.radius = radius;

        this.refDirection = this.endPosition.subtract(this.position).unit();

        this.refAngle = Math.acos(Vector.dot(this.refDirection, new Vector(1, 0)));

        if (Vector.cross(this.refDirection, new Vector(1, 0)) > 0) {
            this.refAngle *= -1;
        }

        this.strokeColor = strokeColor;
        this.color = color;
    }

    drawEntity(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.color;
        ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            this.refAngle + Math.PI / 2,
            this.refAngle + (3 * Math.PI) / 2
        );

        ctx.arc(
            this.endPosition.x,
            this.endPosition.y,
            this.radius,
            this.refAngle - Math.PI / 2,
            this.refAngle + Math.PI / 2
        );
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    handleControls(_controlMap: Controls<KeyCodes>): void {}

    reposition(): void {}
}
