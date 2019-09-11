import { GameScene } from "../../scenes/gameScene";
import { eventList } from "../../configs/enums/eventList";
import fontStyles from "../../configs/enums/fontStyles";


const BARWIDTH = 100;

export class ComboManager {
  private text: Phaser.GameObjects.Text[] = [];
  private rush = 0;
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
    this.text['rush_subtitle'] = this.scene.make.text({
        x: this.posX,
        y: 100,
        text: "Rush!!",
        style: fontStyles.Default,
        alpha: 0
      }
      );
    this.text['rush'] = this.scene.make.text({
      x: this.posX,
      y: 50,
      text: this.rush + '',
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
        this.rush++;
        this.comboTime = this.timeToClear;
        this.updateCombo();
        // this.showComboBar();
    }
  }

  private missCallback(event): void {
    // flimsy logic there
    if (event) {
        this.rush = 0;
        this.hideCombo();
    }
  }

  public update(time, delta): void {
    if (this.rush > 0) {
        this.updateComboBar();
        this.comboTime-= delta;
        if (this.comboTime <= 0) {
            this.rush = 0;
        }
    } else {
        this.hideCombo();
    }
  }
  // Update methods
  private updateCombo(): void {
    let scale = 1 * (1 + (this.rush / 100));
    if (scale > 1.25) {
        scale = 1.25;
    }
    this.text['rush'].setText(this.rush);
    this.scene.add.tween({
        targets: [this.text['rush'], this.text['rush_subtitle'], this.comboBar, this.comboBarBg],
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
            targets: [this.text['rush'], this.text['rush_subtitle']],
            scale: scale, 
            duration: 200, 
            ease: 'Bounce.easeInOut', 
            yoyo: true,
            onComplete: this.unlockBouncing.bind(this)
        });
        this.isBouncing = true;
    }
  }

  private unlockBouncing(): void {
    this.isBouncing = false;
  }

  private showComboBar(): void {
    this.comboBar.alpha = 0.75;
    this.comboBarBg.alpha = 0.75;
  }

  private hideCombo(): void {
    if (this.comboBarBg.alpha !== 0) {
        this.comboBar.alpha = 0;
        this.comboBarBg.alpha = 0;
    }
  }

  public flush(): void {
    // this.gameEvent.on(eventList.LifeUpdate, this.missCallback, this);
    // this.gameEvent.on(eventList.Damaged, this.hitCallback, this);
    this.gameEvent.off(eventList.LifeUpdate, this.missCallback, this);
    this.gameEvent.off(eventList.Damaged, this.hitCallback, this);
  }
}
