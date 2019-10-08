import { Config } from "../config";
import effectList from "../configs/enums/effectList";

export class AssetsLoader {
  private assetsFolder: string;
  private scene: Phaser.Scene;
  private assetKeys = ['game-atlas', 'shadows', 'game-sfx', 'game-tiles'];
  private effectList = effectList;

  constructor(params) {
    this.assetsFolder = Config.ASSETS + '/sprites';
    this.scene = params.scene;
  }

  preloadAssets() {
    this.scene.load.multiatlas('game-atlas', this.assetsFolder + '/game-scene.json', this.assetsFolder);
    this.scene.load.multiatlas('game-sfx', this.assetsFolder + '/game-sfx.json', this.assetsFolder);
    this.scene.load.multiatlas('game-ui', this.assetsFolder + '/game-ui.json', this.assetsFolder);
    this.scene.load.image('game-tiles', this.assetsFolder + '/game-tileset.png');
    this.createShadows();
  }

  createShadows() {
    let shape = this.scene.add.graphics();
 
    shape.fillStyle(0x000000, 0.35);
    shape.fillEllipse(this.scene.sys.canvas.width / 2, (this.scene.sys.canvas.height / 2) + 30, 80,20);
    shape.generateTexture('shadow');
    shape.destroy();
  }

  loadAllAnimation() {
    for (let i = 0; i !== this.effectList.length; i++) {
      this.loadAnimation(this.effectList[i]);
    }
  }

  loadCursor() {
    this.scene.input.setDefaultCursor(`url(${this.assetsFolder}/cursor.png), pointer`);
  }

  loadAnimation(animConfig) {
    let frameNames = this.scene.anims.generateFrameNames('game-sfx', {
      start: animConfig.start || 0, end: animConfig.frame, zeroPad: 5,
      prefix: animConfig.prefix, suffix: '.png'
    });
    this.scene.anims.create({key: animConfig.name, frames: frameNames, frameRate: animConfig.framerate, repeat: animConfig.repeat || 0 })
  }

  // setTexturesPriority() {
  //   var enabled = this.scene.game.renderer.setTexturePriority(this.assetKeys);
  //   //  So we can see which textures were batched (varies per GPU)
  //   console.log(enabled);
  // }
}
