import { Controls, KeyCodes, MovementProperties, PlayerSettings } from './types';

export class Player {
    x: number;
    y: number;
    speed: MovementProperties;
    initialAcceleration: MovementProperties;
    currentAcceleration: MovementProperties;
    protected DEBUG: boolean;
    id: string;

    constructor({
        x,
        y,
        speed,
        id,
        DEBUG = false,
        initialAcceleration,
        currentAcceleration
    }: PlayerSettings) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.id = id;
        this.DEBUG = DEBUG;
        this.initialAcceleration = initialAcceleration;
        this.currentAcceleration = currentAcceleration;
    }

    drawPlayer(_ctx: CanvasRenderingContext2D) {
        throw new Error('Method not implemented: drawPlayer');
    }

    handleControls(_controlMap: Controls<KeyCodes>) {
        throw new Error('Method not implemented: handleControls');
    }
}
