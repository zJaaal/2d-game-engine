import { DrawVector } from './types';

export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    multiply(scalar: number) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    drawVector({ x, y, color, scalar, ctx }: DrawVector) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.x * scalar, y + this.y * scalar);
        ctx.stroke();
    }
}
