import { Entity } from '../../primitives/entity';

import { Vector } from '../vector';

export interface SeparationAxisTheorem {
    collisionPoint: Vector;
    normal: Vector;
    penetrationDepth: number;
}

export interface CollisionSettings extends SeparationAxisTheorem {
    entityA: Entity;
    entityB: Entity;
}
