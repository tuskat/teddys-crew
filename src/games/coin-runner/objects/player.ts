import { CurrentState } from '../helpers/currentstates' 

export class Player extends Phaser.GameObjects.Sprite {
  // private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  target: Phaser.Math.Vector2;
  speed = 300;
  maxSpeedY = 750;
  maxSpeedX = 1500;
  dashSpeed = this.maxSpeedX;
  distanceToStop = 4;
  state = CurrentState.Moving;
  life = 10;
  constructor(params) {
    super(params.scene, params.x, params.y, params.key);
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.initVariables();
    this.initImage();
    this.initInput();
    this.scene.add.existing(this);
  }

  private initVariables(): void {
    this.target = new Phaser.Math.Vector2();
    this.body.maxVelocity.x = this.maxSpeedX;
    this.body.maxVelocity.y = this.maxSpeedY;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initInput(): void {
    // this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.scene.input.on('pointerup', this.dashToClick, this);
    this.scene.input.on('pointermove', this.handlePointer, this);
  }

  update(): void {
    // this.handlePointer(this.scene.input.activePointer);
    if (this.state === CurrentState.Dead) {
      return;
    }
    this.updatePosition();
    if (this.life <= 0 ) {
      this.die();
    }
  }

  private die(): void {
    this.alpha = 0;
    this.scene.time.delayedCall(1000, function () {
      this.x = this.scene.sys.canvas.width / 2;
      this.y = this.scene.sys.canvas.height / 2;
      this.alpha = 1;
      this.life = 10;
    }, [], this);
  }

  private updatePosition(): void {
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
  private closeToCurser(): boolean {
    if (this.target) {
    var distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (distance < this.distanceToStop)
      {
        return true;
      }
    }
    return false;
  }

  private handlePointer(pointer): void {
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

  private dashToClick(pointer): void {
    if (this.state !== CurrentState.Dashing) {
      this.target.x = pointer.x;
      this.target.y = pointer.y;
      this.state = CurrentState.Dashing;
      this.scene.physics.moveToObject(this, this.target, this.dashSpeed);
      this.scene.time.delayedCall(200, this.endDash, [], this);
    }
  }

  private endDash(): void {
    this.body.reset(this.x, this.y);
    this.state = CurrentState.Moving;
  }

  public getHurt(): void {
    if (this.state === CurrentState.Moving) {
      this.life--;
      this.state = CurrentState.Hurting;
      this.setTint(0xFF6347);
      this.scene.time.delayedCall(1000, this.endHurting, [], this);
    }
  }

  private endHurting(): void {
    this.clearTint();
    this.state = CurrentState.Moving;
  }
}
