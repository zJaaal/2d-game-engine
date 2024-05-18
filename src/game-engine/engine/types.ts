import { Engine } from '.';
import { Ball } from '../../test/entities/Ball';
import { Capsule } from '../../test/entities/Capsule';
import { Wall } from '../../test/entities/Wall';

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
    mainBall: Ball;
    balls?: Ball[];
    walls?: Wall[];
    capsules?: Capsule[];
    debugEntity?: DebugEntity;
}
