import { Engine } from '.';

export interface EngineSettings {
    canvas: CanvasSettings;
}

export interface CanvasSettings {
    width: number;
    height: number;
    id: string;
    styleClass: string;
}

export type DebugEntity<T> = (
    ctx: CanvasRenderingContext2D,
    entity: T,
    engine: Engine,
    entityIndex: number
) => void;
export type CollisionResolution<T> = (a: T, b: T) => void;
export type PenetrationResolution<T> = (a: T, b: T) => void;
export type DetectCollision<T> = (a: T, b: T) => boolean;
