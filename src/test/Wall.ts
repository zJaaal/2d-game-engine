import { Vector } from '../game-engine/Vector';
import { Entity } from '../game-engine/entity';
import { EntitySettings } from '../game-engine/entity/types';

export interface WallSettings extends Partial<EntitySettings> {
    endPosition: Vector;
    color: string;
}

export class Wall extends Entity {
    endPosition: Vector;
    color: string;
    constructor({ position, endPosition, id, color, elasticity }: WallSettings) {
        super({
            position: position ?? new Vector(0, 0),
            elasticity: elasticity ?? 1,
            speed: new Vector(0, 0),
            acceleration: new Vector(0, 0),
            accelerationFactor: 1,
            friction: 0,
            mass: 0,
            id: 'Wall-' + id
        });

        this.endPosition = endPosition;
        this.color = color;
    }

    drawEntity(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.endPosition.x, this.endPosition.y);
        ctx.stroke();
    }

    wallUnit() {
        return this.endPosition.subtract(this.position).unit();
    }
}
