import { Vector } from '../Vector';
import { Controls, EntitySettings, KeyCodes } from './types';

export class Entity {
    position: Vector;
    accelerationFactor: number;
    speed: Vector;
    acceleration: Vector;
    friction: number;
    id: string;
    elasticity: number;
    mass: number;
    inverseMass: number;
    protected DEBUG: boolean;

    constructor({
        position,
        speed,
        id,
        DEBUG = false,
        accelerationFactor,
        acceleration,
        friction,
        elasticity,
        mass
    }: EntitySettings) {
        this.position = position;
        this.speed = speed;
        this.id = id;
        this.DEBUG = DEBUG;
        this.accelerationFactor = accelerationFactor;
        this.acceleration = acceleration;
        this.friction = friction;
        this.elasticity = elasticity;
        this.mass = mass;

        this.inverseMass = this.mass ? 1 / this.mass : 0;
    }

    drawEntity(_ctx: CanvasRenderingContext2D) {
        throw new Error('Method not implemented: drawPlayer');
    }

    handleControls(_controlMap: Controls<KeyCodes>) {
        throw new Error('Method not implemented: handleControls');
    }

    reposition() {
        throw new Error('Method not implemented: reposition');
    }
}
