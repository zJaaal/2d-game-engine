import { Engine } from '.';
import { Ball } from '../../test/Ball';

export interface EngineSettings {
    canvas: CanvasSettings;
    DEBUG: boolean;
}

export interface CanvasSettings {
    width: number;
    height: number;
    id: string;
    styleClass: string;
}

export type DebugEntity = (
    ctx: CanvasRenderingContext2D,
    entity: Ball,
    engine: Engine,
    entityIndex: number
) => void;
export type CollisionResolution<T> = (a: T, b: T) => void;
export type PenetrationResolution<T> = (a: T, b: T) => void;
export type DetectCollision<T> = (a: T, b: T) => boolean;
