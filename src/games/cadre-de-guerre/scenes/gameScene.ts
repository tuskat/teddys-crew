import * as PlayerConfig from '../configs/player';
// import { Coin } from "../objects/coin";

import { Player } from "../objects/entities/player";
import { Controller } from '../helpers/controller';
import { AssetsLoader } from '../helpers/assetsLoader';
import { GameUI } from '../helpers/gameUI';
import { BaseMode } from '../managers/baseMode';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  // private coin: Coin;
  public gameUI : GameUI;
  private gameManager : BaseMode;
  private assetsLoader : AssetsLoader;

  // public monster: MeleeEnemy;
  public kills: number;
  public player: Player;

  constructor() {
    super({
      key: "GameScene"
    });
    this.assetsLoader = new AssetsLoader({ scene: this });
  }

  preload(): void {
    this.assetsLoader.preloadAssets(['bear', 'monster', 'background']);
  }

  init(): void {
    this.kills = 0;
  }

  create(): void {
    // create background
    this.background = this.add.image(0, 0, "background");
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
    this.gameUI = new GameUI({scene : this, playerEvent : this.player.getPlayerEvent()});
    this.gameManager.create();
  }

  update(time, delta): void {
    // update objects
    this.player.update();
    this.gameManager.update(time, delta);
  }

  getTimeLeft(): number {
    return this.gameManager.getTimeLeft() || 0;
  }
}
