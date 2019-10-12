import { eventList } from "../../../configs/enums/eventList";
import { CurrentState } from "../../../configs/enums/currentStates";
import { SkilledEntity } from "./skilledEntity";
const { matches } = require('z');

export class LevellingEntity extends SkilledEntity {
  experience = 0;
  experienceToLevelUp = 18;

  constructor(params) {
    super(params);
    this.initLevel();
    if (params.level > 1) {
      this.powerLevel(params.level);
    }
  }

  protected initLevel(): void {
    this.gameEvent = this.scene.getGameEvent();
    if (this.gameEvent) {
      this.gameEvent.on(eventList.Dying, this.experienceGained, this);
    }
  }

  protected powerLevel(level): void {
    for (let i = 1; i !== level; i++) {
      this.level++;
      this.distributeStats();
    }
  }

  protected distributeStats(): string {
    let buff = '';
    switch (this.level % 3) {
      case 0: {
        this.power++;
        buff = 'Power Up';
        break;
      }
      case 1: {
        this.speed = this.speed + (this.speed * 0.075);
        buff = 'Speed Up';
        break;
      }
      case 2: {
        this.life += 2;
        this.maxLife += 2;
        buff = 'Hp Up';
        // enum to set "Allies =1, Foes, Neutrals"
        if (this.faction === 'allies') {
          this.scene.gameEvent.emit(eventList.LifeUpdate, null);
        }
        break;
      }
    }
    return buff;
  }

  public getExperience(): number {
    return (7 * (this.level * this.config.baseXP));
  }

  private getCoefficient(): number {
    let coefficient = 0;
    if (this.level <= 5) {
      coefficient = 0.75;
    } else if (this.level <= 10) {
      coefficient = 0.5;
    } else {
      coefficient = 0.25
    }
    return coefficient;
  }

  protected levelUp(): void {
    let coefficient = this.getCoefficient();
    this.level++;
    this.experience = this.experience - this.experienceToLevelUp;
    this.experienceToLevelUp = (this.experienceToLevelUp + (this.experienceToLevelUp * coefficient));
    // to be decided separately later
    let buff = this.distributeStats();
    if (this.experience > this.experienceToLevelUp) {
      return this.levelUp();
    }
    this.scene.gameEvent.emit(eventList.LevelUp,  { sound: 'PowerUp03', entity: this, buff: buff });
    if (this.state !== CurrentState.Dead) {
      this.createGraphicEffect(this.animationPreset.levelUp, true);
    }
  }

  // make generic
  protected experienceGained(event): void {
      if (event.faction !== this.faction) {
        this.experience += event.experience;
        if (this.experience >= this.experienceToLevelUp) {
          this.levelUp();
      }
    }
  }

  flushCustom(): void {
    this.gameEvent.off(eventList.Dying, this.experienceGained, this);
  }
}
