import { ObjectUtils } from "../../utils/objectUtils";
import { BaseLogic } from './baseLogic';
import { Enemy } from "../../objects/entities/enemy";
import { eventList } from "../../configs/enums/eventList";
const { matches } = require('z');

export class DistributionLogic extends BaseLogic {

  constructor(params) {
    super(params);
  }

  protected redistributeEnemies(): any {
    this.toEachEnemy(this.killEnemy);
    this.toEachEnemy(this.flushEnemy);
    this.enemies = [];
    this.batchSpawn();
    this.toEachEnemy(this.killSilentlyEnemy);
  }

  protected batchSpawn(): void {
    // divide the weight by the number of enemies  
    
    for (let i = 0; i != this.maxEnemies; i++) {
      let enemyType = this.pickEnemy();
      this.enemies.push(this.spawnEnemy(enemyType));
    }
  }
  
  protected spawnInitialEnemies(): void {
    this.batchSpawn();
  }

  pickEnemy(): string {
    let type = (parseInt(this.enemySequence()) + 1);
    return matches(type)(
      (x = 1) => 'Dasher',
      (x = 2) => 'Shooter',
      (x = 3) => 'Zoner'
    );
  }
  
  protected startRound(): void {
    this.timeLeft = this.startTime;
    this.toEachEnemy(this.setRespawn);
    this.onGoing = true;
    if (this.round === 0) {
      this.spawnInitialEnemies();
      this.toEachEnemy(this.killSilentlyEnemy);
    } else {
      this.toEachEnemy(this.respawnEnemy);
    }
    this.scene.gameEvent.emit(eventList.RoundStarted, null);
  }

  protected spawnEnemy(enemyClass): any {
    let config = this.getEnemyClassConfig(enemyClass);
    let enemy = new Enemy({
      scene: this.scene,
      x: Phaser.Math.RND.integerInRange(100, 700),
      y: Phaser.Math.RND.integerInRange(100, 500),
      key: enemyClass + "/Idle",
      player: this.scene.player,
      config: config,
      folder: enemyClass,
      level: this.enemiesLevel
    });
    this.setAllOverlaps(enemy);
    this.setBackgroundCollision(enemy);
    return enemy;
  }

  enemySequence(): any {
    switch (this.enemiesLevel % 5) {
      case 0: {
        return ObjectUtils.weightedRandomization({ 0: 0, 1: 0.1, 2: 0.9 });
      }
      case 2: {
        return ObjectUtils.weightedRandomization({ 0: 0.2, 1: 0.75, 2: 0.05 });
      }
      case 4: {
        return ObjectUtils.weightedRandomization({ 0: 0.25, 1: 0.7, 2: 0.05 });
      }
      default: {
        return ObjectUtils.weightedRandomization({ 0: 0.75, 1: 0.2, 2: 0.05 });
      }
    }
  }
}
