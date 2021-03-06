export class MenuScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  splash: Phaser.GameObjects.Image;
  settings = {
    character: 'Torb',
    gameMode: 'Survival'
  };
  music = null;

  constructor() {
    super({
      key: "MenuScene"
    });
    // this.handleSceneEvents();
  }

  init(): void {
    this.input.on('pointerdown', this.startGame, this);	
  }

  handleSceneEvents() {
    window.removeEventListener('startGame', this.startGame.bind(this));
    window.addEventListener('startGame', this.startGame.bind(this));
  }
  // Change to handle interactive elements
  // Must contain
  // Character Selection : check scene argument
  // Upgrade : you get gold ._.
  // Gold is used to pay : character passives
  // Weapons upgrade
  // You unlock the rest (Characters and Items)

  preload(): void {
  
  }
  create(): void {
    let background = this.add.graphics();
    let canvas = this.sys.canvas;


    background.fillStyle(0xFFFFFF, 1);
    background.fillRect(canvas.width / 2, (canvas.height / 2), canvas.width, canvas.height);
    background.generateTexture('MenuBackground');
    background.destroy();

    this.background = new Phaser.GameObjects.Image(this, 0 ,0, 'MenuBackground');
    this.background.setScale(2);
    this.add.existing(this.background);

    let graphics = this.add.graphics();
    graphics.fillGradientStyle(0x990A11,0x990A11, 0xF15533, 0xF15533, 0.75);
    graphics.fillRect(0, 0, (canvas.width / 2) - 60, canvas.height);

    let splashW = new Phaser.GameObjects.Image(this, 128, canvas.height / 1.75, 'game-splash', 'TorbPortraitW.png');
    splashW.setScale(1.5);
    splashW.setFlipX(true);
    splashW.alpha = 0.25;
    this.add.existing(splashW);

    let instructions = this.make.text({
      x: canvas.width - 325,
      y: canvas.height - 75,
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
      x: canvas.width / 2 ,
      y: canvas.height - 175,
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
      targets: [instructions],
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
    this.music.volume = 0.10;
    this.music.loop = true;
    this.music.play();

    window.dispatchEvent(new CustomEvent('sceneChanged', { detail: { scene: 'menu'}}));
  }

  update(): void {
  }

  startGame(data): void {
    // this.settings.character = data.detail.character;
    // this.settings.gameMode = data.detail.gameMode;

    this.sound.remove(this.music);
    this.input.removeAllListeners();
    this.scene.start("GameScene", this.settings);
  }
}
