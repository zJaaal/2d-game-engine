import { Vector } from '../vector';

export interface SeparationAxisTheorem {
    contactVertex: Vector;
    smallestAxis: Vector;
    minOverlap: number;
}
