import { Player } from "./player";
import { CurrentState } from '../helpers/currentstates'


export class MeleeEnemy extends Phaser.GameObjects.Sprite {
  life = 1;
  state = CurrentState.Moving;
  speed = 100;
  distanceToStop = 32;
  player : Player;
  target: Phaser.Math.Vector2;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.player = params.player;
    this.initVariables();
    this.initImage();
    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.target = new Phaser.Math.Vector2(this.player.x, this.player.y);
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }


  update(): void {
    if (this.state === CurrentState.Dead) {
      return;
    }
    else if (this.life <= 0 ) {
      this.die();
    }
    this.updatePosition();
  }

  
  private die(): void {
    this.alpha = 0;
    this.state = CurrentState.Dead;
    this.scene.time.delayedCall(1000, function () {
      this.x = this.scene.sys.canvas.width / 2;
      this.y = this.scene.sys.canvas.height / 2;
      this.alpha = 1;
      this.scene.time.delayedCall(100, function () {
        this.life = 1;
        this.state = CurrentState.Moving;
      }, [], this);
    }, [], this);
  }

  private updatePosition(): void {
    this.target.x = this.player.x;
    this.target.y = this.player.y;

    if (this.target) {
      if (!this.closeToPlayer()) {
        this.scene.physics.moveToObject(this, this.target, this.speed);
      } else {
        // this.body.reset(this.x, this.y);
        this.attackPlayer();
      }
    }
  }

  private attackPlayer(): void {
    if (this.state !== CurrentState.Dashing) {
      this.state = CurrentState.Dashing;
      this.scene.physics.moveToObject(this, this.target, (this.speed * 3));
      this.scene.time.delayedCall(200, this.endDash, [], this);
    }
  }

  private endDash(): void {
    this.body.reset(this.x, this.y);
    this.state = CurrentState.Moving;
  }

  private closeToPlayer(): boolean {
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
    return (this.life === 0);
    // this.state = CurrentState.Hurting;
    // this.setTint(0xFF6347);
    // this.scene.time.delayedCall(1000, this.endHurting, [], this);
  }
}
