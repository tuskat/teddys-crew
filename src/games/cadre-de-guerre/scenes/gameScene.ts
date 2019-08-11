import * as PlayerConfig from '../configs/player';

import { Player } from "../objects/entities/player";
import { Controller } from '../helpers/controller';
import { AssetsLoader } from '../helpers/assetsLoader';
import { GameUI } from '../helpers/gameUI';
import { BaseMode } from '../managers/baseMode';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  public gameUI : GameUI;
  private gameManager;
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
  }

  preload(): void {
    this.assetsLoader.preloadAssets();
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
    this.gameManager = new BaseMode({ scene: this });
    this.gameUI = new GameUI({scene : this, gameEvent : this.gameEvent});
    this.gameManager.create();
    this.gameEvent.on('roundEnded', this.restartRound, this);
    this.restartRound();
  }

  update(time, delta): void {
    // update objects
    this.player.update();
    this.gameManager.update(time, delta);
  }

  getTimeLeft(): number {
    return this.gameManager.getTimeLeft() || 0;
  }

  restartRound(): void {
    this.gameEvent.emit('startCountdown', null);
    this.time.delayedCall(5000, this.restart, [], this);
  }
  restart(): void {
    this.gameEvent.emit('startRound', null);
  }
}
