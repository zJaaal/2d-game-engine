import { EntitySettings } from '../../../game-engine/primitives/entity/types';

export interface BallSettings extends EntitySettings {
    radius: number;
    startAngle?: number;
    endAngle?: number;
}
