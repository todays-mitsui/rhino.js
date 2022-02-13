import { Runner, Render, World, Engine } from 'matter-js';
import { createWalls } from './body/wall';
import { Dice } from './body/Dice';

export class Rhino {
  private elem: HTMLDivElement;
  private clientWidth: number;
  private clientHeight: number;

  private engine: Engine;
  private render: Render;
  private runner: Runner;

  private dices: Dice[] = [];

  public constructor(elem: HTMLDivElement) {
    this.elem = elem;
    const cw = this.clientWidth = elem.clientWidth;
    const ch = this.clientHeight = elem.clientHeight;

    this.engine = Engine.create();

    const walls = createWalls(cw, ch);
    World.add(this.engine.world, Object.values(walls));

    this.render = Render.create({
      element: elem,
      engine: this.engine,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent',
      },
    })
    Render.run(this.render);

    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
  }

  public putDices(numDices: number) {
    if (this.dices.length == numDices) { return; }

    if (this.dices.length > numDices) {
      this.removeDice(this.dices.length - numDices);
    } else if (this.dices.length < numDices) {
      this.addDice(numDices - this.dices.length);
    }
  }

  public addDice(numDices: number) {
    if (numDices < 0) { throw new Error(); }

    for (let i = 0; i < numDices; i++) {
      const dice = new Dice(this.clientWidth / 2, this.clientHeight / 6);
      dice.join(this.elem, this.engine);
      this.dices.push(dice);
    }
  }

  public removeDice(numDices: number) {
    const removedDices = this.dices.splice(0, numDices);
    for (const dice of removedDices) {
      dice.disappear(this.elem, this.engine);
    }
  }
}
