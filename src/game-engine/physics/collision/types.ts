import { Entity } from '../../primitives/entity';

import { Vector } from '../vector';

export interface SeparationAxisTheorem {
    contactVertex: Vector;
    smallestAxis: Vector;
    penetrationDepth: number;
}

export interface CollisionSettings {
    entityA: Entity;
    entityB: Entity;
    penetrationDepth: number;
    normal: Vector;
    collisionPoint: Vector;
}
