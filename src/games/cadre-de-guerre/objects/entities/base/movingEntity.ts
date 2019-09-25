import { Entity } from "./entity";
import { CurrentState } from '../../../configs/enums/currentStates';

export class MovingEntity extends Entity {

  constructor(params) {
    super(params);
  }

  protected blockingState(): boolean {
    return (this.state === CurrentState.Dead ||
      this.state === CurrentState.Dashing ||
      this.state === CurrentState.WindingUp);
  }

  // update methods
  update(time, delta): void {
    if (this.blockingState()) {
      this.doNothing();
    }
    else {
      this.updatePosition();
    }
    this.updateFrame();
  }

  protected updateTargetPosition(newPosition): void {
    this.target.x = newPosition.x;
    this.target.y = newPosition.y;
  }

  protected updatePosition(): void {
    this.scene.physics.moveToObject(this, this.target, this.speed);
  }

  protected updateFrame(): void {
    let extension = '.png';
    this.updatShadowPosition();
    if (this.target.x < this.x) {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }
    if (this.previousState === this.state) {
      return;
    }
    switch (this.state) {
      case CurrentState.Dead: {
        this.setFrame(this.spriteFolder + '/Hurt' + extension);
        break;
      }
      case CurrentState.Hurting: {
        this.setFrame(this.spriteFolder + '/Hurt' + extension);
        break;
      }
      case CurrentState.WindingUp: {
        this.setFrame(this.spriteFolder + '/WindingUp' + extension);
        break;
      }
      case CurrentState.Dashing: {
        this.setFrame(this.spriteFolder + '/Dash' + extension);
        break;
      }
      case CurrentState.Shooting: {
        this.setFrame(this.spriteFolder + '/Attack' + extension);
        break;
      }
      case CurrentState.Moving: {
        this.setFrame(this.spriteFolder + '/Idle' + extension);
        break;
      }
    }
    this.previousState = this.state;
  }

  protected endActionCallback(): void {
    if (!this.isDead()) {
      this.body.reset(this.x, this.y);
      this.state = CurrentState.Moving;
    }
  }

  protected getAngle(): number {
    return Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.target.x,
      this.target.y
    );
  }
  // Anim complete
  // protected animCompleteCallback(anim) {
  //   if (anim.key === 'explode') {
  //     this.alpha = 0;
  //     this.scene.gameEvent.emit('scoreUpdate');
  //     this.setFrame(this.spriteFolder + '/Idle' + '.png');
  //   }
  // }
}
