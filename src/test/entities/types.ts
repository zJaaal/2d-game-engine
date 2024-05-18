import { KeyCodes, EntitySettings } from '../../game-engine/entity/types';
import { Vector } from '../../game-engine/physics/Vector';

export enum BallControlMap {
    UP = KeyCodes.KEY_W,
    DOWN = KeyCodes.KEY_S,
    LEFT = KeyCodes.KEY_A,
    RIGHT = KeyCodes.KEY_D,
    ALT_UP = KeyCodes.ARROW_UP,
    ALT_DOWN = KeyCodes.ARROW_DOWN,
    ALT_LEFT = KeyCodes.ARROW_LEFT,
    ALT_RIGHT = KeyCodes.ARROW_RIGHT
}

export interface BallSettings extends EntitySettings {
    radius: number;
    startAngle?: number;
    endAngle?: number;
    color?: string;
    strokeColor?: string;
}

export interface WallSettings extends Partial<EntitySettings> {
    endPosition: Vector;
    color: string;
}

export enum WallControls {
    MOVE_END_X_ANTI_CLOCKWISE = KeyCodes.KEY_K,
    MOVE_END_Y_CLOCKWISE = KeyCodes.KEY_L,
    MOVE_END_X_ANTI_CLOCKWISE_ALT = KeyCodes.KEY_Q,
    MOVE_END_X_CLOCKWISE_ALT = KeyCodes.KEY_E
}

export const FULL_DEGREES = Math.PI * 2;
