import { CurrentState } from '../../configs/enums/currentStates';
import { GameScene } from '../../scenes/gameScene';
import { eventList } from '../../configs/enums/eventList';
import { LevellingEntity } from './base/levellingEntity';
import { BaseController } from '../../helpers/inputs/baseController';

export class Player extends LevellingEntity {
  scene: GameScene;
  dashSpeed = this.maxSpeedX;
  state = CurrentState.Moving;
  closeSkillsHandler = null;

  constructor(params) {
    super(params);
    this.initBody();
    this.initInput(params.controller);
  }

  protected initBody(): void {
    this.body.maxVelocity.x = this.maxSpeedX;
    this.body.maxVelocity.y = this.maxSpeedY;
    this.body.setSize(40, 40, true);
    this.body.setOffset(this.width / 4, this.height / 3);
  }

  protected initInput(controller: BaseController): void {
    this.inputEvent = controller.getEmitter();
    this.closeSkillsHandler = controller.getDashHandler();
    this.inputEvent.on('dashButtonPressed', this.meleeClick, this);
    this.inputEvent.on('shieldButtonPressed', this.shieldToClick, this);
    this.inputEvent.on('shootButtonPressed', this.shootToClick, this);
    this.inputEvent.on('cursorMoved', this.handlePointer, this);
  }

  protected updatePosition(): void {
    if (this.target) {
      let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (this.body.speed > 0)
      {
        if (distance < this.distanceToStop)
        {
          this.body.reset(this.target.x, this.target.y);
        }
      }
    }
  }
  // Override
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

  protected closeToCursor(): boolean {
    if (this.target) {
    let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) * 2;
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
    if (!this.closeToCursor()) {
      this.scene.physics.moveToObject(this, this.target, this.speed);
    } else{
      this.body.reset(this.target.x, this.target.y);
    }
  }

  protected callSkill(pointer, action): void {
    if (!this.blockingState()) {
      this.target.x = pointer.x;
      this.target.y = pointer.y;
      this.state = CurrentState.WindingUp;
      this.actionPending = this.scene.time.delayedCall(this.delayToAction, this.useSkill, [action], this);
    }
  }

  protected useSkill(action) {
    let success = this[action]();
    if (success === false) {
      this.state = CurrentState.Moving;
    }
  }

  protected meleeClick(pointer): void {
    this.closeSkillsHandler(this, pointer);
  }

  protected dashToClick(pointer): void {
      this.callSkill(pointer, 'dash');
  }

  protected shieldToClick(pointer): void {
    this.callSkill(pointer, 'shield');
  }

  protected shootToClick(pointer): void {
    this.callSkill(pointer, 'shoot');
  }

  protected doneRespawning(): void {
    this.scene.gameEvent.emit(eventList.Respawn, { sound: 'PowerUp02'});
    this.state = CurrentState.Moving;
    this.isInvicible = false;
  }
}
