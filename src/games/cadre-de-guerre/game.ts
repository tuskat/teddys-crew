import "phaser";
import { GameScene } from "./scenes/gameScene";

const config: Phaser.Types.Core.GameConfig = {
  title: "Cadre de Guerre",
  version: "0.1",
  width: 768,
  height: 576,
  disableContextMenu: true,
  // width: window.innerWidth * window.devicePixelRatio,
  // height:  window.innerHeight * window.devicePixelRatio,
  type: Phaser.CANVAS,
  parent: "game",
  scene: [GameScene],
  input: {
    keyboard: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  backgroundColor: "#3A99D9",
  render: { pixelArt: false, antialias: false }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  var game = new Game(config);
});
