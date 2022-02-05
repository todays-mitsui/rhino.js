export function newVelocity() {
  const xVelocity = Math.random() * 10 - 5;
  const yVelocity = - Math.random() * 10 - 5;
  const angularVelocity = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.1 + 0.1);

  return {
    xVelocity,
    yVelocity,
    angularVelocity,
  };
}
