import { Vector } from '../Vector';
import { Controls, KeyCodes, PlayerSettings } from './types';

export class Player {
    x: number;
    y: number;
    accelerationFactor: number;
    speed: Vector;
    acceleration: Vector;
    protected DEBUG: boolean;
    id: string;

    constructor({
        x,
        y,
        speed,
        id,
        DEBUG = false,
        accelerationFactor,
        acceleration
    }: PlayerSettings) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.id = id;
        this.DEBUG = DEBUG;
        this.accelerationFactor = accelerationFactor;
        this.acceleration = acceleration;
    }

    drawPlayer(_ctx: CanvasRenderingContext2D) {
        throw new Error('Method not implemented: drawPlayer');
    }

    handleControls(_controlMap: Controls<KeyCodes>) {
        throw new Error('Method not implemented: handleControls');
    }
}
