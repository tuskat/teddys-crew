export class AssetsLoader {
  private defaultUrl: string;
  private scene: Phaser.Scene;

  constructor(params) {
    this.defaultUrl = '/src/games/cadre-de-guerre/assets/sprites';
    this.scene = params.scene;
  }

  preloadAssets() {
    this.scene.load.multiatlas('cadre-de-guerre', this.defaultUrl + '/game-scene.json', this.defaultUrl);
  }

  // preloadAnimations(list) {
  //   list.forEach(element => {
  //     this.scene.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
  //     this.scene.load.json('gemData', 'assets/animations/gems.json');
  //   });
  // }
}
