/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Tank: Menu Scene
 * @license      Digitsensitive
 */

export class MenuScene extends Phaser.Scene {
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: "MenuScene"
    });
  }

  init(): void {
    this.input.on('pointerdown', this.startGame, this);
  }

  create(): void {
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 120,
        this.sys.canvas.height / 2,
        "font",
        "CLICK TO PLAY",
        30
      )
    );

    this.bitmapTexts.push(
      this.add.bitmapText(
        100,
        this.sys.canvas.height / 2 - 100,
        "font",
        "Cadre de Guerre",
        70
      )
    );
  }

  update(): void {
  }

  startGame(): void {
    this.scene.start("GameScene");
  }
}
