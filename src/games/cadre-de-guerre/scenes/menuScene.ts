export class MenuScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  splash: Phaser.GameObjects.Image;
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
    this.load.multiatlas('game-splash', assetPrefix + '/sprites/game-splash.json', assetPrefix + '/sprites/');
    this.load.audio('firmament_loopB', assetPrefix + '/musics/' + 'firmament_loopB' + '.ogg', { instances: 1 });
  }
  create(): void {
    let background = this.add.graphics();

    background.fillStyle(0xFFFFFF, 1);
    background.fillRect(this.sys.canvas.width / 2, (this.sys.canvas.height / 2), this.game.canvas.width, this.sys.canvas.height);
    background.generateTexture('MenuBackground');
    background.destroy();
    this.background = new Phaser.GameObjects.Image(this, 0 ,0, 'MenuBackground');
    this.background.setScale(2);
    this.splash = new Phaser.GameObjects.Image(this, this.sys.canvas.width / 1.35, this.sys.canvas.height / 1.75, 'game-splash', 'OrsPortrait.png');
    this.splash.setScale(1);
    this.splash.setBlendMode(Phaser.BlendModes.OVERLAY);
    this.add.existing(this.background);
    this.add.existing(this.splash);


    let instruction = this.make.text({
      x: 20 ,
      y: this.sys.canvas.height - 75,
      text: 'Click to Start',
      style:  {
        fontFamily: "Connection",
        fontSize: 35,
        stroke: "#000",
        strokeThickness: 10,
        fill: "#FFF"
      }
    });
    let title = this.make.text({
      x: 10 ,
      y: this.sys.canvas.height - 175,
      text: 'Teddy\'s Crews',
      style:  {
        fontFamily: "Connection",
        fontSize: 75,
        stroke: "#000",
        strokeThickness: 10,
        fill: "#FFF"
      }
    });
  
    this.add.tween({
      targets: [instruction],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 0,
        getEnd: () => 1
      },
      duration: 2000,
      yoyo: true,
      loop: -1
    });
  
    this.music = this.sound.add('firmament_loopB');
    this.music.volume = 0.25;
    this.music.loop = true;
    this.music.play();

    if (TARGET === 'web') {
      window.dispatchEvent(new CustomEvent('hideUI', { detail: { isPausing: 'wha' } }));
    }
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
