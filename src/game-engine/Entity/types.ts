import { Vector } from '../physics/vector';
import { Shape } from '../shape';

export enum KeyCodes {
    BACKSPACE = 'Backspace',
    TAB = 'Tab',
    ENTER = 'Enter',
    SHIFT_LEFT = 'ShiftLeft',
    SHIFT_RIGHT = 'ShiftRight',
    CONTROL_LEFT = 'ControlLeft',
    CONTROL_RIGHT = 'ControlRight',
    ALT_LEFT = 'AltLeft',
    ALT_RIGHT = 'AltRight',
    PAUSE = 'Pause',
    CAPS_LOCK = 'CapsLock',
    ESCAPE = 'Escape',
    SPACE = 'Space',
    PAGE_UP = 'PageUp',
    PAGE_DOWN = 'PageDown',
    END = 'End',
    HOME = 'Home',
    ARROW_LEFT = 'ArrowLeft',
    ARROW_UP = 'ArrowUp',
    ARROW_RIGHT = 'ArrowRight',
    ARROW_DOWN = 'ArrowDown',
    PRINT_SCREEN = 'PrintScreen',
    INSERT = 'Insert',
    DELETE = 'Delete',
    DIGIT_0 = 'Digit0',
    DIGIT_1 = 'Digit1',
    DIGIT_2 = 'Digit2',
    DIGIT_3 = 'Digit3',
    DIGIT_4 = 'Digit4',
    DIGIT_5 = 'Digit5',
    DIGIT_6 = 'Digit6',
    DIGIT_7 = 'Digit7',
    DIGIT_8 = 'Digit8',
    DIGIT_9 = 'Digit9',
    KEY_A = 'KeyA',
    KEY_B = 'KeyB',
    KEY_C = 'KeyC',
    KEY_D = 'KeyD',
    KEY_E = 'KeyE',
    KEY_F = 'KeyF',
    KEY_G = 'KeyG',
    KEY_H = 'KeyH',
    KEY_I = 'KeyI',
    KEY_J = 'KeyJ',
    KEY_K = 'KeyK',
    KEY_L = 'KeyL',
    KEY_M = 'KeyM',
    KEY_N = 'KeyN',
    KEY_O = 'KeyO',
    KEY_P = 'KeyP',
    KEY_Q = 'KeyQ',
    KEY_R = 'KeyR',
    KEY_S = 'KeyS',
    KEY_T = 'KeyT',
    KEY_U = 'KeyU',
    KEY_V = 'KeyV',
    KEY_W = 'KeyW',
    KEY_X = 'KeyX',
    KEY_Y = 'KeyY',
    KEY_Z = 'KeyZ',
    META_LEFT = 'MetaLeft',
    META_RIGHT = 'MetaRight',
    CONTEXT_MENU = 'ContextMenu',
    F1 = 'F1',
    F2 = 'F2',
    F3 = 'F3',
    F4 = 'F4',
    F5 = 'F5',
    F6 = 'F6',
    F7 = 'F7',
    F8 = 'F8',
    F9 = 'F9',
    F10 = 'F10',
    F11 = 'F11',
    F12 = 'F12',
    NUM_LOCK = 'NumLock',
    SCROLL_LOCK = 'ScrollLock',
    SEMICOLON = 'Semicolon',
    EQUAL = 'Equal',
    COMMA = 'Comma',
    MINUS = 'Minus',
    PERIOD = 'Period',
    SLASH = 'Slash',
    BACKQUOTE = 'Backquote',
    BRACKET_LEFT = 'BracketLeft',
    BACKSLASH = 'Backslash',
    BRACKET_RIGHT = 'BracketRight',
    QUOTE = 'Quote',
    INTL_BACKSLASH = 'IntlBackslash',
    NUMPAD_0 = 'Numpad0',
    NUMPAD_1 = 'Numpad1',
    NUMPAD_2 = 'Numpad2',
    NUMPAD_3 = 'Numpad3',
    NUMPAD_4 = 'Numpad4',
    NUMPAD_5 = 'Numpad5',
    NUMPAD_6 = 'Numpad6',
    NUMPAD_7 = 'Numpad7',
    NUMPAD_8 = 'Numpad8',
    NUMPAD_9 = 'Numpad9',
    NUMPAD_MULTIPLY = 'NumpadMultiply',
    NUMPAD_ADD = 'NumpadAdd',
    NUMPAD_SUBTRACT = 'NumpadSubtract',
    NUMPAD_DECIMAL = 'NumpadDecimal',
    NUMPAD_DIVIDE = 'NumpadDivide',
    NUMPAD_ENTER = 'NumpadEnter',
    NUMPAD_EQUAL = 'NumpadEqual'
}

export type Controls<T> = Map<T extends KeyCodes ? T : string, boolean>;

export interface EntitySettings {
    position: Vector;
    speed: Vector;
    elasticity: number;
    mass: number;
    acceleration: Vector;
    accelerationFactor: number;
    angle: number;
    rotationFactor: number;
    friction: number;
    id: string;
    DEBUG?: boolean;
    vertexes?: Vector[];
    direction?: Vector;
    components?: Shape[];
    color?: string;
    strokeColor?: string;
}
