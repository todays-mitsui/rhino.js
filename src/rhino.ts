import { Runner, Render, World, Body, Engine } from 'matter-js';
import { createWalls } from './body/wall';

export function rhinoCanvas(elem: HTMLDivElement, dice: Body) {
  const cw = elem.clientWidth;
  const ch = elem.clientHeight;

  const engine = Engine.create();

  const walls = createWalls(cw, ch);
  World.add(engine.world, [
    ...Object.values(walls),
    dice,
  ]);

  const render = Render.create({
    element: elem,
    engine,
    options: {
      width: cw,
      height: ch,
      wireframes: false,
      background: 'transparent',
    },
  })
  Render.run(render);

  const runner = Runner.create();
  Runner.run(runner, engine);

  return { engine, render, runner, ground: walls.bottom };
}
