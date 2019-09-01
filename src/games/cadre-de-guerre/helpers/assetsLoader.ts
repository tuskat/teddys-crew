import { Config } from "../config";

export class AssetsLoader {
  private defaultUrl: string;
  private scene: Phaser.Scene;

  constructor(params) {
    this.defaultUrl = Config.FOLDER + '/sprites';
    this.scene = params.scene;
  }

  preloadAssets() {
    this.scene.load.multiatlas('cadre-de-guerre', this.defaultUrl + '/game-scene.json', this.defaultUrl);
    this.loadAnimation();
  }

  loadAnimation() {
    var frameNames = this.scene.anims.generateFrameNames('game-scene', {
      start: 1, end: 19, zeroPad: 4,
      prefix: 'burn_effect/burn_effect_', suffix: '.png'
    });
    console.log(frameNames);
    this.scene.anims.create({key: 'explode', frames: frameNames, frameRate: 10 })
  }
  
  // preloadAnimations(list) {
  //   list.forEach(element => {
  //     this.scene.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
  //     this.scene.load.json('gemData', 'assets/animations/gems.json');
  //   });
  // }
}
