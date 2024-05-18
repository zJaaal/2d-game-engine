import { Ball } from '../../test/Ball';
import { Wall } from '../../test/Wall';
import {
    collisionResolution,
    collisionResolutionWithWall,
    detectCollision,
    detectCollisionWithWall,
    penetrationResolution,
    penetrationResolutionWithWall
} from '../../test/utils';
import { Vector } from '../Vector';

import { Controls, KeyCodes } from '../entity/types';
import { CanvasSettings, DebugEntity, EngineSettings } from './types';

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

    initMainLoop(ball: Ball, entities: Ball[], walls: Wall[], debugEntity?: DebugEntity) {
        if (!this.ctx) {
            throw new Error('Canvas context is not initialized');
        }

        const loop = () => {
            ball.handleControls(this.pressedKeys);
            this.ctx!.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);
            this.ctx!.font = '16px Arial';

            const fullEntities = [ball, ...entities];

            fullEntities.forEach((entity, i) => {
                entity.drawEntity(this.ctx as CanvasRenderingContext2D);

                walls.forEach((wall) => {
                    if (detectCollisionWithWall(entity, wall)) {
                        penetrationResolutionWithWall(entity, wall);
                        collisionResolutionWithWall(entity, wall);
                    }
                });

                // This is inefficient, but it's fine for now
                for (let j = i; j < fullEntities.length; j++) {
                    if (detectCollision(entity, fullEntities[j])) {
                        penetrationResolution(entity, fullEntities[j]);
                        collisionResolution(entity, fullEntities[j]);
                    }
                }

                entity.reposition();

                this.distanceVectors[i] = entity.position.subtract(ball.position);

                this.DEBUG && debugEntity?.(this.ctx as CanvasRenderingContext2D, entity, this, i);
            });

            walls.forEach((wall) => {
                wall.drawEntity(this.ctx as CanvasRenderingContext2D);
                wall.handleControls(this.pressedKeys);
                wall.reposition();
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
