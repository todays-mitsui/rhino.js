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

  const dice = createDice(cw / 2, ch / 3);

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

  const onAcceleration = throttle((norm) => { setVelocity(dice, null, null, norm); }, 1200);
  devicemotion.onDeviceMotion(() => {
    if (devicemotion.enable) {
      const { norm } = devicemotion.acceleration;
      if (norm > 1) { onAcceleration(norm * 0.15); }
    }
  });
}
