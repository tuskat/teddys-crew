import { Player } from "./player";
import { Entity } from "./entity";
import { CurrentState } from '../../configs/enums/currentStates'

export class Enemy extends Entity {
  player: Player;
  private lifeBar: Phaser.GameObjects.Graphics;

  constructor(params) {
    super(params);
    this.player = params.player;
    this.timeToRespawn = Phaser.Math.RND.integerInRange(1000, 5000);
    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();
  }

  protected blockingState(): boolean {
    return (this.state === CurrentState.Dead ||
      this.state === CurrentState.Dashing ||
      this.state === CurrentState.Hurting ||
      this.state === CurrentState.Shooting ||
      this.state === CurrentState.WindingUp);
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
    this.lifeBar.x = this.x;
    this.lifeBar.y = this.y;
    this.updateFrame();
  }

  redrawLifebar(): void {
    if (this.lifeBar.alpha === 0 && this.life > 0) {
      this.lifeBar.alpha = 1;
    }
    this.lifeBar.clear();
    this.lifeBar.fillStyle(0xe66a28, 1);
    this.lifeBar.fillRect(
      -this.width /4,
      this.height / 3,
      (this.width / 2  ) * (this.life / this.config.life),
      10
    );
    this.lifeBar.lineStyle(2, 0xffffff);
    this.lifeBar.strokeRect(-this.width / 4, this.height / 3, (this.width / 2), 10);
    this.lifeBar.setDepth(1);
  }

  hideLifebar(): void {
    this.lifeBar.alpha = 0;
  }
}
