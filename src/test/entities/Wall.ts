import { Vector } from '../../game-engine/physics/vector';
import { Entity } from '../../game-engine/entity';

import { WallSettings } from './types';
import { Line } from '../../game-engine/shapes/line';

export class Wall extends Entity {
    start: Vector;
    end: Vector;
    direction: Vector;

    constructor({ position, end, id, elasticity, start, vertexes, strokeColor }: WallSettings) {
        super({
            position: position ?? new Vector(0, 0),
            elasticity: elasticity ?? 1,
            speed: new Vector(0, 0),
            acceleration: new Vector(0, 0),
            accelerationFactor: 1,
            friction: 0,
            mass: 0,
            id: 'Wall-' + id,
            rotationFactor: 0,
            angle: 0,
            components: [],
            vertexes,
            strokeColor
        });

        this.components = [new Line({ start, end, strokeColor })];

        this.end = end;
        this.start = start;
        this.direction = this.end.subtract(this.start).unit();
    }
}
