import { eventList } from "../../configs/enums/eventList";
import { BaseDistribution } from "./baseDistribution";

export class SurvivalMode extends BaseDistribution {
  timeToNextBuff: number = 15000;
  playerLives: number = 1;
  timeSurvived: number = 0;
  maxEnemies = 5;
  buffEvent: Phaser.Time.TimerEvent = null;

  constructor(params) {
    super(params);
    this.timedEvent = this.scene.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true });
  }

  protected updateClock(): void {
    if (this.playerLives <= 0) {
      this.scene.player.shouldRespawn = false;
      if (this.onGoing) {
        this.roundEnded();
      }
      return;
    }
    this.timeSurvived++;
    this.scene.gameEvent.emit(eventList.TimeUpdate, null);
  }

  protected roundEnded(): void {
    this.onGoing = false;
    this.scene.gameEvent.emit(eventList.GameOver, { sound: 'Misc03', name: 'GameOver' });
  }

  // Getter
  public getTimeLeft(): number {
    return this.timeSurvived;
  }

  protected IntensityUp(): void {
    // let intensityType = Math.random() < 0.5 ? 'Power' : 'Number';
    // if (intensityType === 'Number') {
    if (this.maxEnemies < 30) {
      this.maxEnemies++;
    }
    let enemyType = this.pickEnemy();
    this.enemies.push(this.spawnEnemy(enemyType));
    // if (intensityType === 'Number') {
    this.enemiesLevel++;
    this.toEachEnemy(this.levelUpEnemy);
    // }
    // if (this.enemiesLevel % 10 === 0) {
    //   this.redistributeEnemies();
    // }
  }

  protected playerDied(entity): void {
    if (entity.faction === 'allies') {
      this.playerLives--;
    }
  }
}
