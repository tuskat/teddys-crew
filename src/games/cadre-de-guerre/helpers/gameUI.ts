import { GameScene } from "../scenes/gameScene";

export class GameUI {
    private scoreText: Phaser.GameObjects.Text;
    private lifeText: Phaser.GameObjects.Text;
    private style: any = {
        fontFamily: "Connection",
        fontSize: 38,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      };
    private playerLifeBar: Phaser.GameObjects.Graphics;
    private playerLifeBarBg: Phaser.GameObjects.Graphics;
    private scene: GameScene;
  
    constructor(params) {
      this.scene = params.scene;
      this.initGUI();
      this.updateLifeBar();
    }
  // GUI to be moved in its own class
  public updateScore(): void {
    this.scene.kills++;
    this.scoreText.setText(this.scene.kills + "");
    // this.coin.changePosition();
  }

  public updateLifeBar(): void {
    this.playerLifeBar.clear();
    this.playerLifeBar.fillStyle(0xffffff, 1);
    this.playerLifeBar.fillRect(10, 10, 20 * this.scene.player.life, 30);
    this.lifeText.setText(this.scene.player.life + "/ 10"); // Max Life to Set
  }

  public initGUI(): void {
    this.scoreText = this.scene.make.text({
      x: this.scene.sys.canvas.width / 2,
      y: this.scene.sys.canvas.height - 50,
      text: this.scene.kills + "",
      style: this.style
    }
    );
    this.playerLifeBarBg = this.scene.add.graphics();
    this.playerLifeBarBg.fillStyle(0x000000, 1);
    this.playerLifeBarBg.fillRect(15, 15, 200, 30);
    this.playerLifeBar = this.scene.add.graphics();
    this.lifeText = this.scene.add.text(
      50,
      4,
      '',
      {
        fontFamily: "Connection",
        fontSize: 30,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    );
  }
}