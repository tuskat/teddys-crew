import { CurrentState } from '../../helpers/currentStates'
import _ = require('lodash');


export class Entity extends Phaser.GameObjects.Sprite {
  life = 1;
  state = CurrentState.Moving;
  speed = 100;
  skills = [];
  distanceToStop = 100;
  maxSpeedX;
  maxSpeedY;
  delayToAction;
  isInvicible;
  invicibleFrame = 0;
  target: Phaser.Math.Vector2;
  shouldRespawn = true;
  config: any;
  spriteFolder = null;
  previousState = null;

  constructor(params) {
    super(params.scene, params.x, params.y, 'cadre-de-guerre', params.key + '.png');
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.initVariables(params.config);
    this.initImage();
    this.scene.add.existing(this);
    this.spriteFolder = params.folder;
  }

  protected initVariables(config): void {
    this.target = new Phaser.Math.Vector2(0, 0);
    _.each(config, (val, key) => this[key] = val);
    this.config = config;
  }

  protected initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  protected doNothing(): void {

  }

  protected blockingState(): boolean {
    return (this.state === CurrentState.Dead ||
      this.state === CurrentState.Dashing ||
      this.state === CurrentState.WindingUp);
  }

  update(): void {
    if (!this.target || this.blockingState()) {
      this.doNothing();
    }
    else {
      this.updatePosition();
    }
    this.updateFrame();
  }

  protected doneRespawning(): void {
    if (!this.shouldRespawn) {
      this.alpha = 0;
      return;
    }
    this.isInvicible = false;
    this.state = CurrentState.Moving;
  }

  protected respawn(): void {
    if (this.shouldRespawn === false) {
      return;
    }
    this.x = Phaser.Math.RND.integerInRange(100, 700);
    this.y = Phaser.Math.RND.integerInRange(100, 500);
    this.isInvicible = true;
    this.life = this.config.life;
    this.scene.add.tween({
      targets: [this],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 0,
        getEnd: () => 1
      },
      duration: this.delayToAction,
      onComplete: this.doneRespawning.bind(this)
    });
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
    if (this.closeToTarget()) {
      this.attack();
    } else {
      this.scene.physics.moveToObject(this, this.target, this.speed);
    }
  }

  //  Only non-player wind-up before dashing
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

  protected closeToTarget(): boolean {
    if (this.target) {
      var distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (distance < this.distanceToStop) {
        return true;
      }
    }
    return false;
  }

  public getHurt(): boolean {
    this.life--;
    if (this.life < 0) {
      this.life = 0;
    }
    if (this.life === 0) {
      this.die();
    } else if (this.life > 0) {
      this.state = CurrentState.Hurting;
      this.isInvicible = true;
      this.setTint(0xFF6347);
      this.scene.time.delayedCall(this.invicibleFrame, this.endHurting, [], this);
    }

    return (this.life === 0);
  }

  protected endHurting(): void {
    this.clearTint();
    this.isInvicible = false;
    if (this.state !== CurrentState.Dead) {
      this.state = CurrentState.Moving;
    }
  }

  protected updateFrame(): void {
    let extension = '.png';
    if (this.target.x <  this.x) {
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
      case CurrentState.Moving: {
        this.setFrame(this.spriteFolder + '/Idle' + extension);
        break;
      }
    }
    this.previousState = this.state;
  }
}
