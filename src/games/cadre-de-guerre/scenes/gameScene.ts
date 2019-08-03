// import { Coin } from "../objects/coin";
import { CurrentState } from '../helpers/currentStates'
import { MeleeEnemy } from "../objects/entities/enemy";
import { Player } from "../objects/entities/player";
import { Controller } from '../helpers/controller';
import { AssetsLoader } from '../helpers/assetsLoader';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  // private coin: Coin;
  private scoreText: Phaser.GameObjects.Text;
  private lifeText: Phaser.GameObjects.Text;
  private playerLifeBar: Phaser.GameObjects.Graphics;
  private playerLifeBarBg: Phaser.GameObjects.Graphics;
  private monster: MeleeEnemy;
  private kills: number;
  private player: Player;

  private assetsLoader : AssetsLoader;

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
    this.initGUI();
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
      this.updateLifeBar();
    }
    if  (this.player.state === CurrentState.Dashing) {
      if (this.monster.state !== CurrentState.Dead) {
        var died = this.monster.getHurt();
        if (died) {
          this.updateScore();
        }
      }
    }
  }

  // GUI to be moved in its own class
  private updateScore(): void {
    this.kills++;
    this.scoreText.setText(this.kills + "");
    // this.coin.changePosition();
  }

  private updateLifeBar(): void {
    this.playerLifeBar.clear();
    this.playerLifeBar.fillStyle(0xffffff, 1);
    this.playerLifeBar.fillRect(10, 10, 20 * this.player.life, 30);
    this.lifeText.setText(this.player.life + "/ 10"); // Max Life to Set
  }

  private initGUI(): void {
    this.scoreText = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 50,
      this.kills + "",
      {
        fontFamily: "Connection",
        fontSize: 38,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    );
    this.playerLifeBarBg = this.add.graphics();
    this.playerLifeBarBg.fillStyle(0x000000, 1);
    this.playerLifeBarBg.fillRect(15, 15, 200, 30);
    this.playerLifeBar = this.add.graphics();
    this.lifeText = this.add.text(
      50,
      4,
      this.player.life + "/ 10",
      {
        fontFamily: "Connection",
        fontSize: 30,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    );
    this.updateLifeBar();
  }
}
