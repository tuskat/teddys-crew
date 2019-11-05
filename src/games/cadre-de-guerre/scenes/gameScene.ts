import * as Torb from '../configs/characters/torb';
import * as Ors from '../configs/characters/ors';

import { Player } from "../objects/entities/player";
import { MouseController } from '../helpers/inputs/mouseController';

import { MapGenerator } from '../helpers/mapGenerator';
import { UserInterface } from '../managers/userExperience/userInterface';
import { SoundEffects } from '../managers/userExperience/soundEffects';
import { eventList } from '../configs/enums/eventList';
import { SurvivalMode } from '../managers/gameModes/survivalMode';
import { ComboManager } from '../managers/userExperience/comboManager';
import { InfoHandler } from '../managers/userExperience/infoHandler';
import { DebugMode } from '../managers/gameModes/debugMode';

export class GameScene extends Phaser.Scene {
  public UI: UserInterface;
  public comboWidget: ComboManager;

  public mapGenerator: MapGenerator = null;
  private soundEffectsManager: SoundEffects = null;
  private infoHandler: InfoHandler = null;
  private waveManager;
  public gameEvent: Phaser.Events.EventEmitter = null;
  public kills: number = 0;
  private gold: number;
  public player: Player;
  protected selectedCharacter = Torb.default;
  protected selectedMode: any = SurvivalMode;
  //  to make more...you know
  private defaultMusic = 'firmament_loopA';

  constructor() {
    super({
      key: "GameScene"
    });

    if (this.gameEvent === null) {
      this.gameEvent = new Phaser.Events.EventEmitter();
    }

    this.mapGenerator = new MapGenerator({ scene: this });
    this.infoHandler = new InfoHandler({ scene: this });
    this.soundEffectsManager = new SoundEffects({ scene: this });
    this.gameEvent.on(eventList.RoundEnded, this.restartRound, this);
    this.gameEvent.on(eventList.GameOver, this.restartGame, this);
  }

  cleanse(): void {
    // All events listenings are removed, shouldn't need to gameEvent.off on Scene
    this.player.cleanse();
    this.waveManager.cleanse();
    this.soundEffectsManager.cleanse();
    this.UI.cleanse();
    this.comboWidget.cleanse();
    this.infoHandler.cleanse();
    this.time.clearPendingEvents();
    this.time.removeAllEvents();
    this.game.events.removeAllListeners();
    this.children.getAll().forEach((child) => {
      child.destroy();
    });
  }

  preload(): void {

    this.infoHandler.initInfoLog();
    window.addEventListener('resumeGame', this.resumeGame.bind(this));
    window.addEventListener('pauseGame', this.pauseGame.bind(this));
    this.game.events.on('blur', function () {
      this.pauseGame();
    }, this);
  }

  pauseGame(): void {
    this.game.scene.pause('GameScene');
    window.dispatchEvent(new CustomEvent('showUI'));
  }

  resumeGame(): void {
    this.game.scene.resume('GameScene');
  }

  init(data?): void {
    this.gold = 0;
    if (data) {
      this.selectedCharacter = this.getCharacterConfig(data.character) || this.selectedCharacter;
      this.selectedMode = this.getGameMode(data.gameMode) || this.selectedMode;
    }
  }

  getCharacterConfig(character) {
    switch (character) {
      case 'Torb': {
        return Torb.default;
      }
      case 'Ors': {
        return Ors.default;
      }
      default: {
        return Torb.default;
      }
    }
  }

  getGameMode(gameMode) {
    switch (gameMode) {
      case 'Survival': {
        return SurvivalMode;
      }
      case 'Debug': {
        return DebugMode;
      }
      default: {
        return SurvivalMode;
      }
    }
  }

  earnGold(gold): void {
    this.gold += gold;
  }

  create(): void {
    // Pause when out of foccin focus
    window.dispatchEvent(new CustomEvent('scene', { detail: { scene: 'game'}}));

    this.mapGenerator.create();
    // create objects
    this.player = this.createPlayer(MouseController, this.selectedCharacter);
    this.player.inputEvent.on('pauseButtonPressed', function () {
      if (this.game.scene.isPaused('gameScene')) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    }, this);
    // this.cameras.main.setBounds(0, 0, 1280, 900);
    // this.physics.world.setBounds(-1024, -1024, 1024 * 2, 1024 * 2);
    // this.cameras.main.startFollow(this.player, true);
    this.waveManager = new this.selectedMode({ scene: this });
    this.UI = new UserInterface({ scene: this, gameEvent: this.gameEvent });
    this.comboWidget = new ComboManager({ scene: this, gameEvent: this.gameEvent });
    this.restartRound();
    if (!this.isLinuxFirefox()) {
      this.soundEffectsManager.initSound();
      this.soundEffectsManager.playMusic(this.defaultMusic);
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
      this.scene.start("ScoreScene", { gold: this.gold } );
    }, [], this);
  }

  restart(): void {
    this.gameEvent.emit(eventList.StartRound, null);
  }

  isLinuxFirefox(): boolean {
    // Firefox seems to not support mp3
    let is_linux = /Linux/.test(window.navigator.platform);
    let is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    return (is_firefox && is_linux);
  }

  createPlayer(controller, character): any {
    let player1input = new controller(this.scene);
    let playerConfig = {
      scene: this,
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      controller: player1input,
      key: `${character.name}/Idle`,
      config: character,
      folder: character.name 
    }
    return new Player(playerConfig);
  }
}
