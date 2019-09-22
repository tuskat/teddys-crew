import { Config } from "../config";

export class AssetsLoader {
  private assetsFolder: string;
  private scene: Phaser.Scene;
  private effectList = [
    { prefix: 'Air_14_', name: 'dash', frame : 5, framerate: 16 },
    { prefix: 'Mix_04_', name: 'explode', frame : 22, framerate: 50 },
    { prefix: 'Fire_13_', name: 'fire', frame : 11, framerate: 16, repeat: -1 },
    { prefix: 'fire_29_new_', name: 'fireShield', frame : 17, framerate: 35, repeat: -1 },
    { prefix: 'sparks_04_', name: 'hit', frame : 4, framerate: 50 },
    { prefix: 'water_05_', name: 'waterSpawn', frame : 8, framerate: 16 },
    { prefix: 'water_03_', name: 'waterBullet', frame : 4, framerate: 32, repeat: -1 },
    { prefix: 'water_03_', name: 'waterBulletHit', frame : 11, framerate: 32, start: 5 },
    { prefix: 'water_09_', name: 'waterExplode', frame : 9, framerate: 25 },
  ];

  constructor(params) {
    this.assetsFolder = Config.ASSETS + '/sprites';
    this.scene = params.scene;
  }

  preloadAssets() {
    this.scene.load.multiatlas('game-atlas', this.assetsFolder + '/game-scene.json', this.assetsFolder);
    this.scene.load.multiatlas('game-sfx', this.assetsFolder + '/game-sfx.json', this.assetsFolder);
    this.scene.load.image('game-tiles', this.assetsFolder + '/atlantis-tileset.png');
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
}
