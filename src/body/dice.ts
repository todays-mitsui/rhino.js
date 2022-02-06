import { Bodies, Body } from 'matter-js';
import { nextPips, Pips } from '../physics';
import { nextVelocity } from '../physics';
import { texture } from '../texture';

export function createDice(x: number, y: number, size: number = 30): Body {
  const dice = Bodies.rectangle(
    x, y, size, size,
    {
      angle: 1,           // 初期角度
      restitution: 0.8,   // 反発係数
      friction: 0.05,     // 摩擦係数
      render: {
        sprite: {
          texture: texture(6),
          xScale: 0.5,
          yScale: 0.5,
        },
      }
    }
  );

  setVelocity(dice);

  return dice;
}

export function setVelocity(body: Body) {
  const { x, y, angular} = nextVelocity();
  Body.setVelocity(body, { x, y });
  Body.setAngularVelocity(body, angular);
}

export function changeTexture(
  body: Body,
  textureMap: Map<number, string>,
) {
  let currentOrthant = 0;
  let currentPips: Pips = 1;

  return () => {
    const orthant = Math.floor(body.angle * 2 / Math.PI + 0.5) % 4;

    if (currentOrthant == orthant) { return; }

    const pips = nextPips(currentPips);
    body.render!.sprite!.texture = textureMap.get(pips)!;

    currentOrthant = orthant;
    currentPips = pips;
  };
}
