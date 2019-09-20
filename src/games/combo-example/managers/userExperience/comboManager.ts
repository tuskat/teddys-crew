import { GameScene } from "../../scenes/gameScene";
import fontStyles from "../../configs/enums/fontStyles"; // Contains basic font styles used by the game

const BARWIDTH = 100;

export class ComboManager {
  private text: Phaser.GameObjects.Text[] = [];
  private rush = 0; // Combo/Hit/Rush...you name it
  private posX = 0; // Default posX (wrong?)
  private posY = 125; // Default posY
  private timeToClear = 3000; // Time it takes to go from 1 to 0 alpha
  private comboTime = this.timeToClear; // variable used to go from 3 to 0 seconds without affecting default value
  private isBouncing = false; // allow tweening on hit combo
  private comboBar: Phaser.GameObjects.Graphics; // bar below hit number
  private comboBarBg: Phaser.GameObjects.Graphics; // bg of bar
  private inputEvent: Phaser.Events.EventEmitter; // event emitter the manager listen to
  private scene: GameScene;

  constructor(params) {
    this.scene = params.scene;
    this.posX = this.scene.sys.canvas.width - 200; // make posX go to right side
    this.initCombo(params.controller.getEmitter());
  }

  // Init methods
  public initCombo(emitter): void {
    this.initCombobar(); // initialise bar
    this.initText(); // initialise text
    // events: on left click, increment combo, on right click make combo go back to 0
    this.inputEvent = emitter;
    this.inputEvent.on('dbuttonpressed', this.hitCallback, this);
    this.inputEvent.on('bbuttonpressed', this.missCallback, this);

  }
  // this method exist in the game because some event weren't correctly cleaned up upon scene change
  public cleanse(): void {
    this.inputEvent.off('dbuttonpressed', this.hitCallback, this);
    this.inputEvent.off('bbuttonpressed', this.missCallback, this);

  }

  private initText(): void {
    // Subtitle. Never really change so we just set the text once then flip the opacity value
    this.text['rush_subtitle'] = this.scene.make.text({
        x: this.posX,
        y: 100,
        text: "Rush!!",
        style: fontStyles.Default,
        alpha: 0
      }
      );
    // the number that goes up as you do sick combos
    this.text['rush'] = this.scene.make.text({
      x: this.posX,
      y: 50,
      text: this.rush + '',
      style: fontStyles.Title,
      alpha: 0
    }
    );
  }
  // really basic. Makes a black rectangle of 75% opacity and initialise the real bar with...nothing
  private initCombobar(): void {
    this.comboBarBg = this.scene.add.graphics();
    this.comboBarBg.fillStyle(0x000000, 0.75);
    this.comboBarBg.fillRect(this.posX, this.posY, BARWIDTH, 30);
    this.comboBar = this.scene.add.graphics();
  }
  // update bar according to how much time is left before your combo reset
  private updateComboBar(): void {
    this.comboBar.clear();
    this.comboBar.fillStyle(0xffffff, 1);
    this.comboBar.fillRect(this.posX, this.posY, (this.comboTime / this.timeToClear) * BARWIDTH, 30);
  }
  // whenever you hit
  private hitCallback(): void {
    this.rush++;
    this.comboTime = this.timeToClear;
    this.updateCombo();
  }
  // whenever you get hit
  private missCallback(): void {
    this.rush = 0;
    this.hideCombo();
  }
  // update function for the game loop
  // delta is what helping us to smoothly use time to update the thingy
  public update(time, delta): void {
    if (this.rush > 0) {
        this.updateComboBar();
        this.comboTime-= delta;
        if (this.comboTime <= 0) {
            this.rush = 0;
        }
    } else {
      // time's up, combo dead
      this.hideCombo();
    }
  }
  // Update methods
  private updateCombo(): void {
    // value of tweening effect that make text pop upon hit.
    // treshold is 1.25 so it doesn't become needlessly massive
    let scale = 1 * (1 + (this.rush / 100));
    if (scale > 1.25) {
        scale = 1.25;
    }
    // update rush/hit/combo field
    this.text['rush'].setText(this.rush);
    // add opacity tweening to both rush and rush_subtitle
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
    // add scaling tweening to both rush and rush_subtitle
    if (this.isBouncing === false) {
        this.scene.add.tween({
            targets: [this.text['rush'], this.text['rush_subtitle']],
            scale: scale,
            duration: 200,
            ease: 'Bounce.easeInOut',
            yoyo: true,
            // callback on complete set the isBouncing back to false, allowing from unimpterrupted tweens
            onComplete: this.unlockBouncing.bind(this)
        });
        // condition isBouncing prevent it from short circuiting itself I guess
        this.isBouncing = true;
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
}
