import { devicemotion } from './devicemotion';
import { Rhino } from './rhino';
import './style.css';

const dices = +(localStorage.getItem('dices') || 1);

const button1 = document.querySelector<HTMLInputElement>('#x1')!;
const button2 = document.querySelector<HTMLInputElement>('#x2')!;
const button3 = document.querySelector<HTMLInputElement>('#x3')!;
const twitter = document.querySelector<HTMLAnchorElement>('#twitter')!;

switch (dices) {
  case 1: button1.checked = true; break;
  case 2: button2.checked = true; break;
  case 3: button3.checked = true; break;
}

const start = document.querySelector<HTMLDivElement>('.start')!;
start.addEventListener('click', async () => {
  await devicemotion.init();
  start.remove();
  main();
});

function main() {
  const app = document.querySelector<HTMLDivElement>('#app')!;

  /* @ts-ignore */
  const rhino = new Rhino(app);

  rhino.putDices(dices);

  button1.addEventListener('change', () => {
    rhino.putDices(1);
    localStorage.setItem('dices', '1');
  });
  button2.addEventListener('change', () => {
    rhino.putDices(2);
    localStorage.setItem('dices', '2');
  });
  button3.addEventListener('change', () => {
    rhino.putDices(3);
    localStorage.setItem('dices', '3');
  });

  twitter.addEventListener('click', () => {
    const url = 'https://todays-mitsui.github.io/rhino.js/';
    twitter.href = `http://twitter.com/share?url=${url}&text=${rhino.dices + '\naaa'}`;
  })
}
