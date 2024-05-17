import { Controls, KeyCodes } from '../player/types';
import { CanvasSettings, EngineSettings, MainLoop } from './types';

export class Engine {
    canvasSettings: CanvasSettings;

    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D | null;

    pressedKeys: Controls<KeyCodes> = new Map<KeyCodes, boolean>();

    constructor(settings: EngineSettings) {
        this.canvasSettings = settings.canvas;
    }

    initEngine() {
        this.canvas = this.initCanva();

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.canvas.addEventListener('keydown', (e) => {
            this.pressedKeys.set(e.code as KeyCodes, true);
        });

        this.canvas.addEventListener('keyup', (e) => {
            this.pressedKeys.set(e.code as KeyCodes, false);
        });
    }

    initMainLoop(mainLoop: MainLoop) {
        if (!this.ctx) {
            throw new Error('Canvas context is not initialized');
        }

        const loop = () => {
            mainLoop(this.ctx!, this.pressedKeys);
            requestAnimationFrame(loop);
        };

        loop();
    }

    private initCanva(): HTMLCanvasElement {
        let canvas = document.querySelector(`#${this.canvasSettings.id}`) as HTMLCanvasElement;

        if (!canvas) {
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            canvas.id = this.canvasSettings.id;
            canvas.width = this.canvasSettings.width;
            canvas.height = this.canvasSettings.height;
            canvas.tabIndex = 0;
        }
        canvas.classList.add(this.canvasSettings.styleClass);

        return canvas;
    }
}
