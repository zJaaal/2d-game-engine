import { Engine } from '.';
import { Ball } from '../../test/entities/ball';

import { Entity } from '../primitives/entity';

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

export interface MainLoopArgs {
    entities?: Entity[];
}
