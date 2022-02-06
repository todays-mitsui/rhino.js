export function throttle(callback: (...args: any[]) => void, interval: number = 500) {
  let lastTime = Date.now() - interval;
  return (...args: any[]) => {
    if (lastTime + interval < Date.now()) {
      lastTime = Date.now();
      callback(...args);
    }
  };
}
