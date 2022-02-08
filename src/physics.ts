export function nextVelocity() {
  const x = Math.random() * 10 - 5;
  const y = - Math.random() * 12 - 8;
  const angular = sign() * binomial(100, 0.2) * 0.01;

  return { x, y, angular };
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

// ========================================================================== //

export type Pips = 1 | 2 | 3 | 4 | 5 | 6;

export function nextPips(current: Pips): Pips {
  const dual = 7 - current;

  const options = Array.from(Array(6), (_, i) => i + 1)
    .filter(i => ![current, dual].includes(i)) as Pips[];

  return choose(options);
}

function choose<T>(options: T[]): T {
  const i = Math.floor(Math.random() * options.length);

  return options[i];
}
