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

    unit() {
        const magnitude = this.magnitude();

        return magnitude ? new Vector(this.x / magnitude, this.y / magnitude) : new Vector(0, 0);
    }

    normal() {
        return new Vector(-this.y, this.x).unit();
    }

    static dot(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    draw({ x, y, color, scalar, ctx }: DrawVector) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.x * scalar, y + this.y * scalar);
        ctx.stroke();
    }
}
