import { Vector } from '../../game-engine/physics/vector';
import { EntitySettings } from '../../game-engine/primitives/entity/types';

export interface CapsuleSettings extends EntitySettings {
    start: Vector;
    end: Vector;
    radius: number;
}
