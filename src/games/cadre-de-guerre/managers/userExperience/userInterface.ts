import { GameScene } from "../../scenes/gameScene";
import { eventList } from "../../configs/enums/eventList";
import fontStyles from "../../configs/enums/fontStyles";

const BARWIDTH = 200;

export class UserInterface {
  private text: Phaser.GameObjects.Text[] = null;
  private countDown = 0;
  private playerLifeBar: Phaser.GameObjects.Graphics;
  private playerLifeBarBg: Phaser.GameObjects.Sprite;
  private playerXpBar: Phaser.GameObjects.Graphics;
  private playerXpBarBg: Phaser.GameObjects.Sprite;
  private gameEvent: Phaser.Events.EventEmitter;
  private scene: GameScene;
  private shouldShake: boolean = true;

  constructor(params) {
    this.cleanse();
    this.scene = params.scene;
    this.gameEvent = params.gameEvent;
    this.initGUI();
    this.updateLifeBar();
  }

  // Init methods
  public initGUI(): void {
    // texts
    this.initText();
    // bars
    this.initLifebar();
    this.initXpbar();
    // events
    window.addEventListener('shakeChanged', this.onShakeEvent.bind(this));
    this.gameEvent.on(eventList.ScoreUpdate, this.updateScore, this);
    this.gameEvent.on(eventList.TimeUpdate, this.updateTime, this);
    this.gameEvent.on(eventList.LifeUpdate, this.updateLifeBar, this);
    this.gameEvent.on(eventList.SkillRestored, this.updateCooldown, this);
    this.gameEvent.on(eventList.Respawn, this.updateLifeBar, this);
    this.gameEvent.on(eventList.RoundEnded, this.updateRound, this);
    this.gameEvent.on(eventList.CountDownStarted, this.startCountDown, this);
    this.gameEvent.on(eventList.LevelUp, this.levelUp, this);
    this.gameEvent.on(eventList.GameOver, this.gameOver, this);
    this.gameEvent.on(eventList.Dying, this.shake, this);
  }

  public cleanse(): void {
    window.removeEventListener('shakeChanged', this.onShakeEvent.bind(this));
    this.text = [];
  }

  private initText(): void {
    this.text['score'] = this.scene.make.text({
      x: this.scene.sys.canvas.width - 50,
      y: 10,
      text: this.scene.kills + "",
      style: fontStyles.Default
    }
    ).setScrollFactor(0);
    this.text['time'] = this.scene.make.text({
      x: this.scene.sys.canvas.width / 2,
      y: 10,
      text: this.scene.getTimeLeft() + "",
      style: fontStyles.Default
    }
    ).setScrollFactor(0);
  }

  private initLifebar(): void {

    let playerLifeBarBg = this.scene.add.graphics();
    playerLifeBarBg.fillStyle(0x000000, 0.75);
    playerLifeBarBg.fillRect(this.scene.sys.canvas.width / 2, this.scene.sys.canvas.height / 2, BARWIDTH, 30);
    playerLifeBarBg.generateTexture('hpBackground');
    playerLifeBarBg.destroy();
    this.playerLifeBarBg = new Phaser.GameObjects.Sprite(this.scene, 15, 15, 'hpBackground');
    this.playerLifeBarBg.setScrollFactor(0);
    this.scene.add.existing(this.playerLifeBarBg);
    this.playerLifeBar = this.scene.add.graphics();
    this.playerLifeBar.setScrollFactor(0);
    this.text['life'] = this.scene.add.text(
      50,
      4,
      '',
      fontStyles.Smaller
    ).setScrollFactor(0);
  }

  private initXpbar(): void {
    let xpBackground = this.scene.add.graphics();
    xpBackground.fillStyle(0x000000, 0.75);
    xpBackground.fillRect(this.scene.sys.canvas.width / 2, (this.scene.sys.canvas.height / 2), BARWIDTH, 10);
    xpBackground.generateTexture('xpBackground');
    xpBackground.destroy();
    this.playerXpBarBg = new Phaser.GameObjects.Sprite(this.scene, 15, 60, 'xpBackground');
    this.playerXpBarBg.setScrollFactor(0);
    this.scene.add.existing(this.playerXpBarBg);
    this.playerXpBar = this.scene.add.graphics();
    this.playerXpBar.setScrollFactor(0);
    this.text['experience'] = this.scene.add.text(
      50,
      45,
      '',
      fontStyles.Smallest
    ).setScrollFactor(0);
  }

  // Update methods
  private updateScore(): void {
    this.scene.earnGold(10);
    this.scene.kills++;
    this.text['score'].setText(this.scene.kills + "");
    this.updateXPBar();
  }

