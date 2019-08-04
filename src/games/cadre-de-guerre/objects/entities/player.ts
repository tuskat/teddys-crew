import { CurrentState } from '../../helpers/currentStates';
import { Entity } from './entity';

export class Player extends Entity {
  // protected cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  inputEvent: Phaser.Events.EventEmitter;
  maxSpeedY = 750;
  maxSpeedX = 1500;
  dashSpeed = this.maxSpeedX;
  state = CurrentState.Moving;
  constructor(params) {
    super(params);
    this.initBody();
    this.initInput(params.controller.getEmitter());
  }

  protected initBody(): void {
    this.target = new Phaser.Math.Vector2();
    this.body.maxVelocity.x = this.maxSpeedX;
    this.body.maxVelocity.y = this.maxSpeedY;
  }

  protected initInput(emitter): void {
    // this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.inputEvent = emitter;
    this.inputEvent.on('dbuttonpressed', this.dashToClick, this);
    this.inputEvent.on('bbuttonpressed', this.blockClick, this);
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
    this.target.x = pointer.x;
    this.target.y = pointer.y;
    if (this.state !== CurrentState.Dashing) {
      // Move at 200 px/s:
      if (!this.closeToCurser()) {
        this.scene.physics.moveToObject(this, this.target, this.speed);
      } else{
        this.body.reset(this.target.x, this.target.y);
      }
    }
  }

  protected dashToClick(pointer): void {
    if (this.state !== CurrentState.Dashing) {
      this.target.x = pointer.x;
      this.target.y = pointer.y;
      this.state = CurrentState.Dashing;
      this.scene.physics.moveToObject(this, this.target, this.dashSpeed);
      this.scene.time.delayedCall(200, this.endDash, [], this);
    }
  }

  protected blockClick(pointer): void {

  }
}