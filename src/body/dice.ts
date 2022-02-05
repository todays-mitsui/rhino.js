import { Bodies, Body } from 'matter-js';
import { texture } from '../texture';

export function createDice(x: number, y: number, size: number = 30): Body {
  const angularVelocity = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.1 + 0.1);
  const xVelocity = Math.random() * 5 - 2.5;
  const yVelocity = - Math.random() * 5 + 5;

  const dice = Bodies.rectangle(
    x, y, size, size,
    {
      angle: 1,
      restitution: 0.75,
      render: {
        sprite: {
          texture: texture(6),
          xScale: 0.5,
          yScale: 0.5,
        },
      }
    }
  );
  Body.setAngularVelocity(dice, angularVelocity);
  Body.setVelocity(dice, { x: xVelocity, y: yVelocity });

  return dice;
}
