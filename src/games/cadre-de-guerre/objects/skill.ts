import { GraphicEffects } from "./graphicEffects";

export class Skill extends GraphicEffects {
    private lifespan: number;

    constructor(params) {
      super(params);
    }

    protected initImage(): void {
      // image
      this.lifespan = 3000;
     
      this.setOrigin(0.5, 0.5);
      this.setDepth(0);

      // physics
      this.scene.physics.world.enable(this);
      this.body.setSize(80, 80, true);
      this.scale = 2;
    }

    update(time, delta): void {
      this.lifespan -= delta;

      if (this.lifespan <= 0)
      {
        this.die();
      }
    }
  }
