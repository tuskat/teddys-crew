import { Enemy } from "./enemy";
import { CurrentState } from "../../configs/enums/currentStates";

export class Boss extends Enemy {

  constructor(params) {
    super(params);
    // this.shouldRespawn = false;
    this.redrawLifebar();
  }

  protected specificAttackSkill(chosenAttack): void {
    if (this.isNotCapableToMove()) {
      return;
    }
    this[chosenAttack]();
  }

  protected useAttack(chosenAttack): void {
    if (!this.blockingState()) {
      this.body.setVelocity(0);
      this.resolveState(CurrentState.WindingUp);
      this.actionPending = this.scene.time.delayedCall(this.delayToAction, this.specificAttackSkill, [chosenAttack], this);
    }
  }

  protected updatePosition(): void {
    if (this.closeToTarget()) {
      this.useAttack('ram');
    } else {
      this.scene.physics.moveToObject(this, this.target, this.speed);
    }
  }

  //  new lifeBar
  updatLifeBarPosition(): void {
    return;
  }

  redrawLifebar(): void {
    if (this.lifeBar.alpha === 0 && this.life > 0) {
      this.lifeBar.alpha = 1;
    }
    this.lifeBar.clear();
    this.lifeBar.fillStyle(0xe66a28, 1);
    this.lifeBar.fillRect(
      this.scene.sys.canvas.width * 0.1, this.scene.sys.canvas.height - 120,
      (this.scene.sys.canvas.width * 0.8) * (this.life / this.maxLife),
      20
    );
    this.lifeBar.lineStyle(2, 0xffffff);
    this.lifeBar.strokeRect(this.scene.sys.canvas.width * 0.1, this.scene.sys.canvas.height - 120, this.scene.sys.canvas.width * 0.8, 20);
    this.lifeBar.setDepth(1);
  }

  protected isVulnerable(): boolean {
    if (this.state === CurrentState.Dead ||
      this.state === CurrentState.WindingUp ||
      this.state === CurrentState.Hurting) {
      return false;
    }
    return true;
  }

}
