import { Vector } from '../../physics/vector';
import { Shape } from '../../primitives/shape';
import { TriangleSettings } from './types';

export class Triangle extends Shape {
    refDiamond: Vector[];

    constructor({ vertexA, vertexB, vertexC, color, strokeColor }: TriangleSettings) {
        super({
            color,
            strokeColor
        });

        this.vertexes = [vertexA, vertexB, vertexC];

        const averageX = (vertexA.x + vertexB.x + vertexC.x) / 3;
        const averageY = (vertexA.y + vertexB.y + vertexC.y) / 3;

        this.position = new Vector(averageX, averageY);
        this.direction = vertexA;
        this.refDirection = this.direction;

        this.refDiamond = [vertexA, vertexB, vertexC].map((vertex) =>
            vertex.subtract(this.position)
        );
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

    getAxes(): Vector[] {
        return [this.direction.normal(), this.direction];
    }

    move(linearSpeed: Vector, angle: number): void {
        this.position = this.position.add(linearSpeed);

        this.rotationMatrix.createRotationMatrix2by2(angle);

        this.direction = this.rotationMatrix.multiplyVector(this.refDirection);

        this.vertexes = this.refDiamond.map((vertex) =>
            this.position.add(this.rotationMatrix.multiplyVector(vertex))
        );
    }
}
