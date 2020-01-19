import { GameScene } from "../../scenes/gameScene";
import { eventList } from "../../configs/enums/eventList";
import fontStyles from "../../configs/enums/fontStyles";


const BARWIDTH = 100;

export class ComboManager {
  private text: Phaser.GameObjects.Text[] = [];
  private combo = 0;
  private maxCombo = 0;
  private posX = 0;
  private posY = 125;
  private timeToClear = 3000;
  private comboTime = this.timeToClear;
  private isBouncing = false;
  private comboBar: Phaser.GameObjects.Graphics;
  private comboBarBg: Phaser.GameObjects.Graphics;
  private gameEvent: Phaser.Events.EventEmitter;
  private scene: GameScene;

  constructor(params) {

    this.scene = params.scene;
    this.posX = this.scene.sys.canvas.width - 200;
    this.gameEvent = params.gameEvent;
    this.initCombo();
  }

  // Init methods
  public initCombo(): void {
    // texts
    this.initCombobar();
    this.initText();
    // bars

    // events
    this.gameEvent.on(eventList.LifeUpdate, this.missCallback, this);
    this.gameEvent.on(eventList.Damaged, this.hitCallback, this);
  }

  private initText(): void {
    this.text['combo_subtitle'] = this.scene.make.text({
      x: this.posX,
      y: 100,
      text: "combo!!",
      style: fontStyles.Default,
      alpha: 0
    }
    );
    this.text['combo'] = this.scene.make.text({
      x: this.posX,
      y: 50,
      text: this.combo + '',
      style: fontStyles.Title,
      alpha: 0
    }
    );
  }

  private initCombobar(): void {
    this.comboBarBg = this.scene.add.graphics();
    this.comboBarBg.fillStyle(0x000000, 0.75);
    this.comboBarBg.fillRect(this.posX, this.posY, BARWIDTH, 30);
    this.comboBar = this.scene.add.graphics();
  }

  private updateComboBar(): void {
    this.comboBar.clear();
    this.comboBar.fillStyle(0xffffff, 1);
    this.comboBar.fillRect(this.posX, this.posY, (this.comboTime / this.timeToClear) * BARWIDTH, 30);
  }

  private hitCallback(event): void {
    if (event.faction === 'foes') {
      this.combo++;
      this.comboTime = this.timeToClear;
      this.updateCombo();
     
    }
  }

  private missCallback(event): void {
    // flimsy logic there
    if (event) {
      this.loseCombo();
      this.hideCombo();
    }
  }

  public update(time, delta): void {
    if (this.combo > 0) {
      this.updateComboBar();
      this.comboTime -= delta;
      if (this.comboTime <= 0) {
        this.loseCombo();
      }
    } else {
      this.hideCombo();
    }
  }

  private loseCombo(): void {
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }
    this.combo = 0;
    this.scene.gameEvent.emit(eventList.ComboLoss, { maxCombo: this.maxCombo});
  }
  // Update methods
  private updateCombo(): void {
    let scale = 1 * (1 + (this.combo / 100));
    if (scale > 1.25) {
      scale = 1.25;
    }
    this.text['combo'].setText(this.combo);
    this.scene.add.tween({
      targets: [this.text['combo'], this.text['combo_subtitle'], this.comboBar, this.comboBarBg],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      duration: 5000,
      onComplete: null
    });
    if (this.isBouncing === false) {
      this.scene.add.tween({
        targets: [this.text['combo'], this.text['combo_subtitle']],
        scale: scale,
        duration: 200,
        ease: 'Bounce.easeInOut',
        yoyo: true,
        onComplete: this.unlockBouncing.bind(this)
      });
      this.isBouncing = true;
    }
   this.comboPowerUp();
  }

  private comboPowerUp(): void {
    if (this.combo > 0 && (this.combo % 50 === 0)) {
      this.scene.gameEvent.emit(eventList.ComboPowerUp, null);
    }
  }
  private unlockBouncing(): void {
    this.isBouncing = false;
  }

  private hideCombo(): void {
    if (this.comboBarBg.alpha !== 0) {
      this.comboBar.alpha = 0;
      this.comboBarBg.alpha = 0;
    }
  }

  public getCurrentCombo(): number {
    return this.combo;
  }
}
