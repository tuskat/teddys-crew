import { BaseSkill } from "./baseSkill";

export class MovingZone extends BaseSkill {
  lifespan;  
  parent = null;
  
  constructor(params) {
      super(params);
      this.rotation = params.rotation;
      this.parent = params.parent;
      this.lifespan = this.parent.actionDuration;
      this.initZone();
    }
    
    private initZone(): void {
      // image
      this.flipX = false;
      this.setDepth(0);
      this.body.setSize(80,80, true);
      // physics
    }

    update(time, delta): void {
      this.lifespan -= delta;
      this.x = this.parent.x;
      this.y = this.parent.y;
      if (this.lifespan <= 0)
      {
        this.die();
      }
    }
  }
