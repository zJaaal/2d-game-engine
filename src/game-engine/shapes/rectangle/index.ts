import { Matrix, createRotationMatrix } from '../../physics/matrix';
import { Vector } from '../../physics/vector';
import { Shape } from '../../shape';
import { RectangleSettings } from './types';

export class Rectangle extends Shape {
    direction: Vector;
    refDirection: Vector;
    length: number;
    width: number;
    color: string;
    strokeColor: string;
    position: Vector;
    rotationMatrix: Matrix;

    constructor({ firstPoint, secondPoint, color, strokeColor, width }: RectangleSettings) {
        super();
        this.vertexes = [firstPoint, secondPoint];

        this.direction = secondPoint.subtract(firstPoint).unit();
        this.refDirection = secondPoint.subtract(firstPoint).unit();
        this.length = secondPoint.subtract(firstPoint).magnitude();
        this.width = width;
        this.color = color;
        this.strokeColor = strokeColor;

        this.vertexes[2] = secondPoint.add(this.direction.normal().multiply(this.width));
        this.vertexes[3] = this.vertexes[2].add(this.direction.normal().multiply(-this.length));

        this.position = firstPoint
            .add(this.direction.multiply(this.length / 2))
            .add(this.direction.normal().multiply(this.width / 2));

        this.rotationMatrix = new Matrix(2, 2);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.vertexes[0].x, this.vertexes[0].y);
        ctx.lineTo(this.vertexes[1].x, this.vertexes[1].y);
        ctx.lineTo(this.vertexes[2].x, this.vertexes[2].y);
        ctx.lineTo(this.vertexes[3].x, this.vertexes[3].y);
        ctx.lineTo(this.vertexes[0].x, this.vertexes[0].y);
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    getVertexes(): Vector[] {
        return this.vertexes;
    }

    move(linearSpeed: Vector, angle: number): void {
        this.position = this.position.add(linearSpeed);

        this.rotationMatrix = createRotationMatrix(angle);

        this.direction = this.rotationMatrix.multiplyVector(this.refDirection);

        this.vertexes[0] = this.position
            .add(this.direction.multiply(-this.length / 2))
            .add(this.direction.normal().multiply(this.width / 2));

        this.vertexes[1] = this.position
            .add(this.direction.multiply(-this.length / 2))
            .add(this.direction.normal().multiply(-this.width / 2));

        this.vertexes[2] = this.position
            .add(this.direction.multiply(this.length / 2))
            .add(this.direction.normal().multiply(-this.width / 2));

        this.vertexes[3] = this.position
            .add(this.direction.multiply(this.length / 2))
            .add(this.direction.normal().multiply(this.width / 2));
    }

    getAxes(): Vector[] {
        return [this.direction.normal(), this.direction];
    }
}
