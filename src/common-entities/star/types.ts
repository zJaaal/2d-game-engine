import { Vector } from '../../game-engine/physics/vector';
import { EntitySettings } from '../../game-engine/primitives/entity/types';

export interface StarSettings extends EntitySettings {
    centralPoint: Vector;
    radius: number;
}
