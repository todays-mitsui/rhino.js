import { Events } from 'matter-js';
import { DeviceMotion } from './devicemotion';
import { rhinoCanvas } from './rhino';
import { createDice, setVelocity, changeTexture } from './body/dice';
import { texture } from './texture';
import { throttle } from './util';
import './style.css';

const devicemotion = new DeviceMotion();
const start = document.querySelector<HTMLDivElement>('.start')!;
start.addEventListener('click', async () => {
  const state = await devicemotion.requestPermission();
  start.remove();

  if (state) {
    window.addEventListener('devicemotion', event => {
      devicemotion.hander(event);
    });
  }

  main(devicemotion);
});

function main(devicemotion: DeviceMotion) {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const cw = app.clientWidth;
  const ch = app.clientHeight;

  const dice = createDice(cw / 2, ch / 4);

  /* @ts-ignore */
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

  const onAcceleration = throttle((x, y) => { setVelocity(dice, x, y); }, 2000);
  devicemotion.onDeviceMotion(() => {
    if (devicemotion.enable) {
      const { x, y, norm } = devicemotion.acceleration;
      if (norm > 1) {
        console.log({ x, y, norm });
        onAcceleration(x, y);
      }
    }
  });
}
