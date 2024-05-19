import { Vector } from '../../physics/vector';
import { ShapeSettings } from '../../primitives/shape/types';

export interface RectangleSettings extends ShapeSettings {
    firstPoint: Vector;
    secondPoint: Vector;
    width: number;
}
