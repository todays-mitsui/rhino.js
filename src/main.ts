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

  const dice = createDice(cw / 2, ch / 6);

  /* @ts-ignore */
  const { engine, render, runner, ground } = rhinoCanvas(app, dice);

  app.addEventListener('click', () => {
    setVelocity(dice);
  });

  const textureMap = new Map([
    [1, texture.get(1)!],
    [2, texture.get(2)!],
    [3, texture.get(3)!],
    [4, texture.get(4)!],
    [5, texture.get(5)!],
    [6, texture.get(6)!],
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

// const c = document.querySelector<HTMLCanvasElement>('#c')!;
// c.width = 56;
// c.height = 56;
// const ctx = c.getContext('2d')!;
// ctx.font = '80px sans-serif';
// ctx.fillStyle = 'rgba(0, 0, 0)';
// ctx.textBaseline = 'middle';
// ctx.textAlign = 'center';
// ctx.fillText('⚄', 28, 25.5);
// const u = c.toDataURL()!;
// console.log(u);
