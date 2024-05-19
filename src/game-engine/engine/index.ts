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

    initMainLoop({ entities = [] }: MainLoopArgs) {
        if (!this.ctx) {
            throw new Error('Canvas context is not initialized');
        }

        const loop = () => {
            this.ctx!.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);
            this.ctx!.font = '16px Arial';

            let bestSat = {
                minOverlap: -Infinity,
                smallestAxis: new Vector(0, 0),
                contactVertex: new Vector(0, 0)
            };

            entities.forEach((entity, i) => {
                entity.draw(this.ctx as CanvasRenderingContext2D);

                if (entity.id === 'Player-Entity') entity.handlePressedKeys(this.pressedKeys);

                for (let j = i + 1; j < entities.length; j++) {
                    for (let firstComponent of entity.components) {
                        for (let secondComponent of entities[j].components) {
                            const satResult = separationAxisTheorem(
                                firstComponent,
                                secondComponent
                            );

                            if (satResult && satResult.minOverlap > bestSat.minOverlap) {
                                bestSat = satResult;
                            }
                        }
                    }

                    if (bestSat.minOverlap > 0) {
                        bestSat.smallestAxis.draw({
                            x: bestSat.contactVertex.x,
                            y: bestSat.contactVertex.y,
                            color: 'red',
                            scalar: bestSat.minOverlap,
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
