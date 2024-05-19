import { Entity } from '../../entity';
import { closestVertexToPoint } from '../../physics/utils';
import { Vector } from '../../physics/vector';
import { Shape } from '../../shape';
import { CircleSettings } from './types';

export class Circle extends Shape {
    radius: number;
    color: string;
    strokeColor: string;
    position: Vector;

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

    override getAxes(entity: Entity): Vector[] {
        return [closestVertexToPoint(entity, this.position).subtract(this.position).unit()];
    }

    override move(linearSpeed: Vector): void {
        this.position = this.position.add(linearSpeed);
    }

    setPosition(position: Vector): void {
        this.position = position;
    }
}
