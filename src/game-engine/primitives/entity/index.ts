import { Vector } from '../../physics/vector';
import { Shape } from '../shape';
import { Controls, EntitySettings, KeyCodes } from './types';

export class Entity {
    position: Vector;
    speed: Vector;
    acceleration: Vector;
    protected vertexes: Vector[];

    components: Shape[];

    accelerationFactor: number;
    friction: number;
    elasticity: number;
    mass: number;
    inverseMass: number;
    inverseInertia: number;
    inertia: number;
    angleSpeed: number;
    angle: number;
    rotationFactor: number;
    angularFriction: number;
    maxSpeed: number;
    layer: number;

    id: string;

    remove: boolean;
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
        vertexes,
        angularFriction,
        maxSpeed,
        layer
    }: EntitySettings) {
        this.position = position ?? Vector.origin();
        this.speed = speed ?? Vector.origin();
        this.mass = mass ?? 0;
        this.inverseMass = this.mass ? 1 / this.mass : 0;
        this.inertia = 0;
        this.inverseInertia = this.inertia ? 1 / this.inertia : 0;
        this.elasticity = elasticity ?? 1;

        this.accelerationFactor = accelerationFactor ?? 0;
        this.acceleration = acceleration ?? Vector.origin();
        this.friction = friction ?? 0;
        this.angularFriction = angularFriction ?? 0;
        this.angleSpeed = 0;
        this.rotationFactor = rotationFactor ?? 0;
        this.angle = angle ?? 0;
        this.maxSpeed = maxSpeed ?? Infinity;
        this.layer = layer ?? 0;

        this.vertexes = vertexes ?? [];
        this.components = [];
        this.id = id ?? Math.random().toString(36).slice(2, 9);
        this.DEBUG = DEBUG;
        this.remove = false;
    }

    handlePressedKeys(_pressedKeys: Controls<KeyCodes>) {}

    reposition() {
        this.acceleration = this.acceleration.unit().multiply(this.accelerationFactor);
        this.speed = this.speed.add(this.acceleration).multiply(1 - this.friction);
        this.angleSpeed *= 1 - this.angularFriction;

        if (this.speed.magnitude() > this.maxSpeed) {
            this.speed = this.speed.unit().multiply(this.maxSpeed);
        }
    }

    render(_ctx: CanvasRenderingContext2D) {
        this.components.forEach((component) => component.draw(_ctx));
    }

    removeNextFrame() {
        this.remove = true;
    }
}
