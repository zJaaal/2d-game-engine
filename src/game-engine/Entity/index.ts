import { Vector } from '../physics/vector';
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
        vertexes,
        direction
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
        this.angle = angle;
        this.rotationFactor = rotationFactor;

        this.inverseMass = this.mass ? 1 / this.mass : 0;
        this.vertexes = vertexes ?? [];
        this.components = [];
    }

    handlePressedKeys(_pressedKeys: Controls<KeyCodes>) {}

    reposition() {}

    draw(_ctx: CanvasRenderingContext2D) {}

    getAxes(entity?: Entity): Vector[] {
        return this.components.flatMap((component) => component.getAxes(entity));
    }

    getVertexes(axis?: Vector): Vector[] {
        return this.components.flatMap((component) => component.getVertexes(axis));
    }
}
