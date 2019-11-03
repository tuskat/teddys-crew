import { BaseEnergy } from "./baseEnergy";

export class MovingZone extends BaseEnergy {
  lifespan;
  parent = null;

  constructor(params) {
    super(params);
    this.rotation = params.rotation;
    this.parent = params.parent;
    this.power = params.power;
    this.lifespan = this.parent.actionDuration;
    this.alpha = params.alpha;
    this.initZone();
  }

  private initZone(): void {
    // image
    let ratio = (this.parent.width / this.width);
    this.flipX = true;
    this.setDepth(2);
    if (this.width <= this.parent.width) {
      this.setScale(ratio * 1.65);
    }
    // this.body.setSize(80, 80, true);
    // physics
  }

  update(time, delta): void {
    this.lifespan -= delta;
    this.x = this.parent.x;
    this.y = this.parent.y;
    if (this.lifespan <= 0) {
      this.die();
    }
  }
}
