import { CurrentState } from '../../helpers/currentStates'
import _ = require('lodash');


export class Entity extends Phaser.GameObjects.Sprite {
  life = 1;
  state = CurrentState.Moving;
  speed = 100;
  distanceToStop = 100;
  target: Phaser.Math.Vector2;
  config: any;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.initVariables(params.config);
    this.initImage();
    this.scene.add.existing(this);
  }

  protected initVariables(config): void {
    this.target = new Phaser.Math.Vector2(0, 0);
    _.each(config, (val, key) => this[key] = val);
    this.config = config;
  }

  protected initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  protected blockingState(): boolean {
    return (this.state === CurrentState.Dead ||
            this.state === CurrentState.Dashing ||
            this.state === CurrentState.WindingUp);
  }

  update(): void {
    if (this.blockingState()) {
      return;
    }
    else {
      this.updatePosition();
    }
  }
  protected respawn(): void {
    console.log(typeof this);
    this.x = this.scene.sys.canvas.width / 2;
    this.y = this.scene.sys.canvas.height / 2;
    this.alpha = 1;
    this.life = this.config.life;
    this.scene.time.delayedCall(100, function () {
      this.state = CurrentState.Moving;
    }, [], this);
  }
  protected die(): void {
    this.alpha = 0;
    this.state = CurrentState.Dead;
    this.scene.time.delayedCall(1000, this.respawn, [], this);
  }

  protected updateTargetPosition(newPosition): void {
    this.target.x = newPosition.x;
    this.target.y = newPosition.y;
  }

  protected updatePosition(): void {

    if (this.target) {
      if (!this.closeToPlayer()) {
        this.scene.physics.moveToObject(this, this.target, this.speed);
      } else {
        // this.body.reset(this.x, this.y);
        this.attack();
      }
    }
  }

  protected attack(): void {
    this.body.reset(this.x, this.y);
    this.state = CurrentState.WindingUp;
    this.scene.time.delayedCall(500, this.dash, [], this);
  }

  protected dash(): void {
    if (this.state === CurrentState.Dead) {
      return;
    }
    this.state = CurrentState.Dashing;
    this.scene.physics.moveToObject(this, this.target, (this.speed * 5));
    this.scene.time.delayedCall(400, this.endDash, [], this);
  }

  protected endDash(): void {
    this.body.reset(this.x, this.y);
    this.state = CurrentState.Moving;
  }

  protected closeToPlayer(): boolean {
    if (this.target) {
    var distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (distance < this.distanceToStop)
      {
        return true;
      }
    }
    return false;
  }

  public getHurt(): boolean {
    this.life--;
    if (this.life === 0 ) {
      this.die();
    } else {
      this.state = CurrentState.Hurting;
      this.setTint(0xFF6347);
      this.scene.time.delayedCall(1000, this.endHurting, [], this);
    }
    if (this.life < 0) {
      this.life = 0;
    }
    return (this.life === 0);
  }

  protected endHurting(): void {
    this.clearTint();
    if (this.state !== CurrentState.Dead) {
      this.state = CurrentState.Moving;      
    }
  }
}
