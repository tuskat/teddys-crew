export class MenuScene extends Phaser.Scene {

  constructor() {
    super({
      key: "MenuScene"
    });
  }

  init(): void {
    this.input.on('pointerdown', this.startGame, this);
  }

  create(): void {
    this.make.text({
      x: this.sys.canvas.width * 0.70 ,
      y: this.sys.canvas.height - 65,
      text: 'Click to Start',
      style:  {
        fontFamily: "Connection",
        fontSize: 35,
        stroke: "#000",
        strokeThickness: 10,
        fill: "#FFF"
      }
    });
    this.make.text({
      x: this.sys.canvas.width * 0.40 ,
      y: this.sys.canvas.height - 150,
      text: 'Teddy\'s Crews',
      style:  {
        fontFamily: "Connection",
        fontSize: 75,
        stroke: "#000",
        strokeThickness: 10,
        fill: "#FFF"
      }
    });
  }

  update(): void {
  }

  startGame(): void {
    let children = this.children.getAll();
    children.forEach((child) => {
      child.destroy();
    });
    this.scene.start("GameScene");
  }
}
