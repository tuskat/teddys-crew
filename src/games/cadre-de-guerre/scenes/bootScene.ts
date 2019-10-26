import { AssetsLoader } from '../helpers/assetsLoader';
import { SoundEffects } from '../managers/userExperience/soundEffects';

export class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private assetsLoader: AssetsLoader = null;
  private soundLoader: SoundEffects = null;

  constructor() {
    super({
      key: "BootScene"
    });
  }

  preload(): void {
    // set the background, create the loading and progress bar
    let assetPrefix = TARGET === 'electron' ? 'assets' : '/src/games/cadre-de-guerre/assets';
    this.load.multiatlas('game-splash', assetPrefix + '/sprites/game-splash.json', assetPrefix + '/sprites/');
    // Game assets
    this.assetsLoader = new AssetsLoader({ scene: this });
    this.soundLoader = new SoundEffects({ scene: this });
    this.assetsLoader.preloadAssets();
    this.soundLoader.preloadSound();
    this.cameras.main.setBackgroundColor(0x000000);
    this.createLoadingGraphics();

    // pass value to change the loading bar fill
    this.load.on(
      "progress",
      function(value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x88e453, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    // delete bar graphics, when loading complete
    this.load.on(
      "complete",
      function() {
        window.dispatchEvent(new CustomEvent('loadingComplete'));
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );

  }

  update(): void {
    this.assetsLoader.loadAllAnimation();
    this.assetsLoader.loadCursor();
    this.scene.start("MenuScene");
  }

  private createLoadingGraphics(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0xffffff, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
    this.make.text({
      x: 0,
      y: 0,
      text: '',
      style:  {
        fontFamily: "Connection",
        fontSize: 1
      }
    });
  }
}
