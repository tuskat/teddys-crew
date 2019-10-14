import { BaseEnergy } from "./baseEnergy";

export class Zone extends BaseEnergy {
  private lifespan: number;
  protected defaultScale: number = 2;

  constructor(params) {
    super(params);
    this.initZone();
  }

  protected initZone(): void {
    // image
    this.lifespan = 3000;

    this.setOrigin(0.5, 0.5);
    this.setDepth(0);
    this.body.setCircle(64);
    this.setScale(this.defaultScale * this.comboPower);
    // physics
  }

  update(time, delta): void {
    this.lifespan -= delta;

    if (this.lifespan <= 0) {
      this.die();
    }
  }
}