  private updateTime(): void {
    this.text['time'].setText(this.scene.getTimeLeft() + "");
  }

  private updateLifeBar(): void {
    this.playerLifeBar.clear();
    this.playerLifeBar.fillStyle(0xffffff, 1);
    this.playerLifeBar.fillRect(10, 10, (this.scene.player.life / this.scene.player.maxLife) * BARWIDTH, 30);
    this.text['life'].setText(this.scene.player.life + "/ " + this.scene.player.maxLife); // Max Life to Set
  }

  private updateXPBar(): void {
    let barwidth = ((this.scene.player.experience / this.scene.player.experienceToLevelUp) * BARWIDTH);
    if (barwidth > BARWIDTH) {
      barwidth = BARWIDTH * 0.99;
    }
    this.playerXpBar.clear();
    this.playerXpBar.fillStyle(0x87BC5E, 0.75);
    this.playerXpBar.fillRect(15, 60, barwidth, 10);
    this.text['experience'].setText('Level: ' + this.scene.player.level); // Max Life to Set
  }

  private updateRound(): void {
    if (!this.text['round']) {
      this.text['round'] = this.scene.make.text({
        x: (this.scene.sys.canvas.width / 3 - 60),
        y: (this.scene.sys.canvas.height / 2) - 75,
        text: "Round Ended!",
        style: fontStyles.Title,
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

  // Level Up
  private levelUp(item): void {
    if (item.entity.faction === 'allies') {
      this.playerLevelUp(item);
    } else {
      this.enemiesLevelUp(item);
    }
  }

  private enemiesLevelUp(item): void {
    let index = 'levelUp' + item.entity.faction;
    if (!this.text[index]) {
      this.text[index] = this.scene.make.text({
        x: this.scene.sys.canvas.width * 0.12,
        y: this.scene.sys.canvas.height / 2,
        text: "Enemies Level Up...\n" + item.buff,
        style: fontStyles.Title
      });
    } else {
      this.text[index].setText("Enemies Level Up...\n" + item.buff);
    }
    this.scene.add.tween({
      targets: [this.text[index]],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      duration: 2000,
      onComplete: null
    });
  }

  private updateCooldown(item): void {
    let index = 'skillCooldown';
    if (!this.text[index]) {
      this.text[index] = this.scene.make.text({
        x: item.entity.x,
        y: item.entity.y,
        text: "Skill Restored!",
        style: fontStyles.Smallest
      });
    } else {
      this.text[index].setPosition(item.entity.x, item.entity.y);
    }
    this.scene.add.tween({
      targets: [this.text[index]],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      duration: 2000,
      onComplete: null
    });
  }

  private playerLevelUp(item): void {
    let index = 'levelUp' + item.entity.faction;
    if (!this.text[index]) {
      this.text[index] = this.scene.make.text({
        x: item.entity.x,
        y: item.entity.y,
        text: "Level Up!!!\n" + item.buff,
        style: fontStyles.Smallest
      });
    } else {
      this.text[index].setText("Level Up!!!\n" + item.buff);
      this.text[index].setPosition(item.entity.x, item.entity.y);
    }
    this.scene.add.tween({
      targets: [this.text[index]],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      duration: 3000,
      onComplete: null
    });
  }

  private gameOver(): void {
    let index = 'gameOver';
    if (!this.text[index]) {
      this.text[index] = this.scene.make.text({
        x: this.scene.sys.canvas.width / 3,
        y: this.scene.sys.canvas.height / 2,
        text: "Game Over",
        style: fontStyles.Title
      }).setScrollFactor(0);
      this.text[index].setDepth(2);
    }
  }

  // Countdown
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
      onComplete: this.countDownCallback.bind(this)
    });
    this.scene.gameEvent.emit(eventList.CountDown, { sound: 'UI04' });
  }

  private countDownCallback(): void {
    if (this.countDown <= 0) {
      return;
    }
    this.countDown--;
    this.count();
  }

  private startCountDown(): void {
    this.countDown = 3;
    if (!this.text['countdown']) {
      this.text['countdown'] = this.scene.make.text({
        x: this.scene.sys.canvas.width / 3,
        y: this.scene.sys.canvas.height / 2,
        text: "Next round in " + this.countDown,
        style: fontStyles.Default
      });
    }
    this.count();
  }

  private shake(): void {
    if (this.shouldShake) {
      this.scene.cameras.main.shake(200, 0.00125);
    }
  }

  onShakeEvent(data) {
    this.setShake(data.detail.newValue);
  }

  public setShake(shake): void {
    this.shouldShake = shake;
  }
}
