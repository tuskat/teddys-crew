import { Config } from "../config";

export class AssetsLoader {
  private assetsFolder: string;
  private scene: Phaser.Scene;

  constructor(params) {
    this.assetsFolder = Config.FOLDER + '/sprites';
    this.scene = params.scene;
  }

  preloadAssets() {
    this.scene.load.multiatlas('game-atlas', this.assetsFolder + '/game-scene.json', this.assetsFolder);
    this.scene.load.multiatlas('game-sfx', this.assetsFolder + '/game-sfx.json', this.assetsFolder);
  }

  loadAllAnimation() {
    this.loadAnimation('Air_14_', 'dash', 5, 16);
    this.loadAnimation('Mix_04_', 'explode', 22);
  }
  loadAnimation(prefix, gfxName, end, framerate = 50) {
    var frameNames = this.scene.anims.generateFrameNames('game-sfx', {
      start: 1, end: end, zeroPad: 5,
      prefix: prefix, suffix: '.png'
    });
    this.scene.anims.create({key: gfxName, frames: frameNames, frameRate: framerate })
  }
  
  // preloadAnimations(list) {
  //   list.forEach(element => {
  //     this.scene.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
  //     this.scene.load.json('gemData', 'assets/animations/gems.json');
  //   });
  // }
}
