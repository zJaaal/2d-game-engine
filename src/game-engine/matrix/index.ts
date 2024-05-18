import { Vector } from '../Vector';

export class Matrix {
    rows: number;
    cols: number;
    data: number[][];

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];
        for (let i = 0; i < rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < cols; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    multiplyVector(v: Vector) {
        const x = this.data[0][0] * v.x + this.data[0][1] * v.y;
        const y = this.data[1][0] * v.x + this.data[1][1] * v.y;

        return new Vector(x, y);
    }
}
