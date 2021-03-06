import * as AnglerConfig from '../../configs/characters/angler';
import * as DasherConfig from '../../configs/characters/dasher';
import * as ShooterConfig from '../../configs/characters/shooter';
import * as ZonerConfig from '../../configs/characters/zoner';

import { GameScene } from "../../scenes/gameScene";
import { eventList } from "../../configs/enums/eventList";

export class BaseLogic {
  scene: GameScene;
  maxEnemies = 1;
  enemiesLevel = 1;
  startTime = 15;
  playerLives: number = 1;
  onGoing = false;
  round = 0;
  enemies = [];
  timeLeft = 0;
  enemiesKilled = 0;
  timedEvent: Phaser.Time.TimerEvent = null;

  constructor(params) {
    this.cleanse();
    this.scene = params.scene;
    this.setBackgroundCollision(this.scene.player);

    this.scene.gameEvent.on(eventList.StartRound, this.startRound, this);
    this.scene.gameEvent.on(eventList.Dying, this.entityDied, this);
  }

  public cleanse(): void {
    if (!this.scene) {
      return;
    }
    this.toEachEnemy(this.flushEnemy);
    this.enemies = null;
    this.timedEvent.remove(false);
  }

  update(): void {
    if (this.onGoing) {
      this.toEachEnemy(this.updateEnemy);
    }
  }

  protected updateEnemy(enemy): void {
    enemy.update();
  }

  protected updateClock(): void {
    if (this.timeLeft === 0) {
      if (this.onGoing) {
        this.roundEnded();
        this.timedEvent.destroy();
      }
      return;
    }
    this.timeLeft--;
    this.scene.gameEvent.emit(eventList.TimeUpdate, null);
  }

  // Spawn/Kill
  protected entityDied(entity): void {
    if (entity.faction === 'foes') {
      this.enemiesKilled++;
    } else if (entity.faction === 'allies') {
      this.playerLives--;
    }
  }

  protected killEnemy(enemy): void {
    enemy.die(true, false);
  }

  protected flushEnemy(enemy): void {
    enemy.cleanse();
  }

  protected killSilentlyEnemy(enemy): void {
    enemy.die(false);
  }

  protected respawnEnemy(enemy): void {
    enemy.delayedRespawn();
  }

  protected unsetRespawn(enemy): void {
    enemy.shouldRespawn = false;
  }
  protected setRespawn(enemy): void {
    enemy.shouldRespawn = true;
  }

  protected startRound(): void {
  }
  
  protected setAllOverlaps(enemy): void {
    // player bullets hit enemies
    this.scene.physics.add.overlap(this.scene.player.getBullets(), enemy, this.singleHitOnEntity, null, this);
    // player bullets erase enemies bullets
    this.scene.physics.add.overlap(this.scene.player.getBullets(), enemy.getBullets(), this.bulletHitBullet, null, this);
    // player zoning erase enemies bullets
    this.scene.physics.add.overlap(this.scene.player.getMelee(), enemy.getBullets(), this.bulletHitBullet, null, this);
    // player zoning hit enemies
    this.scene.physics.add.overlap(this.scene.player.getMelee(), enemy, this.multiHitOnEntity, null, this);
    // enemies bullet hurt player
    this.scene.physics.add.overlap(enemy.getBullets(), this.scene.player, this.singleHitOnEntity, null);
    // enemies zones hurt player
    this.scene.physics.add.overlap(enemy.getMelee(), this.scene.player, this.multiHitOnEntity, null);
  }
  protected setBackgroundCollision(entity) {
    if (entity) {
      this.scene.physics.add.collider(entity, this.scene.mapGenerator.getGroundLayer());
    }
  }
  protected levelUpEnemy(enemy): void {
    enemy.levelUp();
  }
  // Round related
  protected roundEnded(): void {
    this.round++;
    this.toEachEnemy(this.unsetRespawn);
    this.toEachEnemy(this.killSilentlyEnemy);
    this.onGoing = false;
    this.scene.gameEvent.emit(eventList.RoundEnded, { sound: 'PowerUp01' });
  }

  // Bullet logic
  protected bulletHitLayer(bullet): void {
    bullet.explode();
  }

  protected bulletHitBullet(bullet, obstacle): void {
    obstacle.explode();
  }

  protected singleHitOnEntity(bullet, entity): void {
    let bulletConnected = entity.hurt(bullet);
    if (bulletConnected !== -1) {
      bullet.explode();
    }
  }

  protected multiHitOnEntity(melee, entity): void {
    entity.hurt(melee);
  }

  // Getter
  public getTimeLeft(): number {
    return this.timeLeft;
  }

  public getEnemiesKilled(): number {
    return this.enemiesKilled;
  }

  public getEnemyGroup(): Array<any> {
    return this.enemies;
  }

  // Misc
  toEachEnemy(action): void {
    this.enemies.forEach(action, this);
  }
  // Todo : One function can do both
  getEnemyClassConfig(type): any {
    switch(type) {
      case 'Angler':
        return  AnglerConfig.default;
      case 'Dasher':
        return DasherConfig.default;
      case 'Shooter':
        return ShooterConfig.default;
      case 'Zoner':
        return ZonerConfig.default
      default:
        return false;
    }
  }
}
