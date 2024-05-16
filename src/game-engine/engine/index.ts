import { Entity } from '../Entity';
import { Player } from '../player';
import { KeyCodes } from '../player/types';
import { CanvasSettings, EngineSettings } from './types';

export class Engine {
    canvasSettings: CanvasSettings;

    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D | null;

    pressedKeys: Set<KeyCodes> = new Set();

    constructor(settings: EngineSettings) {
        this.canvasSettings = settings.canvas;
    }

    initEngine() {
        this.canvas = this.initCanva();

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.canvas.addEventListener('keydown', (e) => {
            this.pressedKeys.add(e.code as KeyCodes);
        });

        this.canvas.addEventListener('keyup', (e) => {
            this.pressedKeys.delete(e.code as KeyCodes);
        });
    }

    initMainLoop(player: Player, entities: Entity[] = []) {
        if (!this.ctx) {
            throw new Error('Canvas context is not initialized');
        }

        const mainLoop = () => {
            this.ctx?.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);

            player.drawPlayer(this.ctx as CanvasRenderingContext2D);

            entities.forEach((entity) => {
                entity.drawEntity(this.ctx as CanvasRenderingContext2D);
            });

            this.pressedKeys.forEach((key) => {
                player.handleKeyDown(key);
            });

            requestAnimationFrame(mainLoop);
        };

        mainLoop();
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
