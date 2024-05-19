import { Vector } from '../physics/vector';

import { Controls, KeyCodes } from '../entity/types';
import { CanvasSettings, EngineSettings, MainLoopArgs } from './types';
import { separationAxisTheorem } from '../physics/utils';

export class Engine {
    canvasSettings: CanvasSettings;

    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D | null;

    pressedKeys: Controls<KeyCodes> = new Map<KeyCodes, boolean>();

    distanceVectors: Vector[] = [];

    DEBUG = false;

    constructor(settings: EngineSettings) {
        this.canvasSettings = settings.canvas;
        this.DEBUG = settings.DEBUG;
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

    initMainLoop({ entities = [], capsules = [], debugEntity }: MainLoopArgs) {
        if (!this.ctx) {
            throw new Error('Canvas context is not initialized');
        }

        const loop = () => {
            this.ctx!.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);
            this.ctx!.font = '16px Arial';

            entities.forEach((entity, i) => {
                entity.draw(this.ctx as CanvasRenderingContext2D);

                if (entity.id === 'Player-Entity') entity.handlePressedKeys(this.pressedKeys);

                for (let j = i + 1; j < entities.length; j++) {
                    const { contactVertex, collide, minOverlap, smallestAxis } =
                        separationAxisTheorem(entity, entities[j]);

                    if (collide && smallestAxis && contactVertex) {
                        smallestAxis.draw({
                            x: contactVertex.x,
                            y: contactVertex.y,
                            color: 'red',
                            scalar: minOverlap ?? 1,
                            ctx: this.ctx as CanvasRenderingContext2D
                        });
                    }
                }
                entity.reposition();
            });

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
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
