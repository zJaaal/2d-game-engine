import { SeparationAxisTheorem } from './physics/collision/types';
import { Vector } from './physics/vector';

// 360 deegrees in radians
export const FULL_DEGREES = Math.PI * 2;
// Quadrants of a Cartesian plane from left to rigth counter clockwise
export const CARTESIAN_PLANE_QUADRANTS: Array<number[]> = [
    [-1, 1],
    [-1, -1],
    [1, -1],
    [1, 1]
];

export const SAT_INITIAL_VALUE: SeparationAxisTheorem = {
    penetrationDepth: -Infinity,
    normal: Vector.origin(),
    collisionPoint: Vector.origin()
};
