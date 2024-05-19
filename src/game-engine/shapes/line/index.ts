import { Vector } from '../../physics/vector';
import { Shape } from '../../shape';
import { LineSettings } from './types';

export class Line extends Shape {
    color: string;
    direction: Vector;
    length: number;
    vertexes: Vector[];

    constructor({ start, end, color }: LineSettings) {
        super();
        this.vertexes = [start, end];

        this.color = color;
        this.direction = end.subtract(start).unit();
        this.length = end.subtract(start).magnitude();
    }

    override draw(ctx: CanvasRenderingContext2D) {
        const [start, end] = this.vertexes;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    override getVertexes(): Vector[] {
        return this.vertexes;
    }

    override getAxes(): Vector[] {
        return [this.direction.normal()];
    }
}
