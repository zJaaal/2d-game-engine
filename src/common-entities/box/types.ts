import { Vector } from '../../game-engine/physics/vector';
import { EntitySettings } from '../../game-engine/primitives/entity/types';

export interface BoxSettings extends EntitySettings {
    width: number;
    firstPoint: Vector;
    secondPoint: Vector;
}
