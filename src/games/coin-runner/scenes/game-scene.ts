// import { Coin } from "../objects/coin";
import { CurrentState } from '../helpers/currentstates' 
import { MeleeEnemy } from "../objects/melee-enemy";
import { Player } from "../objects/player";

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  // private coin: Coin;
  private scoreText: Phaser.GameObjects.Text;
  private monster: MeleeEnemy;
  private collectedCoins: number;
  private player: Player;
  private playerLifeBar: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.image(
      "background",
      "./src/games/coin-runner/assets/background.png"
    );
    this.load.image("player", "./src/games/coin-runner/assets/bear.png");
    this.load.image("monster", "./src/games/coin-runner/assets/monster.png");
    // this.load.image("coin", "./src/games/coin-runner/assets/coin.png");
  }

  init(): void {
    this.collectedCoins = 0;
  }

  create(): void {
    // create background
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);

    // create objects

    this.player = new Player({
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      key: "player"
    });
    this.monster = new MeleeEnemy({
      scene: this,
      x: Phaser.Math.RND.integerInRange(100, 700),
      y: Phaser.Math.RND.integerInRange(100, 500),
      key: "monster",
      player: this.player
    });
    // create texts
    this.scoreText = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height - 50,
      this.collectedCoins + "",
      {
        fontFamily: "Connection",
        fontSize: 38,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    );

    this.playerLifeBar = this.add.graphics();
  }

  update(): void {
    // update objects
    this.player.update();
    // this.coin.update();
    this.monster.update();
    // do the collision check
    this.playerLifeBar.clear();
    this.playerLifeBar.fillStyle(0xffffff, 1);
    this.playerLifeBar.fillRect(10, 10, 20 * this.player.life, 30);

    if (this.objectsTouch(this.player, this.monster)) {
      this.updatePlayerLife();
    }
  }

  private objectsTouch(objectA, objectB): boolean {
    return Phaser.Geom.Intersects.RectangleToRectangle(
      objectA.getBounds(),
      objectB.getBounds()
    )
  }

  // private updateCoinStatus(): void {
  //   this.collectedCoins++;
  //   this.coinsCollectedText.setText(this.collectedCoins + "");
  //   this.coin.changePosition();
  // }

  private updatePlayerLife(): void {
    if (this.player.state !== CurrentState.Dashing) {
      this.player.getHurt();
    } else {
      this.monster.getHurt();
    }
  }
}
