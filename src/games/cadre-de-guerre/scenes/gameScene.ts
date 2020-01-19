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
  public UI: UserInterface = null;
  public comboWidget: ComboManager;
  public mapGenerator: MapGenerator = null;
  private soundEffectsManager: SoundEffects = null;
  private infoHandler: InfoHandler = null;
  private waveManager: any = null;
  public gameEvent: Phaser.Events.EventEmitter = null;
  public kills: number = 0;
  private gold: number = 0;
  private maxCombo: number = 0;
  public player: Player = null;
  protected selectedCharacter = Torb.default;
  protected selectedMode: any = SurvivalMode;
  //  to make more...you know
  private defaultMusic = 'firmament_loopA';

  constructor() {
    super({
      key: "GameScene"
    });
    this.handleSceneEvents();
  }
  handleSceneEvents() {
    this.cleanse();
    window.addEventListener('resumeGame', this.resumeGame.bind(this));
    window.addEventListener('pauseGame', this.pauseGame.bind(this));
  }

  cleanse(): void {
    window.removeEventListener('resumeGame', this.resumeGame.bind(this));
    window.removeEventListener('pauseGame', this.pauseGame.bind(this));
    
    if (this.time) {
      this.time.clearPendingEvents();
      this.time.removeAllEvents();
    }

    if (this.gameEvent) {
      this.game.events.removeAllListeners();
      this.gameEvent.removeAllListeners();
    }
  }

  preload(): void {
    this.game.events.on('blur', function () {
      this.pauseGame();
    }, this);
  }

  pauseGame(): void {
    if (this.scene.isActive()) {
      this.scene.pause();
      window.dispatchEvent(new CustomEvent('showUI'));
    }
  }

  resumeGame(): void {
    this.scene.resume();
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
    this.gameEvent = new Phaser.Events.EventEmitter();
    this.mapGenerator = new MapGenerator({ scene: this });
    this.infoHandler = new InfoHandler({ scene: this });
    this.soundEffectsManager = new SoundEffects({ scene: this });
    this.gameEvent.on(eventList.RoundEnded, this.restartRound, this);
    this.gameEvent.on(eventList.GameOver, this.restartGame, this);
    this.gameEvent.on(eventList.ComboLoss, this.comboLossHandler, this);
    window.dispatchEvent(new CustomEvent('sceneChanged', { detail: { scene: 'game'}}));
    this.infoHandler.initInfoLog();
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

  getEnemiesKilled(): number {
    return this.waveManager.getEnemiesKilled() || 0;
  }

  getMaxCombo(): number {
    return this.maxCombo;
  }

  getGameEvent(): Phaser.Events.EventEmitter {
    return this.gameEvent;
  }

  restartRound(): void {
    let timeToWait = 3000;
    this.time.delayedCall(1000, () => {
      this.gameEvent.emit(eventList.CountDownStarted, null);
    }, [], this);

    this.time.delayedCall(timeToWait, this.restart, [], this);
  }

  restartGame(): void {
    let scoreStats = {
      gold: this.gold,
      timeSurvived: this.getTimeLeft(),
      enemiesKilled: this.getEnemiesKilled(),
      maxCombo: this.getMaxCombo()
    }
    this.time.delayedCall(4000, () => {
      this.scene.start("ScoreScene", scoreStats );
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
  comboLossHandler(obj) {
    if (obj.maxCombo > this.maxCombo) {
      this.maxCombo = obj.maxCombo
    }
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

  public getEntities() {
    let entities = { 
      player: this.player,
      enemies : this.waveManager.getEnemyGroup() 
    };
    return entities;
  }
}
