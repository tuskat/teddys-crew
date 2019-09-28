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

async function launch(): Promise<void> {
  let configJson: any = null;
  let debug = process.env.NODE_ENV !== 'production' ? true : false;

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
    type: Phaser.WEBGL, // shader might crash
    scale: {
      mode: Phaser.Scale.FIT,
      parent: 'game',
      width: Config.GAME_WIDTH,
      height: Config.GAME_HEIGHT,
      autoRound: true
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
        debug: debug
      }
    },
    backgroundColor: "#3A99D9",
    render: { 
      pixelArt: false, 
      antialias: true,
      clearBeforeRender: false
    }
  };
  let game = new Game(config);
}

let canvas = null;
window.addEventListener("load", () => {
  if (!AudioContext) {
    const audioContext = new AudioContext();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }
  launch();
  canvas = document.querySelector("canvas");
  window.addEventListener("resize", resize, false);
});

function resize() {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = Config.GAME_WIDTH / Config.GAME_HEIGHT;

  if (canvas) {
    if(windowRatio < gameRatio){
      canvas.style.width = windowWidth;
      canvas.style.height = (windowWidth / gameRatio);
    }
    else {
      canvas.style.width = (windowHeight * gameRatio);
      canvas.style.height = windowHeight;
    }
  }
} 