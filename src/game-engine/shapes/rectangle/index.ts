import { CARTESIAN_PLANE_QUADRANTS } from '../../const';
import { Vector } from '../../physics/vector';
import { Shape } from '../../primitives/shape';
import { RectangleSettings } from './types';

export class Rectangle extends Shape {
    length: number;
    width: number;

    constructor({ firstPoint, secondPoint, color, strokeColor, width }: RectangleSettings) {
        super({
            color,
            strokeColor
        });
        this.vertexes = [firstPoint, secondPoint];

        this.direction = secondPoint.subtract(firstPoint).unit();
        this.refDirection = secondPoint.subtract(firstPoint).unit();
        this.length = secondPoint.subtract(firstPoint).magnitude();
        this.width = width;

        this.vertexes[2] = secondPoint.add(this.direction.normal().multiply(this.width));
        this.vertexes[3] = this.vertexes[2].add(this.direction.normal().multiply(-this.length));

        this.position = firstPoint
            .add(this.direction.multiply(this.length / 2))
            .add(this.direction.normal().multiply(this.width / 2));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.vertexes[0].x, this.vertexes[0].y);

        for (let i = 1; i < this.vertexes.length; i++) {
            ctx.lineTo(this.vertexes[i].x, this.vertexes[i].y);
        }

        ctx.lineTo(this.vertexes[0].x, this.vertexes[0].y);
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.strokeColor;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    getVertexes(): Vector[] {
        return this.vertexes;
    }

    move(linearSpeed: Vector, angle: number): void {
        this.position = this.position.add(linearSpeed);

        this.rotationMatrix.createRotationMatrix2by2(angle);

        this.direction = this.rotationMatrix.multiplyVector(this.refDirection);

        this.vertexes = this.vertexes.map((_, i) => {
            const [x, y] = CARTESIAN_PLANE_QUADRANTS[i];

            return this.position
                .add(this.direction.multiply((this.length / 2) * x))
                .add(this.direction.normal().multiply((this.width / 2) * y));
        });
    }

    getAxes(): Vector[] {
        return [this.direction.normal(), this.direction];
    }
}
