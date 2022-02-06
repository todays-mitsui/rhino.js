export class DeviceMotion {
  private _enable = true;
  private callbacks: ((event: DeviceMotionEvent) => void)[] = [];

  static readonly K = 0.01;

  private ax: number;
  private ay: number;
  private az: number;
  private gx: number;
  private gy: number;
  private gz: number;

  public constructor() {
    this.ax = 0;
    this.ay = 0;
    this.az = 0;
    this.gx = 0;
    this.gy = 0;
    this.gz = 0;
  }

  public async requestPermission() {
    if (DeviceMotionEvent == null) { return this._enable = false; }

    if (!('requestPermission' in DeviceMotionEvent)) { return this._enable = true; }

    /* @ts-ignore */
    const permissionState = await DeviceMotionEvent.requestPermission();

    return this._enable = permissionState == 'granted';
  }

  public hander(event: DeviceMotionEvent) {
    const K = DeviceMotion.K;

    let { x, y, z } = event.acceleration!;
    let { x: gx, y: gy, z: gz } = event.accelerationIncludingGravity!;

    if (x == null && y == null && z == null) {
      this._enable = false;
      window.removeEventListener('devicemotion', this.hander);
    }

    this.ax = (1 - K) * this.ax + K * x!;
    this.ay = (1 - K) * this.ay + K * y!;
    this.az = (1 - K) * this.az + K * z!;
    this.gx = (1 - K) * this.gx + K * gx!;
    this.gy = (1 - K) * this.gy + K * gy!;
    this.gz = (1 - K) * this.gz + K * gz!;

    for (let callback of this.callbacks) {
      callback(event);
    }
  }

  public onDeviceMotion(callback: (event: DeviceMotionEvent) => void) {
    this.callbacks.push(callback);
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

  public get gravity() {
    if (!this._enable) { return { x: 0, y: 0, z: 0 }; }

    return { x: this.gx, y: this.gy, z: this.gz };
  }
}
