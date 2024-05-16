import { KeyCodes, MovementProperties, PlayerControl, PlayerSettings } from './types';

export class Player {
    x: number;
    y: number;
    speed: MovementProperties;
    initialAcceleration: MovementProperties;
    currentAcceleration: MovementProperties;
    protected DEBUG: boolean;
    id: string;

    protected controls?: Partial<PlayerControl>;

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

    private logKeyWarning(key: string) {
        this.DEBUG && console.warn(`Key ${key} not implemented`);
    }

    handleKeyDown(code: KeyCodes) {
        const key = code as keyof PlayerControl['keyDown'];

        if (this.controls?.keyDown?.[key]) {
            this.controls?.keyDown?.[key]?.(this);
        } else {
            this.logKeyWarning(key);
        }
    }

    handleKeyUp(code: KeyCodes) {
        const key = code as keyof PlayerControl['keyUp'];

        if (this.controls?.keyUp?.[key]) {
            this.controls?.keyUp?.[key]?.(this);
        } else {
            this.logKeyWarning(key);
        }
    }
}
