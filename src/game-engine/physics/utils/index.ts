import { Shape } from '../../shape';
import { Vector } from '../vector';
import { SeparationAxisTheorem } from './types';

export function separationAxisTheorem(
    firstShape: Shape,
    secondShape: Shape
): SeparationAxisTheorem | undefined {
    let minOverlap = Infinity;
    let smallestAxis = new Vector(0, 0);
    let vertexShape = firstShape;

    const axesByEntity = [firstShape.getAxes(secondShape), secondShape.getAxes(firstShape)];

    for (let [i, axes] of axesByEntity.entries()) {
        for (let axis of axes) {
            let projection1 = projectShapeOntoAxis(axis, firstShape);
            let projection2 = projectShapeOntoAxis(axis, secondShape);

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

            if (overlap < minOverlap) {
                minOverlap = overlap;
                smallestAxis = axis;

                if (!i) {
                    vertexShape = secondShape;

                    if (projection1.max > projection2.max) smallestAxis = axis.multiply(-1);
                } else {
                    vertexShape = firstShape;

                    if (projection1.max < projection2.max) smallestAxis = axis.multiply(-1);
                }
            }
        }
    }

    let contactVertex: Vector = projectShapeOntoAxis(smallestAxis, vertexShape).collideVertex;

    return {
        contactVertex,
        smallestAxis,
        minOverlap
    };
}

export function projectShapeOntoAxis(axis: Vector, entity: Shape) {
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

export function closestVertexToPoint(shape: Shape, point: Vector) {
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
