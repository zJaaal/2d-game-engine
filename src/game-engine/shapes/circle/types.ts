import { Vector } from '../../physics/vector';
import { ShapeSettings } from '../../primitives/shape/types';

export interface CircleSettings extends ShapeSettings {
    position: Vector;
    radius: number;
}
