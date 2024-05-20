import { Matrix } from '../../physics/matrix';
import { Vector } from '../../physics/vector';
import { ShapeSettings } from './types';

export class Shape {
    vertexes: Vector[] = [];

    position: Vector = Vector.origin();
    direction: Vector = Vector.origin();
    refDirection: Vector = Vector.origin();
    rotationMatrix: Matrix = new Matrix(2, 2);

    strokeColor: string;
    color: string;

    constructor({ color, strokeColor }: ShapeSettings) {
        this.color = color ?? 'black';
        this.strokeColor = strokeColor ?? 'transparent';
    }

    move(_linearSpeed: Vector, _angle?: number) {}

    draw(_ctx: CanvasRenderingContext2D) {}

    getAxes(_entity?: Shape): Vector[] {
        return [];
    }

    getVertexes(_axis?: Vector): Vector[] {
        return this.vertexes;
    }
}
