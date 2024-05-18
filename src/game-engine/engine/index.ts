import {
    collisionResolution,
    detectCollision,
    penetrationResolution
} from '../../test/entities/Ball';
import {
    collisionResolutionWithWall,
    detectCollisionWithWall,
    penetrationResolutionWithWall
} from '../../test/entities/Wall';

import { Vector } from '../physics/vector';

import { Controls, KeyCodes } from '../entity/types';
import { CanvasSettings, EngineSettings, MainLoopArgs } from './types';

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

    initMainLoop({ mainBall, balls = [], walls = [], capsules = [], debugEntity }: MainLoopArgs) {
        if (!this.ctx) {
            throw new Error('Canvas context is not initialized');
        }

        const loop = () => {
            mainBall.handleControls(this.pressedKeys);
            this.ctx!.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);
            this.ctx!.font = '16px Arial';

            const fullEntities = [mainBall, ...balls];

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

                this.distanceVectors[i] = entity.position.subtract(mainBall.position);

                this.DEBUG && debugEntity?.(this.ctx as CanvasRenderingContext2D, entity, this, i);
            });

            walls.forEach((wall) => {
                wall.drawEntity(this.ctx as CanvasRenderingContext2D);
            });

            capsules.forEach((capsule) => {
                capsule.drawEntity(this.ctx as CanvasRenderingContext2D);

                if (capsule.id === 'MainCapsule') {
                    capsule.handleControls(this.pressedKeys);
                    capsule.reposition();
                }
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
