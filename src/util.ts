export function throttle(callback: () => void, interval: number = 500) {
  let lastTime = Date.now() - interval;
  return () => {
    if (lastTime + interval < Date.now()) {
      lastTime = Date.now();
      callback();
    }
  };
}
