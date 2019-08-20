import { GameScene } from "../scenes/gameScene";

export class GameUI {
    private text: Phaser.GameObjects.Text[] = [];
    private style: any[] = [{
        fontFamily: "Connection",
        fontSize: 38,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      },
      {
        fontFamily: "Connection",
        fontSize: 30,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      },
      {
        fontFamily: "Connection",
        fontSize: 60,
        stroke: "#fff",
        strokeThickness: 6,
        fill: "#000000"
      }
    ];
    private countDown = 0;
    private playerLifeBar: Phaser.GameObjects.Graphics;
    private playerLifeBarBg: Phaser.GameObjects.Graphics;
    private gameEvent: Phaser.Events.EventEmitter;
    private scene: GameScene;
  
    constructor(params) {
      this.scene = params.scene;
      this.gameEvent = params.gameEvent;
      this.initGUI();
      this.updateLifeBar();
    }
  // GUI to be moved in its own class
  private updateScore(): void {
    this.scene.kills++;
    this.text['score'].setText(this.scene.kills + "");
    // this.coin.changePosition();
  }

  private updateTime(): void {
    this.text['time'].setText(this.scene.getTimeLeft() + "");
  }

  
  private updateRound(): void {
    if (!this.text['round']) {
      this.text['round'] = this.scene.make.text({
        x: (this.scene.sys.canvas.width / 3 - 60),
        y: (this.scene.sys.canvas.height / 2) -  75,
        text: "Round Ended!",
        style: this.style[2],
        alpha: 0
      });
    }
    this.scene.add.tween({
      targets: [this.text['round']],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 0,
        getEnd: () => 1
      },
      duration: 2000,
      yoyo: true,
    });
  }

  private startCountDown(): void {
    this.countDown = 5;
    if (!this.text['countdown']) {
      this.text['countdown'] = this.scene.make.text({
        x: this.scene.sys.canvas.width / 3,
        y: this.scene.sys.canvas.height / 2,
        text: "Next round in " + this.countDown,
        style: this.style[0]
      });
    }
    this.count();
  }

  private count(): void {
    if (this.countDown > 0) {
      this.text['countdown'].setText("Next round in " + this.countDown);
    } else {
      this.text['countdown'].setText("Go!");
    }
    this.scene.add.tween({
      targets: [this.text['countdown']],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      duration: 1000,
      onComplete: this.countDownHandler.bind(this)
    });
    this.scene.gameEvent.emit('countDown', {sound: 'UI04'});
  }

  private countDownHandler(): void {
    if (this.countDown <= 0) {
      return;
    }
    this.countDown--;
    this.count();
  }
  private updateLifeBar(): void {
    this.playerLifeBar.clear();
    this.playerLifeBar.fillStyle(0xffffff, 1);
    this.playerLifeBar.fillRect(10, 10, 20 * this.scene.player.life, 30);
    this.text['life'].setText(this.scene.player.life + "/ 10"); // Max Life to Set
  }

  public initGUI(): void {
    this.text['score'] = this.scene.make.text({
      x: this.scene.sys.canvas.width / 2,
      y: this.scene.sys.canvas.height - 50,
      text: this.scene.kills + "",
      style: this.style[0]
    }
    );
    this.text['time'] = this.scene.make.text({
      x: this.scene.sys.canvas.width - 50,
      y: this.scene.sys.canvas.height - 50,
      text: this.scene.getTimeLeft() + "",
      style: this.style[0]
    }
    );
    this.playerLifeBarBg = this.scene.add.graphics();
    this.playerLifeBarBg.fillStyle(0x000000, 1);
    this.playerLifeBarBg.fillRect(15, 15, 200, 30);
    this.playerLifeBar = this.scene.add.graphics();
    this.text['life'] = this.scene.add.text(
      50,
      4,
      '',
      this.style[1]
    );
    this.gameEvent.on('scoreUpdate', this.updateScore, this);
    this.gameEvent.on('timeUpdate', this.updateTime, this);
    this.gameEvent.on('lifeUpdate', this.updateLifeBar, this);
    this.gameEvent.on('playerRespawned', this.updateLifeBar, this);
    this.gameEvent.on('roundEnded', this.updateRound, this);
    this.gameEvent.on('startCountdown', this.startCountDown, this);
  }
}