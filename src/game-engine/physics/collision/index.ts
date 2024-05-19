import { Entity } from '../../entity';
import { Shape } from '../../shape';

import { Vector } from '../vector';
import { CollisionSettings, SeparationAxisTheorem } from './types';

export class Collision {
    entityA: Entity;
    entityB: Entity;
    penetrationDepth: number;
    normal: Vector;
    collisionPoint: Vector;

    constructor({ entityA, entityB, penetrationDepth, normal, collisionPoint }: CollisionSettings) {
        this.entityA = entityA;
        this.entityB = entityB;
        this.penetrationDepth = penetrationDepth;
        this.normal = normal;
        this.collisionPoint = collisionPoint;
    }

    penetrationResolution() {
        let penentrationResolution = this.normal.multiply(
            this.penetrationDepth / (this.entityA.inverseMass + this.entityB.inverseMass)
        );

        this.entityA.components[0].position = this.entityA.components[0].position.add(
            penentrationResolution.multiply(this.entityA.inverseMass)
        );
        this.entityB.components[0].position = this.entityB.components[0].position.add(
            penentrationResolution.multiply(-this.entityB.inverseMass)
        );
    }

    collisionResponse() {
        const entities = [
            {
                entity: this.entityA,
                point: this.collisionPoint
            },
            {
                entity: this.entityB,
                point: this.collisionPoint
            }
        ];
        const [entityA, entityB] = entities.map(({ entity, point }) => {
            // 1. Closing Velocity

            let collisionArm = point.subtract(entity.components[0].position);
            let rotationalVelocity = new Vector(
                -entity.angleSpeed * collisionArm.y,
                entity.angleSpeed * collisionArm.x
            );
            let closingVelocity = entity.speed.add(rotationalVelocity);
            // 2. Impulse augmentation
            let impulseAugmentation = Vector.cross(collisionArm, this.normal);
            impulseAugmentation = impulseAugmentation ** 2 * entity.inverseInertia;

            return {
                closingVelocity,
                impulseAugmentation,
                collisionArm
            };
        });

        let relativeVelocity = entityA.closingVelocity.subtract(entityB.closingVelocity);

        let separatingVelocity = Vector.dot(relativeVelocity, this.normal);

        let newSeparatingVelocity =
            -separatingVelocity * Math.min(this.entityA.elasticity, this.entityB.elasticity);

        let separatingVelocityDiff = newSeparatingVelocity - separatingVelocity;

        let impulse =
            separatingVelocityDiff /
            (this.entityA.inverseMass +
                this.entityB.inverseMass +
                entityA.impulseAugmentation +
                entityB.impulseAugmentation);

        let impulseVector = this.normal.multiply(impulse);

        // 3. Calculate the new speed and angle speed
        this.entityA.speed = this.entityA.speed.add(
            impulseVector.multiply(this.entityA.inverseMass)
        );
        this.entityB.speed = this.entityB.speed.add(
            impulseVector.multiply(-this.entityB.inverseMass)
        );
        this.entityA.angleSpeed +=
            Vector.cross(entityA.collisionArm, impulseVector) * this.entityA.inverseInertia;
        this.entityB.angleSpeed -=
            Vector.cross(entityB.collisionArm, impulseVector) * this.entityB.inverseInertia;
    }

    static separationAxisTheorem(shapeA: Shape, shapeB: Shape): SeparationAxisTheorem | undefined {
        let minPenetrationDepth = Infinity;
        let smallestAxis = new Vector(0, 0);
        let vertexShape = shapeA;

        const axesByEntity = [shapeA.getAxes(shapeB), shapeB.getAxes(shapeA)];

        for (let [i, axes] of axesByEntity.entries()) {
            for (let axis of axes) {
                let projection1 = this.projectShapeOntoAxis(axis, shapeA);
                let projection2 = this.projectShapeOntoAxis(axis, shapeB);

                let overlap =
                    Math.min(projection1.max, projection2.max) -
                    Math.max(projection1.min, projection2.min);

                if (overlap < 0) {
                    return undefined;
                }

                // If the projections are containing each other
                if (
                    (projection1.max > projection2.max && projection1.min < projection2.min) ||
                    (projection1.max < projection2.max && projection1.min > projection2.min)
                ) {
                    let mins = Math.abs(projection1.min - projection2.min);
                    let maxs = Math.abs(projection1.max - projection2.max);

                    if (mins < maxs) {
                        overlap += mins;
                    } else {
                        overlap += maxs;
                        axis = axis.multiply(-1);
                    }
                }

                if (overlap < minPenetrationDepth) {
                    minPenetrationDepth = overlap;
                    smallestAxis = axis;

                    if (!i) {
                        vertexShape = shapeB;

                        if (projection1.max > projection2.max) smallestAxis = axis.multiply(-1);
                    } else {
                        vertexShape = shapeA;

                        if (projection1.max < projection2.max) smallestAxis = axis.multiply(-1);
                    }
                }
            }
        }

        let contactVertex: Vector = this.projectShapeOntoAxis(
            smallestAxis,
            vertexShape
        ).collideVertex;

        // If the vertex is from the second shape, invert the axis
        if (vertexShape === shapeB) smallestAxis = smallestAxis.multiply(-1);

        return {
            contactVertex,
            smallestAxis,
            penetrationDepth: minPenetrationDepth
        };
    }

    private static projectShapeOntoAxis(axis: Vector, entity: Shape) {
        let vertexes = entity.getVertexes(axis);

        let min = Vector.dot(axis, vertexes[0]);

        let max = min;

        let collideVertex = vertexes[0];

        for (let i = 0; i < vertexes.length; i++) {
            let projection = Vector.dot(axis, vertexes[i]);

            if (projection < min) {
                min = projection;
                collideVertex = vertexes[i];
            }

            if (projection > max) {
                max = projection;
            }
        }

        return { min, max, collideVertex };
    }

    static closestVertexToPoint(shape: Shape, point: Vector) {
        let minDistance = Infinity;

        const vertexes = shape.getVertexes();

        let closestVertex = vertexes[0];

        for (let vertex of vertexes) {
            let distance = vertex.subtract(point).magnitude();

            if (distance < minDistance) {
                minDistance = distance;
                closestVertex = vertex;
            }
        }

        return closestVertex;
    }
}
