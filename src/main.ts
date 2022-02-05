import { Runner, Render, World, Body, Engine, Events } from 'matter-js';
import { createWalls } from './body/wall';
import { createDice } from './body/dice';
import { newVelocity } from './newVelocity';
import { texture } from './texture';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

const cw = app.clientWidth;
const ch = app.clientHeight;

const dice = createDice(cw / 2, ch / 4);

const engine = Engine.create();
World.add(engine.world, [
  ...createWalls(cw, ch),
  dice,
]);

const render = Render.create({
  element: app,
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

app.addEventListener('click', () => {
  const { xVelocity: x, yVelocity: y, angularVelocity } = newVelocity();

  Body.setVelocity(dice, { x, y });
  Body.setAngularVelocity(dice, angularVelocity);
});

const textureMap = new Map([
  [1, texture(1)],
  [2, texture(2)],
  [3, texture(3)],
  [4, texture(4)],
  [5, texture(5)],
  [6, texture(6)],
]);

let prevOrthant = 0;
Events.on(engine, 'beforeUpdate', () => {
  const orthant = Math.floor(dice.angle * 2 / Math.PI + 0.5) % 4;

  if (prevOrthant == orthant) { return; }

  prevOrthant = orthant;

  const next = Math.floor(Math.random() * 6) + 1;
  dice.render!.sprite!.texture = textureMap.get(next)!;
});
