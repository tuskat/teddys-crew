import { Config } from "../config";
import effectList from "../configs/enums/effectList";
import { GameScene } from "../scenes/gameScene";
import { ObjectUtils } from "../utils/objectUtils";

export class AssetsLoader {
  scene: GameScene;
  private assetsFolder: string;
  private shaderFolder: string;
  private assetKeys = ['game-atlas', 'shadows', 'game-sfx', 'game-tiles'];
  private effectList = effectList;
  private paletteIndex: number = 0;

  constructor(params) {
    this.assetsFolder = Config.ASSETS + '/sprites';
    this.shaderFolder = Config.ASSETS + '/shaders';
    this.scene = params.scene;
  }

  preloadAssets() {
    this.scene.load.multiatlas('game-atlas', this.assetsFolder + '/game-scene.json', this.assetsFolder);
    this.scene.load.multiatlas('game-sfx', this.assetsFolder + '/game-sfx.json', this.assetsFolder);
    this.scene.load.image('game-tiles', this.assetsFolder + '/game-tileset.png');
    this.scene.load.image('noise', this.assetsFolder + '/noise.png');
    this.scene.load.glsl('palette', this.shaderFolder + '/palette.glsl.js');
  
    this.createShadows();
    this.createWaterPool();
  }

  createShadows() {
    let { centerX , centerY } = this.scene.screenCenter();
    let shape = this.scene.add.graphics();
 
    shape.fillStyle(0x000000, 0.35);
    shape.fillEllipse(centerX, centerY + 30, 80,20);
    shape.generateTexture('shadow');
    shape.destroy();
  }

  createWaterPool() {
    let { centerX , centerY } = this.scene.screenCenter();
    let shape = this.scene.add.graphics();
 
    shape.fillStyle(0x3A99D9, 1);
    shape.fillRect(centerX, centerY, 32 * 6, 32 * 6);
    shape.generateTexture('gunk');
    shape.destroy();
  }

  createPalette() {
    let palette: any = this.scene.add.shader('palette').setVisible(false);
    palette.setRenderToTexture('entity_' + this.paletteIndex, true);
    palette.setChannel0('game_atlas');

    let atlas = this.scene.cache.json.get('game_atlas');
    let texture = this.scene.textures.list['entity_' + this.paletteIndex];
    ObjectUtils.JSONArray(texture, 0, atlas);
    palette.getUniform('color').value = {x: 0.5, y: 0.5, z: 0.5};
    palette.renderWebGL(palette.renderer, palette);

    palette.renderToTexture = false;
  }

  loadAllAnimation() {
    for (let i = 0; i !== this.effectList.length; i++) {
      this.loadAnimation(this.effectList[i]);
    }
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
