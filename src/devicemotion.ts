class DeviceMotion {
  private _enable = true;
  private callbacks: ((event: DeviceMotionEvent) => void)[] = [];

  static readonly K = 0.01;

  private ax: number;
  private ay: number;
  private az: number;

  public constructor() {
    this.ax = 0;
    this.ay = 0;
    this.az = 0;
  }

  public async init() {
    if (DeviceMotionEvent == null) { return this._enable = false; }

    if ('requestPermission' in DeviceMotionEvent) {
      this._enable = await this.requestPermission();
    } else {
      this._enable = true;
    }

    if (this._enable) {
      window.addEventListener('devicemotion', event => {
        this.hander(event);
      });
    }

    return this._enable;
  }

  private async requestPermission() {
    /* @ts-ignore */
    const permissionState = await DeviceMotionEvent.requestPermission();

    return permissionState == 'granted';
  }

  private hander(event: DeviceMotionEvent) {
    const K = DeviceMotion.K;

    let { x, y, z } = event.acceleration!;

    if (x == null && y == null && z == null) {
      this._enable = false;
      window.removeEventListener('devicemotion', this.hander);
    }

    this.ax = (1 - K) * this.ax + K * x!;
    this.ay = (1 - K) * this.ay + K * y!;
    this.az = (1 - K) * this.az + K * z!;

    for (let callback of this.callbacks) {
      callback(event);
    }
  }

  public on(callback: (event: DeviceMotionEvent) => void) {
    this.callbacks.push(callback);
  }

  public off(callback: (event: DeviceMotionEvent) => void) {
    this.callbacks = this.callbacks.filter(_callback => _callback != callback);
  }

  // ======================================================================== //

  public get enable() {
    return this._enable;
  }

  public get acceleration() {
    if (!this._enable) { return { x: 0, y: 0, z: 0, norm: 0 }; }

    const norm = this.ax * this.ax + this.ay * this.ay + this.az * this.az;

    return {
      x: this.ax,
      y: this.ay,
      z: this.az,
      norm,
    };
  }
}

export const devicemotion = new DeviceMotion();
