import "phaser";
import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";
import { MenuScene } from "./scenes/menuScene";
// import * as Sentry from '@sentry/browser';

// Sentry.init({ dsn: 'https://62328e69a6ab42c7b2af12cbf867e69b@sentry.io/1527013' });

// Sentry.captureException(new Error("Something broke"));
const config: Phaser.Types.Core.GameConfig = {
  title: "Cadre de Guerre",
  version: "0.1",
  disableContextMenu: true,
  // width: window.innerWidth * window.devicePixelRatio,
  // height:  window.innerHeight * window.devicePixelRatio,
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    width: 1024,
    height: 720
},
  parent: "game",
  scene: [BootScene, MenuScene, GameScene],
  input: {
    mouse: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
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
  var game = new Game(config);
});
