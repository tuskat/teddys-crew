export class ScoreScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  splash: Phaser.GameObjects.Image;
  music = null;
  gold = 0;
  timeSurvived = 0;
  enemiesKilled = 0;
  maxCombo = 0;

  constructor() {
    super({
      key: "ScoreScene"
    });
  }

  init(data): void {
    this.gold = data.gold;
    this.timeSurvived = data.timeSurvived;
    this.enemiesKilled = data.enemiesKilled;
    this.maxCombo = data.maxCombo;
  }
  
  create(): void {
    let background = this.add.graphics();
    let canvas = this.sys.canvas;
    let scoreStyle = {
      fontFamily: "Connection",
      fontSize: 75,
      stroke: "#000",
      strokeThickness: 10,
      fill: "#FFF"
    };

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

    let splashW = new Phaser.GameObjects.Image(this, 128, canvas.height / 1.75, 'game-splash', 'OrsPortraitW.png');
    splashW.setScale(1.5);
    splashW.setFlipX(true);
    splashW.alpha = 0.25;
    this.add.existing(splashW);

    let instructions = this.make.text({
      x: canvas.width - 325,
      y: canvas.height - 75,
      text: 'Click to continue',
      style:  {
        fontFamily: "Connection",
        fontSize: 35,
        stroke: "#000",
        strokeThickness: 10,
        fill: "#FFF"
      }
    });
    let totalScoreText = this.make.text({
      x: canvas.width / 2 ,
      y: canvas.height * 0.1,
      text: 'Total Score :' + this.gold,
      style: scoreStyle 
    });
    let timeSurvivedText = this.make.text({
      x: canvas.width / 2 ,
      y: canvas.height * 0.3,
      text: 'Time Survived :' + this.timeSurvived,
      style: scoreStyle 
    });
    let killCountText = this.make.text({
      x: canvas.width / 2 ,
      y: canvas.height * 0.5,
      text: 'Kill Count :' + this.enemiesKilled,
      style: scoreStyle 
    });
    let MaxComboText = this.make.text({
      x: canvas.width / 2 ,
      y: canvas.height * 0.7,
      text: 'Max Combo :' + this.maxCombo,
      style: scoreStyle 
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

    if (TARGET === 'web') {
      window.dispatchEvent(new CustomEvent('hideUI', { detail: { isPausing: 'wha' } }));
    }
    window.dispatchEvent(new CustomEvent('sceneChanged', { detail: { scene: 'score'}}));
    this.input.on('pointerdown', this.showMenu, this);
  }

  update(): void {
  }

  showMenu(): void {
    this.input.removeAllListeners();
    this.sound.stopAll();
    let children = this.children.getAll();
    children.forEach((child) => {
      child.destroy();
    });
    this.scene.start("MenuScene");
  }
}
