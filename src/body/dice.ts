import { Bodies, Body } from 'matter-js';
import { nextPips, Pips } from '../physics';
import { nextVelocity } from '../physics';
// import { texture } from './texture';

export function createDice(x: number, y: number, size: number = 30): Body {
  const dice = Bodies.rectangle(
    x, y, size, size,
    {
      angle: 1,           // 初期角度
      restitution: 0.8,   // 反発係数
      friction: 0.05,     // 摩擦係数
      render: {
        sprite: {
          texture: '/img/dice-6.png',
          xScale: 0.206897,
          yScale: 0.206897,
        },
      }
    }
  );

  setVelocity(dice, null, +4);

  return dice;
}

export function setVelocity(
  body: Body,
  x: number|null = null,
  y: number|null = null,
  angular: number|null = null,
) {
  if (x == null || y == null || angular == null) {
    const { x: _x, y: _y, angular: _angular} = nextVelocity();

    x = x || _x;
    y = y || _y;
    angular = angular || _angular;
  }

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
