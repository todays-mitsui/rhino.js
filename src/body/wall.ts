import { Bodies } from 'matter-js';

export function createWalls(clientWidth: number, clientHeight: number) {
  const margin = 2;
  const thickness = 20;

  const top = Bodies.rectangle(
    clientWidth / 2,
    -(thickness / 2 + margin),
    clientWidth + 2 * margin,
    thickness,
    { isStatic: true }
  );

  const left = Bodies.rectangle(
    -(thickness / 2 + margin),
    clientHeight / 2,
    thickness,
    clientHeight + 2 * margin,
    { isStatic: true }
  );

  const bottom = Bodies.rectangle(
    clientWidth / 2,
    clientHeight - thickness,
    clientWidth + 2 * margin,
    thickness * 2,
    {
      isStatic: true,
      render: {
        fillStyle: '#000000',
      },
    }
  );

  const right = Bodies.rectangle(
    clientWidth + thickness / 2 + margin,
    clientHeight / 2,
    thickness,
    clientHeight + 2 * margin,
    { isStatic: true }
  );

  return { top, left, bottom, right };
}
