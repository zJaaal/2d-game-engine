import { Entity } from '../game-engine/Entity';
import { EntityBall } from './Ball';

export function genEntityBalls(n: number, canvasWidth: number, canvasHeight: number): Entity[] {
    const balls = [];
    for (let i = 0; i < n; i++) {
        balls.push(
            new EntityBall({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                speed: Math.random() * 5,
                id: `ball-${i}`,
                radius: Math.random() * 10 + 5,
                startAngle: 0,
                endAngle: Math.PI * 2,
                color: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
                strokeColor: `rgb(${Math.random() * 255},${Math.random() * 255},${
                    Math.random() * 255
                })`
            })
        );
    }
    return balls;
}
