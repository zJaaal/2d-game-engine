import { Vector } from '../physics/vector';

export class Shape {
    vertexes: Vector[] = [];
    position: Vector = new Vector(0, 0);

    move(_linearSpeed: Vector, _angle?: number) {}

    draw(_ctx: CanvasRenderingContext2D) {}

    getAxes(_entity?: Shape): Vector[] {
        return [];
    }

    getVertexes(_axis?: Vector): Vector[] {
        return this.vertexes;
    }
}
