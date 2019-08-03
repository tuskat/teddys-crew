// import { Coin } from "../objects/coin";
import { CurrentState } from '../helpers/currentStates'
import { MeleeEnemy } from "../objects/entities/enemy";
import { Player } from "../objects/entities/player";
import { Controller } from '../helpers/controller';
import { AssetsLoader } from '../helpers/assetsLoader';
import { GameUI } from '../helpers/gameUI';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  // private coin: Coin;
  private gameUI : GameUI;
  private assetsLoader : AssetsLoader;

  public monster: MeleeEnemy;
  public kills: number;
  public player: Player;

  constructor() {
    super({
      key: "GameScene"
    });
    this.assetsLoader = new AssetsLoader({ scene: this });
  }

  preload(): void {
    this.assetsLoader.preloadAssets(['bear', 'monster', 'background']);
  }

  init(): void {
    this.kills = 0;
  }

  create(): void {
    // create background
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);

    // create objects
    var player1input = new Controller(this.scene);
    this.player = new Player({
      scene: this,
      controller: player1input,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      key: "bear"
    });
    this.monster = new MeleeEnemy({
      scene: this,
      x: Phaser.Math.RND.integerInRange(100, 700),
      y: Phaser.Math.RND.integerInRange(100, 500),
      key: "monster",
      player: this.player
    });
    // create texts
    this.gameUI = new GameUI({scene : this});
  }

  update(): void {
    // update objects
    this.player.update();
    // this.coin.update();
    this.monster.update();
    // do the collision check
    if (this.objectsTouch(this.player, this.monster)) {
      this.objectClashing();
    }
  }

  private objectsTouch(objectA, objectB): boolean {
    return Phaser.Geom.Intersects.RectangleToRectangle(
      objectA.getBounds(),
      objectB.getBounds()
    )
  }
  private objectClashing(): void {
    if ((this.monster.state === CurrentState.Dashing) &&
      (this.player.state === CurrentState.Moving)) {
      this.player.getHurt();
      this.gameUI.updateLifeBar();
    }
    if  (this.player.state === CurrentState.Dashing) {
      if (this.monster.state !== CurrentState.Dead) {
        var died = this.monster.getHurt();
        if (died) {
          this.gameUI.updateScore();
        }
      }
    }
  }

}
