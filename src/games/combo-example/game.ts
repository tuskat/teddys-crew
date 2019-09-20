import "phaser";
import { GameScene } from "./scenes/gameScene";

const config: Phaser.Types.Core.GameConfig = {
  title: 'Combo Manager',
  version: "0.1",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    width: 640,
    height: 480
},
  parent: "game",
  scene: [GameScene],
  input: {
    mouse: true
  },
  backgroundColor: "#3A99D9",
  render: { pixelArt: false, antialias: true }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }

  preload(): void {
    this.boot;
  }
}

window.addEventListener("load", () => {
  launch();
});

async function launch(): Promise<void> {
  let game = new Game(config);
}
