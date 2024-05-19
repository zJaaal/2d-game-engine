import { Vector } from '../../physics/vector';
import { Shape } from '../shape';
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
    inverseInertia: number;
    inertia: number;
    angleSpeed: number;
    angle: number;
    rotationFactor: number;
    protected vertexes: Vector[];
    components: Shape[];
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
        mass,
        angle,
        rotationFactor,
        vertexes
    }: EntitySettings) {
        this.position = position;
        this.speed = speed;
        this.mass = mass;
        this.inverseMass = this.mass ? 1 / this.mass : 0;
        this.inertia = 0;
        this.inverseInertia = this.inertia ? 1 / this.inertia : 0;
        this.elasticity = elasticity;

        this.accelerationFactor = accelerationFactor;
        this.acceleration = acceleration;
        this.friction = friction;
        this.angleSpeed = 0;
        this.rotationFactor = rotationFactor;
        this.angle = angle;

        this.vertexes = vertexes ?? [];
        this.components = [];
        this.id = id;
        this.DEBUG = DEBUG;
    }

    handlePressedKeys(_pressedKeys: Controls<KeyCodes>) {}

    reposition() {}

    draw(_ctx: CanvasRenderingContext2D) {
        this.components.forEach((component) => component.draw(_ctx));
    }
}
