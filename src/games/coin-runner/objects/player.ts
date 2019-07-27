/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @description  Coin Runner: Player
 * @license      Digitsensitive
 */

export class Player extends Phaser.GameObjects.Sprite {
  // private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  target: Phaser.Math.Vector2;
  speed = 1000;

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
    this.body.maxVelocity.x = this.speed;
    this.body.maxVelocity.y = this.speed;
  }

  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  private initInput(): void {
    // this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.scene.input.on('pointerdown', this.handlePointer, this);
  }

  update(): void {
    // this.handleInput();
    this.updatePosition()
  }

  private updatePosition(): void {
    if (this.target) {
      var distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

      if (this.body.speed > 0)
      {
        if (distance < 32)
        {
          this.body.reset(this.target.x, this.target.y);
        }
      }
    }
  }
  private handlePointer(pointer): void {
    this.target.x = pointer.x;
    this.target.y = pointer.y;
    
    // Move at 200 px/s:
    this.scene.physics.moveToObject(this, this.target, this.speed);
  }
}
