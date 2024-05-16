import { EntitySettings } from './types';

export class Entity {
    x: number;
    y: number;
    speed: number;
    protected DEBUG: boolean;
    id: string;

    constructor({ x, y, speed, id, DEBUG = false }: EntitySettings) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.id = id;
        this.DEBUG = DEBUG;
    }

    drawEntity(_ctx: CanvasRenderingContext2D) {
        throw new Error('Method not implemented: drawEntity');
    }
}
