import { KeyCodes, EntitySettings } from '../../game-engine/entity/types';
import { Vector } from '../../game-engine/physics/vector';

export enum LinearMovementMap {
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
    start: Vector;
    end: Vector;
    color: string;
}

export interface CapsuleSettings extends EntitySettings {
    start: Vector;
    end: Vector;
    radius: number;
    strokeColor: string;
    color: string;
}

export const FULL_DEGREES = Math.PI * 2;
