export function texture(n: number) {
  const texts = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const canvas = document.createElement('canvas');
  canvas.width = 60;
  canvas.height = 60;

  const ctx = canvas.getContext('2d')!;
  ctx.font = '74px sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0)';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(texts[n], 30, 30);

  const url = canvas.toDataURL()!;

  canvas.remove();

  return url;
}
