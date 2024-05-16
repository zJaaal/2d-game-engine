import { KeyCodes, PlayerControl, PlayerSettings } from './types';

export class Player {
    x: number;
    y: number;
    speed: number;
    protected DEBUG: boolean;
    id: string;

    protected controls?: Partial<PlayerControl>;

    constructor({ x, y, speed, id, DEBUG = false }: PlayerSettings) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.id = id;
        this.DEBUG = DEBUG;
    }

    drawPlayer(_ctx: CanvasRenderingContext2D) {
        throw new Error('Method not implemented: drawPlayer');
    }

    private logKeyWarning(key: string) {
        this.DEBUG && console.warn(`Key ${key} not implemented`);
    }

    handleKeyDown(code: KeyCodes) {
        const key = code as keyof PlayerControl;

        if (this.controls?.[key]) {
            this.controls?.[key]?.(this);
        } else {
            this.logKeyWarning(key);
        }
    }
}
