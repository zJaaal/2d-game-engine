import { Controls, KeyCodes } from '../player/types';

export interface EngineSettings {
    canvas: CanvasSettings;
}

export interface CanvasSettings {
    width: number;
    height: number;
    id: string;
    styleClass: string;
}

export type MainLoop = (ctx: CanvasRenderingContext2D, pressedKeys: Controls<KeyCodes>) => void;
