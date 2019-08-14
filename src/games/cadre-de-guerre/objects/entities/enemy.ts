import { Player } from "./player";
import { Entity } from "./entity";

export class MeleeEnemy extends Entity {
  player : Player;

  constructor(params) {
    super(params);
    this.player = params.player;
  }

  update(): void {
    if (this.blockingState()) {
      this.doNothing();
    }
    else {
      if (this.player) {
        this.updateTargetPosition(this.player);
        this.updatePosition();
      }
    }
    this.updateFrame();
  }
}
