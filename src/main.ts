import { Events } from 'matter-js';
import { rhinoCanvas } from './rhino';
import { createDice, setVelocity, changeTexture } from './body/dice';
import { texture } from './texture';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
const cw = app.clientWidth;
const ch = app.clientHeight;

const dice = createDice(cw / 2, ch / 4);

const { engine, render, runner, ground } = rhinoCanvas(app, dice);

app.addEventListener('click', () => {
  setVelocity(dice);
});

const textureMap = new Map([
  [1, texture(1)],
  [2, texture(2)],
  [3, texture(3)],
  [4, texture(4)],
  [5, texture(5)],
  [6, texture(6)],
]);

Events.on(engine, 'beforeUpdate', changeTexture(dice, textureMap));

document.querySelector<HTMLButtonElement>('#fill')!
  .addEventListener('click', () => {
    ground.render!.fillStyle = '#000000';
    ground.render!.lineWidth = 0;
    ground.render!.strokeStyle = 'transparent';
  });

document.querySelector<HTMLButtonElement>('#line')!
  .addEventListener('click', () => {
    ground.render!.fillStyle = 'transparent';
    ground.render!.lineWidth = 0.5;
    ground.render!.strokeStyle = '#000000';
  });

document.querySelector<HTMLButtonElement>('#transparent')!
  .addEventListener('click', () => {
    ground.render!.fillStyle = 'transparent';
    ground.render!.lineWidth = 0;
    ground.render!.strokeStyle = 'transparent';
  });
