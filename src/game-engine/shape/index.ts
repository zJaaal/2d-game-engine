import { Entity } from '../entity';
import { Vector } from '../physics/vector';

export class Shape {
    vertexes: Vector[] = [];

    move(_linearSpeed: Vector, _angle?: number) {}

    draw(_ctx: CanvasRenderingContext2D) {}

    getAxes(_entity?: Entity): Vector[] {
        return [];
    }

    getVertexes(_axis?: Vector): Vector[] {
        return this.vertexes;
    }
}