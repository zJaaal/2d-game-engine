import { Ball } from '../../../test/entities/Ball';
import { Capsule } from '../../../test/entities/Capsule';
import { Wall } from '../../../test/entities/Wall';
import { Entity } from '../../entity';
import { Vector } from '../vector';

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

export function closestPointOnLineSegment(point: Vector, wall: Wall) {
    let ballToWallStart = wall.start.subtract(point);

    if (Vector.dot(wall.direction, ballToWallStart) > 0) {
        return wall.start;
    }

    let wallEndToBall = point.subtract(wall.end);

    if (Vector.dot(wall.direction, wallEndToBall) > 0) {
        return wall.end;
    }

    let closestDistanceToWall = Vector.dot(wall.direction, ballToWallStart);
    let closestVector = wall.direction.multiply(closestDistanceToWall);

    return wall.start.subtract(closestVector);
}

export function detectCollisionWithWall(ball: Ball, wall: Wall) {
    let closestPoint = closestPointOnLineSegment(ball.position, wall).subtract(ball.position);

    return closestPoint.magnitude() <= ball.radius;
}

export function penetrationResolutionWithWall(ball: Ball, wall: Wall) {
    let penetrationVector = ball.position.subtract(closestPointOnLineSegment(ball.position, wall));

    let collisionDepth = ball.radius - penetrationVector.magnitude();

    let penetrationResolution = penetrationVector.unit().multiply(collisionDepth);

    ball.position = ball.position.add(penetrationResolution);
}

export function collisionResolutionWithWall(ball: Ball, wall: Wall) {
    let normal = ball.position.subtract(closestPointOnLineSegment(ball.position, wall)).unit();

    let separatingVelocity = Vector.dot(ball.speed, normal);

    let newSeparatingVelocity = -separatingVelocity * ball.elasticity;

    let separatingVelocityDiff = separatingVelocity - newSeparatingVelocity;

    ball.speed = ball.speed.add(normal.multiply(-separatingVelocityDiff));
}

export function closestPointesBetweenLineSegments(c1: Capsule, c2: Capsule) {
    const possibleClosestPairs: { point: Vector; capsule: Capsule }[] = [
        {
            point: c1.start,
            capsule: c2
        },
        {
            point: c1.end,
            capsule: c2
        },
        {
            point: c2.start,
            capsule: c1
        },
        {
            point: c2.end,
            capsule: c1
        }
    ];

    let shortestDistance = Infinity;
    let closestPair: Vector[] = [];

    for (let { point, capsule } of possibleClosestPairs) {
        let closestPoint = closestPointOnLineSegment(point, capsule);

        let distance = closestPoint.subtract(point).magnitude();

        if (distance < shortestDistance) {
            shortestDistance = distance;
            closestPair = [point, closestPoint];
        }
    }

    return closestPair;
}

export function detectCollisionBetweenCapsules(c1: Capsule, c2: Capsule) {
    let [point1, point2] = closestPointesBetweenLineSegments(c1, c2);

    return c1.radius + c2.radius >= point1.subtract(point2).magnitude();
}
export function penetrationResolutionBetweenCapsules(c1: Capsule, c2: Capsule) {
    const [point1, point2] = closestPointesBetweenLineSegments(c1, c2);

    let distanceBetween = point1.subtract(point2);

    // The depth of the collision is the sum of the radius minus the distance between the two
    let collisionDepth = c1.radius + c2.radius - distanceBetween.magnitude();

    // The collision resolution is the unit vector of the distance between the two multiplied by half the collision depth
    let penetrationResolution = distanceBetween
        .unit()
        .multiply(collisionDepth / (c1.inverseMass + c2.inverseMass));

    // Move the two apart by the collision resolution
    c1.position = c1.position.add(penetrationResolution.multiply(c1.inverseMass));
    c2.position = c2.position.add(penetrationResolution.multiply(-c2.inverseMass));
}

export function collisionResolutionBetweenCapsules(c1: Capsule, c2: Capsule) {
    const [point1, point2] = closestPointesBetweenLineSegments(c1, c2);

    let normal = point1.subtract(point2).unit();
    const capsules = [
        {
            capsule: c1,
            point: point1
        },
        {
            capsule: c2,
            point: point2
        }
    ];

    const [firstCapsule, secondCapsule] = capsules.map(({ capsule, point }) => {
        // 1. Closing Velocity
        let collisionArm = point.subtract(capsule.position).add(normal.multiply(capsule.radius));
        let rotationalVelocity = new Vector(
            -capsule.angleSpeed * collisionArm.y,
            capsule.angleSpeed * collisionArm.x
        );
        let closingVelocity = capsule.speed.add(rotationalVelocity);
        // 2. Impulse augmentation
        let impulseAugmentation = Vector.cross(collisionArm, normal);
        impulseAugmentation = impulseAugmentation ** 2 * capsule.inverseInertia;

        return {
            closingVelocity,
            impulseAugmentation,
            collisionArm
        };
    });

    let relativeVelocity = firstCapsule.closingVelocity.subtract(secondCapsule.closingVelocity);
    let separatingVelocity = Vector.dot(relativeVelocity, normal);

    let newSeparatingVelocity = -separatingVelocity * Math.min(c1.elasticity, c2.elasticity);

    let separatingVelocityDiff = newSeparatingVelocity - separatingVelocity;

    let impulse =
        separatingVelocityDiff /
        (c1.inverseMass +
            c2.inverseMass +
            firstCapsule.impulseAugmentation +
            secondCapsule.impulseAugmentation);

    let impulseVector = normal.multiply(impulse);

    // 3. Calculate the new speed and angle speed

    c1.speed = c1.speed.add(impulseVector.multiply(c1.inverseMass));
    c2.speed = c2.speed.add(impulseVector.multiply(-c2.inverseMass));

    c1.angleSpeed += Vector.cross(firstCapsule.collisionArm, impulseVector) * c1.inverseInertia;
    c2.angleSpeed -= Vector.cross(secondCapsule.collisionArm, impulseVector) * c2.inverseInertia;
}

export function separationAxisTheorem(firtsEntity: Entity, secondEntity: Entity) {
    const axesByEntity = [firtsEntity.direction, secondEntity.direction].map((direction) => [
        direction,
        direction.normal()
    ]);

    for (let axes of axesByEntity) {
        for (let axis of axes) {
            let projection1 = projectShapeOntoAxis(axis, firtsEntity);
            let projection2 = projectShapeOntoAxis(axis, secondEntity);

            let overlap =
                Math.min(projection1.max, projection2.max) -
                Math.max(projection1.min, projection2.min);

            if (overlap < 0) {
                return false;
            }
        }
    }

    return true;
}

export function projectShapeOntoAxis(axis: Vector, w: Entity) {
    let min = Vector.dot(axis, w.vertex[0]);

    let max = min;

    for (let i = 1; i < w.vertex.length; i++) {
        let projection = Vector.dot(axis, w.vertex[i]);

        if (projection < min) {
            min = projection;
        } else if (projection > max) {
            max = projection;
        }
    }

    return { min, max };
}
