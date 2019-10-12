export class MenuScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  music = null;
  constructor() {
    super({
      key: "MenuScene"
    });
  }
  // Change to handle interactive elements
  // Must contain
  // Character Selection : check scene argument
  // Upgrade : you get gold ._.
  // Gold is used to pay : character passives
  // Weapons upgrade
  // You unlock the rest (Characters and Items)
  init(): void {
    this.input.on('pointerdown', this.startGame, this);
  }
  preload(): void {
    let assetPrefix = TARGET === 'electron' ? 'assets' : '/src/games/cadre-de-guerre/assets'; 
    this.load.audio('firmament_loopB', assetPrefix + '/musics/' + 'firmament_loopB' + '.ogg', { instances: 1 });
  }
  create(): void {
    let background = this.add.graphics();

    background.fillStyle(0x3A99D9, 1);
    background.fillRect(this.sys.canvas.width / 2, (this.sys.canvas.height / 2), this.game.canvas.width, this.sys.canvas.height);
    background.generateTexture('MenuBackground');
    background.destroy();
    this.background = new Phaser.GameObjects.Image(this, 0 ,0, 'MenuBackground');
    this.background.setScale(2);
    this.add.existing(this.background);


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

    this.music = this.sound.add('firmament_loopB');
    this.music.volume = 0.25;
    this.music.loop = true;
    this.music.play();
  }

  update(): void {
  }

  startGame(): void {
    this.sound.remove(this.music);
    let children = this.children.getAll();
    children.forEach((child) => {
      child.destroy();
    });
    this.scene.start("GameScene");
  }
}
