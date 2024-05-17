import { Vector } from '../Vector';
import { Entity } from '../entity';
import { Controls, KeyCodes } from '../entity/types';
import {
    CanvasSettings,
    PenetrationResolution,
    DebugEntity,
    DetectCollision,
    EngineSettings,
    CollisionResolution
} from './types';

export class Engine {
    canvasSettings: CanvasSettings;

    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D | null;

    pressedKeys: Controls<KeyCodes> = new Map<KeyCodes, boolean>();

    distanceVectors: Vector[] = [];

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

    initMainLoop<T extends Entity>(
        mainEntity: T,
        entities: T[],
        detectCollision: DetectCollision<T>,
        penetrationResolution: PenetrationResolution<T>,
        collisionResolution: CollisionResolution<T>,
        debugEntity?: DebugEntity<T>
    ) {
        if (!this.ctx) {
            throw new Error('Canvas context is not initialized');
        }

        const loop = () => {
            mainEntity.handleControls(this.pressedKeys);
            this.ctx!.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);
            this.ctx!.font = '16px Arial';

            [mainEntity, ...entities].forEach((entity, i) => {
                entity.drawEntity(this.ctx as CanvasRenderingContext2D);

                // This is inefficient, but it's fine for now
                for (let j = i; j < entities.length; j++) {
                    if (detectCollision(entity, entities[j])) {
                        penetrationResolution(entity, entities[j]);
                        collisionResolution(entity, entities[j]);
                    }
                }

                entity.reposition();

                this.distanceVectors[i] = entity.position.subtract(mainEntity.position);

                debugEntity?.(this.ctx as CanvasRenderingContext2D, entity, this, i);
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
