import * as PlayerConfig from '../configs/player';

import { Player } from "../objects/entities/player";
import { Controller } from '../helpers/controller';
import { AssetsLoader } from '../helpers/assetsLoader';
import { GameUI } from '../helpers/gameUI';
import { SfxManager } from '../helpers/sfxManager';
import { BaseMode } from '../managers/baseMode';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  public UI : GameUI;
  private sfxs : SfxManager;
  private waveManager;
  private assetsLoader : AssetsLoader;
  public gameEvent: Phaser.Events.EventEmitter;
  public kills: number;
  public player: Player;

  constructor() {
    super({
      key: "GameScene"
    });
    this.assetsLoader = new AssetsLoader({ scene: this });
    this.gameEvent = new Phaser.Events.EventEmitter();
    this.sfxs = new SfxManager({ scene: this });
  }

  preload(): void {
    this.assetsLoader.preloadAssets();
    this.sfxs.preloadSound();
  }

  init(): void {
    this.kills = 0;
  }

  create(): void {
    // create background
    this.background = this.add.sprite(0, 0,'cadre-de-guerre', "background.png");
    this.background.setOrigin(0, 0);

    // create objects
    var player1input = new Controller(this.scene);
    this.player = new Player({
      scene: this,
      controller: player1input,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      key: "bear",
      config: PlayerConfig.default
    });

    // create texts
    this.waveManager = new BaseMode({ scene: this });
    this.UI = new GameUI({scene : this, gameEvent : this.gameEvent});
    this.sfxs.initSound();
    this.waveManager.create();
    this.gameEvent.on('roundEnded', this.restartRound, this);
    this.restartRound();
  }

  update(time, delta): void {
    // update objects
    this.player.update();
    this.waveManager.update(time, delta);
  }

  getTimeLeft(): number {
    return this.waveManager.getTimeLeft() || 0;
  }

  restartRound(): void {
    this.gameEvent.emit('startCountdown', null);
    this.time.delayedCall(5000, this.restart, [], this);
  }
  restart(): void {
    this.gameEvent.emit('startRound', null);
  }
}
