import * as PlayerConfig from '../configs/player';

import { Player } from "../objects/entities/player";
import { MouseController } from '../helpers/inputs/mouseController';
import { AssetsLoader } from '../helpers/assetsLoader';
import { mapGenerator } from '../helpers/mapGenerator';
import { UserInterface } from '../managers/userExperience/userInterface';
import { SoundEffects } from '../managers/userExperience/soundEffects';
import { eventList } from '../configs/enums/eventList';
import { SurvivalMode } from '../managers/gameModes/survivalMode';
import { ComboManager } from '../managers/userExperience/comboManager';

export class GameScene extends Phaser.Scene {
  public UI : UserInterface;
  public comboWidget: ComboManager;
  private assetsLoader : AssetsLoader = null;
  private mapGenerator : mapGenerator = null;
  private soundEffectsManager : SoundEffects = null;
  private waveManager;
  public gameEvent: Phaser.Events.EventEmitter = null;
  public kills: number;
  public player: Player;

  constructor() {
    super({
      key: "GameScene"
    });

    if (this.gameEvent === null) {
      this.gameEvent = new Phaser.Events.EventEmitter();
    }

    this.assetsLoader = new AssetsLoader({ scene: this });
    this.mapGenerator = new mapGenerator({ scene: this });
    this.soundEffectsManager = new SoundEffects({ scene: this });
    this.gameEvent.on(eventList.RoundEnded, this.restartRound, this);
    this.gameEvent.on(eventList.GameOver, this.restartGame, this);
  }

  cleanse(): void {
    this.gameEvent.off(eventList.RoundEnded, this.restartRound, this);
    this.gameEvent.off(eventList.GameOver, this.restartGame, this);
    this.player.cleanse();
    this.waveManager.cleanse();
    this.soundEffectsManager.cleanse();
    this.UI.cleanse();
    this.comboWidget.cleanse();
    this.time.clearPendingEvents();
    this.time.removeAllEvents();
    this.game.events.removeAllListeners();
    this.children.getAll().forEach((child) => {
      child.destroy();
    });
  }

  preload(): void {
      this.assetsLoader.preloadAssets();
      this.soundEffectsManager.preloadSound();
      this.game.events.on('blur',function(){
        this.game.scene.pause('GameScene');
      },this);
      this.game.events.on('focus',function(){
        this.game.scene.resume('GameScene');
      },this);
  }

  init(): void {
    this.kills = 0;
  }

  create(): void {
    // Pause when out of foccin focus
    this.assetsLoader.loadAllAnimation();
    this.mapGenerator.create();

    // create objects
    let player1input = new MouseController(this.scene);
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
    this.waveManager = new SurvivalMode({ scene: this });
    this.UI = new UserInterface({scene : this, gameEvent : this.gameEvent});
    this.comboWidget = new ComboManager({scene : this, gameEvent : this.gameEvent});
    this.restartRound();

    if (!this.isLinuxFirefox()) {
      this.soundEffectsManager.initSound();
    }
  }

  update(time, delta): void {
    // update objects
    this.player.update(time, delta);
    this.waveManager.update(time, delta);
    this.comboWidget.update(time, delta);
  }

  getTimeLeft(): number {
    return this.waveManager.getTimeLeft() || 0;
  }

  getGameEvent(): Phaser.Events.EventEmitter {
    return this.gameEvent;
  }

  restartRound(): void {
    this.time.delayedCall(1000, () => {
      this.gameEvent.emit(eventList.CountDownStarted, null);
    }, [], this);

    this.time.delayedCall(5000, this.restart, [], this);
  }

  restartGame(): void {
    this.time.delayedCall(4000, () => {
      this.cleanse();
      this.scene.start("MenuScene");
    }, [], this);
  }

  restart(): void {
    this.gameEvent.emit(eventList.StartRound, null);
  }

  isLinuxFirefox(): boolean {
    // because it crash in soundManager
    let is_linux = /Linux/.test(window.navigator.platform);
    let is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    return (is_firefox && is_linux);
  }
}
