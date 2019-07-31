export class AssetsLoader {
  private defaultUrl: string;
  private scene: Phaser.Scene;

  constructor(params) {
    this.defaultUrl = './src/games/cadre-de-guerre/assets/';
    this.scene = params.scene;
  }

  preloadAssets(list) {
    list.forEach(element => {
      this.scene.load.image(element, this.defaultUrl + element + '.png');
    });
  }
}
