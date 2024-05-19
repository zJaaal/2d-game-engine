import { Vector } from '../../physics/vector';
import { ShapeSettings } from '../../primitives/shape/types';

export interface TriangleSettings extends ShapeSettings {
    vertexA: Vector;
    vertexB: Vector;
    vertexC: Vector;
}
