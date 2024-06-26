import { Controls, KeyCodes } from '../primitives/entity/types';
import { CanvasSettings, EngineSettings, MainLoopArgs } from './types';
import { Collision } from '../physics/collision';
import { SAT_INITIAL_VALUE } from '../const';
import { SeparationAxisTheorem } from '../physics/collision/types';
import { Entity } from '../primitives/entity';

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

    gameLogic: (entities: Entity[]) => void = () => {};

    initEngine() {
        this.canvas = this.initCanvas();

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.canvas.addEventListener('keydown', (e) => {
            this.pressedKeys.set(e.code as KeyCodes, true);
        });

        this.canvas.addEventListener('keyup', (e) => {
            this.pressedKeys.set(e.code as KeyCodes, false);
        });

        return this;
    }

    initMainLoop({ entities = [] }: MainLoopArgs) {
        const loop = () => {
            if (!this.ctx) {
                throw new Error('Canvas context is not initialized');
            }

            this.userInteraction(entities);
            this.gameLogic(entities);
            this.renderLoop(entities);
            this.physicsLoop(entities);

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    private userInteraction(entities: Entity[]) {
        entities.forEach((entity) => {
            if (entity.id === 'Player-Entity') entity.handlePressedKeys(this.pressedKeys);
        });
    }

    private renderLoop(entities: Entity[]) {
        if (!this.ctx) {
            throw new Error('Canvas context is not initialized');
        }
        this.ctx.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);

        entities.forEach((entity) => {
            if (entity.remove) {
                const index = entities.indexOf(entity);

                index > -1 && entities.splice(index, 1);
            } else {
                entity.render(this.ctx as CanvasRenderingContext2D);
            }
        });
    }

    private physicsLoop(entities: Entity[]) {
        this.collisions.length = 0;

        entities.forEach((entity) => {
            entity.reposition();
        });

        entities.forEach((entity, i) => {
            for (let nextEntity = i + 1; nextEntity < entities.length; nextEntity++) {
                const bestSat = this.collide(entity, entities[nextEntity]);

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

        this.collisions.forEach((collision) => {
            collision.collide();
            collision.collisionResponse();
        });
    }

    private sameLayerOrZero(entityA: Entity, entityB: Entity): boolean {
        return entityA.layer === entityB.layer || entityA.layer === 0 || entityB.layer === 0;
    }

    collide(entityA: Entity, entityB: Entity): SeparationAxisTheorem {
        let bestSat = SAT_INITIAL_VALUE;

        if (this.sameLayerOrZero(entityA, entityB)) {
            // I need to optimize this further, check at the Grid Collision Detection
            for (let firstComponent of entityA.components) {
                for (let secondComponent of entityB.components) {
                    const satResult = Collision.separationAxisTheorem(
                        firstComponent,
                        secondComponent
                    );

                    // If the penetration depth is bigger than the bestSat, we update the bestSat
                    bestSat =
                        bestSat.penetrationDepth > satResult.penetrationDepth ? bestSat : satResult;
                }
            }
        }
        return bestSat;
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
