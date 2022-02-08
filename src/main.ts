import { Events } from 'matter-js';
import { DeviceMotion } from './devicemotion';
import { rhinoCanvas } from './rhino';
import { createDice, setVelocity, changeTexture } from './body/dice';
// import { texture } from './texture';
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

  const dice = createDice(cw / 2, ch / 6);

  /* @ts-ignore */
  const { engine, render, runner, ground } = rhinoCanvas(app, dice);

  app.addEventListener('click', () => {
    setVelocity(dice);
  });

  const textureMap = new Map([
    [1, '/img/dice-1.png'],
    [2, '/img/dice-2.png'],
    [3, '/img/dice-3.png'],
    [4, '/img/dice-4.png'],
    [5, '/img/dice-5.png'],
    [6, '/img/dice-6.png'],
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
