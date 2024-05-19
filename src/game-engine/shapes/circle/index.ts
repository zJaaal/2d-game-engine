import { Collision } from '../../physics/collision';

import { Vector } from '../../physics/vector';
import { Shape } from '../../shape';
import { CircleSettings } from './types';

export class Circle extends Shape {
    radius: number;
    color: string;
    strokeColor: string;

    constructor({ position, radius, color, strokeColor }: CircleSettings) {
        super();

        this.position = position;
        this.radius = radius;
        this.color = color ?? 'black';
        this.strokeColor = strokeColor ?? 'black';
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    override getVertexes(axis: Vector = new Vector(0, 0)): Vector[] {
        return [
            this.position.add(axis.unit().multiply(-this.radius)),
            this.position.add(axis.unit().multiply(this.radius))
        ];
    }

    override getAxes(entity: Shape): Vector[] {
        return [
            Collision.closestVertexToPoint(entity, this.position).subtract(this.position).unit()
        ];
    }

    override move(linearSpeed: Vector): void {
        this.position = this.position.add(linearSpeed);
    }
}
