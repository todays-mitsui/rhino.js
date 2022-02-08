import { Bodies, IChamferableBodyDefinition } from 'matter-js';

export function createWalls(clientWidth: number, clientHeight: number) {
  const xPadding = 12;
  const yPadding = 12;
  const thickness = 20;

  const options: IChamferableBodyDefinition = {
    isStatic: true,
    render: {
      fillStyle: '#ffffff',
    },
  }

  const top = Bodies.rectangle(
    clientWidth / 2,
    yPadding - thickness / 2,
    clientWidth,
    thickness,
    options
  );

  const left = Bodies.rectangle(
    xPadding - thickness / 2,
    clientHeight / 2,
    thickness,
    clientHeight,
    {
      ...options,
      restitution: 0.9,
    }
  );

  const bottom = Bodies.rectangle(
    clientWidth / 2,
    clientHeight - yPadding + thickness / 2,
    clientWidth,
    thickness,
    options
  );

  const right = Bodies.rectangle(
    clientWidth - xPadding + thickness / 2,
    clientHeight / 2,
    thickness,
    clientHeight,
    {
      ...options,
      restitution: 0.9,
    }
  );

  return { top, left, bottom, right };
}
