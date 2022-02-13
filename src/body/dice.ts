import { Engine, World, Bodies, Body, Events } from 'matter-js';
import { pip6, texture as map } from './texture';
import { devicemotion } from '../devicemotion';
import { throttle } from '../util';

type Pips = 1 | 2 | 3 | 4 | 5 | 6;

export class Dice {
  private body: Body;
  private texture = map;

  private currentOrthant = 0;
  private currentPips: Pips = 1

  public constructor(x: number, y: number) {
    this.body = Bodies.rectangle(
      x, y, 28, 28,
      {
        angle: 1,           // 初期角度
        restitution: 0.8,   // 反発係数
        friction: 0.05,     // 摩擦係数
        render: {
          sprite: {
            texture: pip6,
            xScale: 0.5,
            yScale: 0.5,
          },
        }
      }
    );

    this.setVelocity({ y: +4 });
  }

  public join(app: HTMLDivElement, engine: Engine) {
    World.add(engine.world, this.body);

    app.addEventListener('click', this.setVelocity.bind(this) );
    Events.on(engine, 'beforeUpdate', this.changeTexture.bind(this));

    const onAcceleration = this.onAcceleration;
    devicemotion.on(() => {
      if (devicemotion.enable) {
        const { norm } = devicemotion.acceleration;
        if (norm > 1) { onAcceleration(norm * 0.15); }
      }
    });
  }

  public disappear(app: HTMLDivElement, engine: Engine) {
    World.remove(engine.world, this.body);

    app.removeEventListener('click', this.setVelocity);
    Events.off(engine, 'beforeUpdate', this.changeTexture);
    devicemotion.off(this.onAcceleration);
  }

  private changeTexture() {
    if (!this.body) { return; }

    const orthant = Math.floor(this.body.angle * 2 / Math.PI + 0.5) % 4;

    if (this.currentOrthant == orthant) { return; }

    const pips = this.nextPips();
    this.body.render!.sprite!.texture = this.texture.get(pips)!;

    this.currentOrthant = orthant;
    this.currentPips = pips;
  }

  private nextPips() {
    const current = this.currentPips;
    const dual = 7 - current;

    const options = Array.from(Array(6), (_, i) => i + 1)
      .filter(i => ![current, dual].includes(i)) as Pips[];

    return choose(options);
  }

  public setVelocity(velocity: {
    x?: number,
    y?: number,
    angular?: number,
  } = {}) {
    const { x, y, angular } = Object.assign({}, this.nextVelocity(), velocity);

    Body.setVelocity(this.body, { x, y });
    Body.setAngularVelocity(this.body, angular);
  }

  private nextVelocity() {
    const x = sign() * binomial(100, 0.3) * 0.08;
    const y = - Math.random() * 12 - 7;
    const angular = sign() * binomial(100, 0.22) * 0.012;

    return { x, y, angular };
  }

  private get onAcceleration() {
    return throttle((angular: number) => {
      this.setVelocity({ angular });
    }, 1200);
  }
}


function sign() {
  return Math.random() > 0.5 ? 1 : -1;
}

/**
 * 二項分布を生成する
 *
 * @param n 試行回数
 * @param p ベルヌーイ分布の平均
 * @returns 二項分布に従う確率変数
 */
function binomial(n: number, p: number): number {
  let x = 0;

  for (let i = 0; i < n; i++) {
    if (Math.random() < p) {
      x++;
    }
  }

  return x;
}

function choose<T>(options: T[]): T {
  const i = Math.floor(Math.random() * options.length);

  return options[i];
}
