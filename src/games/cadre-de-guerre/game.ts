import "phaser";
import { BootScene } from "./scenes/bootScene";
import { GameScene } from "./scenes/gameScene";
import { MenuScene } from "./scenes/menuScene";
import { Config } from "./config";
import { ObjectUtils } from "./utils/objectUtils";
// import * as Sentry from '@sentry/browser';

// Sentry.init({ dsn: 'https://62328e69a6ab42c7b2af12cbf867e69b@sentry.io/1527013' });
// Sentry.captureException(new Error("Something broke"));

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }

  preload(): void {
    this.boot;
  }
}

window.addEventListener("load", () => {
  if (!AudioContext) {
    const audioContext = new AudioContext();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }
  launch();
});

async function launch(): Promise<void> {

  let configJson: any = null;
  try {
      configJson = await ObjectUtils.loadJson(Config.ASSETS + "/config.json");
      ObjectUtils.loadValuesIntoObject(configJson, Config);
  } catch (e) {
      throw e;
  }
  // to clean up, eventually...
  const config: Phaser.Types.Core.GameConfig = {
    title: Config.TITLE,
    version: "0.1",
    disableContextMenu: true,
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      parent: 'game',
      width: Config.GAME_WIDTH,
      height: Config.GAME_HEIGHT
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
  let game = new Game(config);
}
