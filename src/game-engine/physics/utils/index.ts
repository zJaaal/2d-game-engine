import { Entity } from '../../entity';
import { Vector } from '../vector';
import { SeparationAxisTheorem } from './types';

export function separationAxisTheorem(
    firtsEntity: Entity,
    secondEntity: Entity
): SeparationAxisTheorem {
    let minOverlap = Infinity;
    let smallestAxis = undefined;
    let vertexEntity;

    const axesByEntity = [firtsEntity.getAxes(secondEntity), secondEntity.getAxes(firtsEntity)];

    for (let [i, axes] of axesByEntity.entries()) {
        for (let axis of axes) {
            let projection1 = projectShapeOntoAxis(axis, firtsEntity);
            let projection2 = projectShapeOntoAxis(axis, secondEntity);

            let overlap =
                Math.min(projection1.max, projection2.max) -
                Math.max(projection1.min, projection2.min);

            if (overlap < 0) {
                return {
                    collide: false
                };
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

            if (overlap < minOverlap) {
                minOverlap = overlap;
                smallestAxis = axis;

                if (!i) {
                    vertexEntity = secondEntity;

                    if (projection1.max > projection2.max) smallestAxis = axis.multiply(-1);
                } else {
                    vertexEntity = firtsEntity;

                    if (projection1.max < projection2.max) smallestAxis = axis.multiply(-1);
                }
            }
        }
    }

    let contactVertex: Vector = projectShapeOntoAxis(smallestAxis!, vertexEntity!).collideVertex;

    return {
        collide: true,
        contactVertex,
        smallestAxis,
        minOverlap
    };
}

export function projectShapeOntoAxis(axis: Vector, entity: Entity) {
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

export function closestVertexToPoint(entity: Entity, point: Vector) {
    let minDistance = Infinity;

    const vertexes = entity.getVertexes();

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
