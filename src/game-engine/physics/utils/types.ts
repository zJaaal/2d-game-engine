import { Vector } from '../vector';

export interface SeparationAxisTheorem {
    collide: boolean;
    contactVertex?: Vector;
    smallestAxis?: Vector;
    minOverlap?: number;
}
