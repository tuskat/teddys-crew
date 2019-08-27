import { CurrentState } from '../../configs/currentStates';
import { Entity } from './entity';
import { GameScene } from '../../scenes/gameScene';

export class Player extends Entity {
  inputEvent: Phaser.Events.EventEmitter;
  scene: GameScene;
  dashSpeed = this.maxSpeedX;
  state = CurrentState.Moving;

  constructor(params) {
    super(params);
    this.initBody();
    this.initInput(params.controller.getEmitter());
  }

  protected initBody(): void {
    this.body.maxVelocity.x = this.maxSpeedX;
    this.body.maxVelocity.y = this.maxSpeedY;
  }

  
  protected initImage(): void {
    this.body.setSize(80, 80);
    this.scale = 0.5;
    this.setOrigin(0.5, 0.5);
    this.body.setOffset(this.width / 4, this.height / 3);
  }


  protected initInput(emitter): void {
    this.inputEvent = emitter;
    this.inputEvent.on('dbuttonpressed', this.dashToClick, this);
    this.inputEvent.on('bbuttonpressed', this.shootToClick, this);
    this.inputEvent.on('cursormoved', this.handlePointer, this);
  }

  protected updatePosition(): void {
    if (this.target) {
      var distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (this.body.speed > 0)
      {
        if (distance < this.distanceToStop)
        {
          this.body.reset(this.target.x, this.target.y);
        }
      }
    }
  }
  protected isVulnerable(): boolean {
    if (this.isInvicible) {
      return false;
    }
    if (this.state === CurrentState.Dead ||
      this.state === CurrentState.Hurting ||
      this.state === CurrentState.Dashing) {
    return false;
    }
    return true;
  }

  protected closeToCurser(): boolean {
    if (this.target) {
    var distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (distance < this.distanceToStop)
      {
        return true;
      }
    }
    return false;
  }

  protected handlePointer(pointer): void {
    if (this.blockingState()) {
      return;
    }
    this.target.x = pointer.x;
    this.target.y = pointer.y;
      // Move at 200 px/s:
    if (!this.closeToCurser()) {
      this.scene.physics.moveToObject(this, this.target, this.speed);
    } else{
      this.body.reset(this.target.x, this.target.y);
    }
  }

  protected useSkill(pointer, action): void {
    if (!this.blockingState()) {
      this.target.x = pointer.x;
      this.target.y = pointer.y;
      this[action]();
    }
  }
  protected dashToClick(pointer): void {
    this.useSkill(pointer, 'dash');
  }

  protected shootToClick(pointer): void {
    this.useSkill(pointer, 'shoot');
  }

  protected blockToClick(pointer): void {

  }

  protected doneRespawning(): void {
    this.scene.gameEvent.emit('playerRespawned', { sound: 'PowerUp02'});
    this.state = CurrentState.Moving;
    this.isInvicible = false;
  }
}
