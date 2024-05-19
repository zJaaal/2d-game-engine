import { Vector } from '../../physics/vector';
import { ShapeSettings } from '../../primitives/shape/types';

export interface LineSettings extends ShapeSettings {
    start: Vector;
    end: Vector;
}
