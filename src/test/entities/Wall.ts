import { Vector } from '../../game-engine/physics/vector';
import { Entity } from '../../game-engine/entity';

import { WallSettings } from './types';

export class Wall extends Entity {
    start: Vector;
    end: Vector;
    color: string;
    direction: Vector;

    constructor({ position, end, id, color, elasticity, start, vertex }: WallSettings) {
        super({
            position: position ?? new Vector(0, 0),
            elasticity: elasticity ?? 1,
            speed: new Vector(0, 0),
            acceleration: new Vector(0, 0),
            accelerationFactor: 1,
            friction: 0,
            mass: 0,
            id: 'Wall-' + id,
            rotationFactor: 0,
            angle: 0,
            vertex
        });

        this.end = end;
        this.start = start;
        this.color = color;
        this.direction = this.end.subtract(this.start).unit();

        this.vertex = [this.start, this.end];
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
        ctx.closePath();
    }
}
