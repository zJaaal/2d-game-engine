import { Vector } from '../../../game-engine/physics/vector';
import { EntitySettings } from '../../../game-engine/primitives/entity/types';

export interface WallSettings extends Partial<EntitySettings> {
    start: Vector;
    end: Vector;
    strokeColor: string;
}
