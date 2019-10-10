import { GameScene } from "../../scenes/gameScene";

export class Weapon extends Phaser.GameObjects.Sprite {
  protected parent = null;
  protected scene: GameScene;
  public name: string = null;
  protected config = null;
  protected passives = [];
  protected stats = [{
    power: 0,
    defense: 0,
    speed: 0,
  }];


  constructor(params) {
    super(params.scene, params.x, params.y, 'game-objects', params.key + '.png');
    this.name = params.name || 'machete';
    this.flipX = !params.flipX;
    this.initImage();
    this.scene.add.existing(this);
    this.addToConfig(params.config);
  }

  protected addToConfig(config): void {
    for (let key in config) {
      this[key] = config[key] || this[key];
    }
    this.config = config;
  }

  update(): void {
    this.x = this.parent.x;
    this.y = this.parent.y;
  }

  protected initImage(): void {
    // image
    this.scale = this.config.scale;
    this.setOrigin(0.5, 0.5);
    this.setDepth(2);
    this.setSize(30, 30);

    // physics
    this.scene.physics.world.enable(this);
  }

  die(): void {
    this.setActive(false);
    this.setVisible(false);
    this.destroy();
  }
}
