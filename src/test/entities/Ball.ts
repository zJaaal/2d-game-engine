import { Entity } from '../../game-engine/entity';
import { Controls } from '../../game-engine/entity/types';
import { Vector } from '../../game-engine/physics/Vector';
import { BallSettings, FULL_DEGREES, BallControlMap } from './types';

export class Ball extends Entity {
    radius: number;
    startAngle: number;
    endAngle: number;
    color: string;
    strokeColor: string;

    constructor({
        position,
        speed,
        id,
        accelerationFactor,
        acceleration,
        friction,
        DEBUG,
        mass,
        elasticity,
        rotationFactor,
        angle,
        radius,
        startAngle,
        endAngle,
        color,
        strokeColor
    }: BallSettings) {
        super({
            position,
            speed,
            id,
            accelerationFactor,
            acceleration,
            friction,
            DEBUG,
            mass,
            elasticity,
            angle,
            rotationFactor
        });

        this.radius = radius;
        this.startAngle = startAngle ?? 0;
        this.endAngle = endAngle ?? FULL_DEGREES;
        this.color = color ?? 'black';
        this.strokeColor = strokeColor ?? 'black';
    }

    override drawEntity(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.radius, this.startAngle, this.endAngle);

        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();

        if (this.DEBUG) {
            ctx.beginPath();
            this.acceleration.unit().draw({
                x: this.position.x,
                y: this.position.y,
                color: 'blue',
                scalar: 50,
                ctx
            });

            this.speed.draw({
                x: this.position.x,
                y: this.position.y,
                color: 'green',
                scalar: 10,
                ctx
            });
        }
    }

    override handleControls(controlMap: Controls<BallControlMap>): void {
        const UP = controlMap.get(BallControlMap.UP) || controlMap.get(BallControlMap.ALT_UP);
        const DOWN = controlMap.get(BallControlMap.DOWN) || controlMap.get(BallControlMap.ALT_DOWN);
        const LEFT = controlMap.get(BallControlMap.LEFT) || controlMap.get(BallControlMap.ALT_LEFT);
        const RIGHT =
            controlMap.get(BallControlMap.RIGHT) || controlMap.get(BallControlMap.ALT_RIGHT);

        if (UP) {
            this.acceleration.y = -this.accelerationFactor;
        }

        if (DOWN) {
            this.acceleration.y = this.accelerationFactor;
        }

        if (LEFT) {
            this.acceleration.x = -this.accelerationFactor;
        }

        if (RIGHT) {
            this.acceleration.x = this.accelerationFactor;
        }

        if (!UP && !DOWN) {
            this.acceleration.y = 0;
        }

        if (!LEFT && !RIGHT) {
            this.acceleration.x = 0;
        }
    }

    override reposition() {
        this.acceleration = this.acceleration.unit().multiply(this.accelerationFactor);
        this.speed = this.speed.add(this.acceleration);
        this.speed = this.speed.multiply(1 - this.friction);

        this.position = this.position.add(this.speed);
    }
}

export function detectCollision(b1: Ball, b2: Ball) {
    // The distance between the two balls is less than the sum of their radius
    return b1.radius + b2.radius > b1.position.subtract(b2.position).magnitude();
}

export function penetrationResolution(b1: Ball, b2: Ball) {
    let distanceBetween = b1.position.subtract(b2.position);

    // The depth of the collision is the sum of the radius minus the distance between the two balls
    let collisionDepth = b1.radius + b2.radius - distanceBetween.magnitude();

    // The collision resolution is the unit vector of the distance between the two balls multiplied by half the collision depth
    let penetrationResolution = distanceBetween
        .unit()
        .multiply(collisionDepth / (b1.inverseMass + b2.inverseMass));

    // Move the balls apart by the collision resolution
    b1.position = b1.position.add(penetrationResolution.multiply(b1.inverseMass));
    b2.position = b2.position.add(penetrationResolution.multiply(-b2.inverseMass));
}

// I need to understand this better, I remember a bit about this from my physics classes
export function collisionResolution(b1: Ball, b2: Ball) {
    let normal = b1.position.subtract(b2.position).unit();
    let relativeVelocity = b1.speed.subtract(b2.speed);
    let separatingVelocity = Vector.dot(relativeVelocity, normal);

    let newSeparatingVelocity = -separatingVelocity * Math.min(b1.elasticity, b2.elasticity);

    let separatingVelocityDiff = newSeparatingVelocity - separatingVelocity;

    let impulse = separatingVelocityDiff / (b1.inverseMass + b2.inverseMass);

    let impulseVector = normal.multiply(impulse);

    b1.speed = b1.speed.add(impulseVector.multiply(b1.inverseMass));
    b2.speed = b2.speed.add(impulseVector.multiply(-b2.inverseMass));
}
