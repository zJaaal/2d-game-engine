import { Controls, KeyCodes } from '../primitives/entity/types';
import { CanvasSettings, EngineSettings, MainLoopArgs } from './types';
import { Collision } from '../physics/collision';
import { SAT_INITIAL_VALUE } from '../const';
import { SeparationAxisTheorem } from '../physics/collision/types';

export class Engine {
    canvasSettings: CanvasSettings;
    canvas: HTMLCanvasElement | null = null;
    ctx: CanvasRenderingContext2D | null = null;

    pressedKeys: Controls<KeyCodes> = new Map<KeyCodes, boolean>();

    collisions: Collision[] = [];

    DEBUG = false;

    constructor(settings: EngineSettings) {
        this.canvasSettings = settings.canvas;
        this.DEBUG = settings.DEBUG;
    }

    initEngine() {
        this.canvas = this.initCanvas();

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.canvas.addEventListener('keydown', (e) => {
            this.pressedKeys.set(e.code as KeyCodes, true);
        });

        this.canvas.addEventListener('keyup', (e) => {
            this.pressedKeys.set(e.code as KeyCodes, false);
        });
    }

    initMainLoop({ entities = [] }: MainLoopArgs) {
        const loop = () => {
            if (!this.ctx) {
                throw new Error('Canvas context is not initialized');
            }

            this.ctx.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);
            this.ctx.font = '16px Arial';

            this.collisions.length = 0;

            // Render entities
            entities.forEach((entity) => {
                if (entity.remove) {
                    entities.splice(entities.indexOf(entity), 1);

                    console.log('Entity removed', entity.id);
                }

                entity.render(this.ctx as CanvasRenderingContext2D);
                if (entity.id === 'Player-Entity') entity.handlePressedKeys(this.pressedKeys);
                entity.reposition();
            });

            // Check collisions
            entities.forEach((entity, i) => {
                for (let nextEntity = i + 1; nextEntity < entities.length; nextEntity++) {
                    let bestSat: SeparationAxisTheorem = SAT_INITIAL_VALUE;

                    // I need to optimize this further, check at the Grid Collision Detection
                    for (let firstComponent of entity.components) {
                        for (let secondComponent of entities[nextEntity].components) {
                            const satResult = Collision.separationAxisTheorem(
                                firstComponent,
                                secondComponent
                            );

                            // If the penetration depth is bigger than the bestSat, we update the bestSat
                            bestSat =
                                bestSat.penetrationDepth > satResult.penetrationDepth
                                    ? bestSat
                                    : satResult;
                        }
                    }

                    // The ininital value of the bestSat is -Infinity, so we need to check if the bestSat is a valid collision
                    if (isFinite(bestSat.penetrationDepth)) {
                        this.collisions.push(
                            new Collision({
                                entityA: entity,
                                entityB: entities[nextEntity],
                                ...bestSat
                            })
                        );
                    }
                }
            });

            // Resolve collisions
            this.collisions.forEach((collision) => {
                collision.collide();
                collision.collisionResponse();
            });

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    private initCanvas(): HTMLCanvasElement {
        let canvas = document.querySelector(`#${this.canvasSettings.id}`) as HTMLCanvasElement;

        if (!canvas) {
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
        }

        canvas.id = this.canvasSettings.id;
        canvas.width = this.canvasSettings.width;
        canvas.height = this.canvasSettings.height;
        canvas.tabIndex = 0;
        canvas.classList.add(this.canvasSettings.styleClass);

        return canvas;
    }
}
