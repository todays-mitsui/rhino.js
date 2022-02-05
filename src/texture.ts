export function texture(n: number) {
  const texts = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const canvas = document.createElement('canvas');
  canvas.width = 30;
  canvas.height = 30;

  const ctx = canvas.getContext('2d')!;
  ctx.font = '46px sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0)';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(texts[n], 15, 15);

  const url = canvas.toDataURL()!;

  canvas.remove();

  return url;
}
