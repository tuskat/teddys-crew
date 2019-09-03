import * as PlayerConfig from '../configs/player';

import { Player } from "../objects/entities/player";
import { MouseController } from '../helpers/inputs/mouseController';
import { AssetsLoader } from '../helpers/assetsLoader';
import { UserInterface } from '../managers/userInterface';
import { SoundEffects } from '../managers/soundEffects';
import { BaseMode } from '../managers/gameModes/baseMode';

export class GameScene extends Phaser.Scene {
  private background: Phaser.GameObjects.Image;
  public UI : UserInterface;
  private assetsLoader : AssetsLoader = null;
  private soundEffectsManager : SoundEffects = null;
  private waveManager;
  public gameEvent: Phaser.Events.EventEmitter;
  public kills: number;
  public player: Player;

  constructor() {
    super({
      key: "GameScene"
    });
    this.assetsLoader = new AssetsLoader({ scene: this });
    this.gameEvent = new Phaser.Events.EventEmitter();
    this.soundEffectsManager = new SoundEffects({ scene: this });
  }

  preload(): void {
    this.assetsLoader.preloadAssets();
    this.soundEffectsManager.preloadSound();
  }

  init(): void {
    this.kills = 0;

  }

  create(): void {
    // Pause when out of foccin focus
    this.assetsLoader.loadAllAnimation();
    this.game.events.on('blur',function(){
      this.game.scene.pause('GameScene');
    },this);
    this.game.events.on('focus',function(){
      this.game.scene.resume('GameScene');
    },this);

    // create background
    this.background = this.add.sprite(0, 0,'game-atlas', "map.png");
    this.background.setOrigin(0, 0);

    // create objects
    var player1input = new MouseController(this.scene);
    this.player = new Player({
      scene: this,
      controller: player1input,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      key: "Hero/Idle",
      config: PlayerConfig.default,
      folder: "Hero"
    });

    // create texts
    this.waveManager = new BaseMode({ scene: this });
    this.UI = new UserInterface({scene : this, gameEvent : this.gameEvent});
    this.soundEffectsManager.initSound();
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

  getGameEvent(): Phaser.Events.EventEmitter {
    return this.gameEvent;
  }

  restartRound(): void {
    this.time.delayedCall(1000, () => {
      this.gameEvent.emit('startCountdown', null);
    }, [], this);

    this.time.delayedCall(5000, this.restart, [], this);
  }
  restart(): void {
    this.gameEvent.emit('startRound', null);
  }
}
