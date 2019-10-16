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
    this.initZone();
  }

  private initZone(): void {
    // image
    this.flipX = true;
    this.blendMode = Phaser.BlendModes.SCREEN;
    this.setDepth(2);
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
