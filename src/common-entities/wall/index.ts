import { Vector } from '../../game-engine/physics/vector';
import { Entity } from '../../game-engine/primitives/entity';

import { Line } from '../../game-engine/shapes/line';
import { WallSettings } from './types';

export class Wall extends Entity {
    start: Vector;
    end: Vector;
    direction: Vector;

    constructor({ start, end, strokeColor, ...entitySettings }: WallSettings) {
        super({
            ...entitySettings,
            strokeColor
        });

        this.components = [new Line({ start, end, strokeColor })];

        this.end = end;
        this.start = start;
        this.direction = this.end.subtract(this.start).unit();

        this.position = this.components[0].position;
    }
}
