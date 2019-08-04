import { GameScene } from "../scenes/gameScene";
import { MeleeEnemy } from "../objects/entities/enemy";
import { CurrentState } from '../helpers/currentStates';
import * as DasherConfig from '../configs/dasher';

export class BaseMode {
    scene: GameScene;
    maxEnemies = 10;
    startTime = 10;
    enemies = [];
    timeLeft = this.startTime;
    timedEvent: Phaser.Time.TimerEvent;


    constructor(params) {
        this.scene = params.scene;
        this.timedEvent = this.scene.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true});
    }

    create(): void {
        for (let i = 0; i != this.maxEnemies; i++) {
            this.enemies.push(this.spawnEnemy());
        }
    }

    update(time, delta): void {
        this.toEachEnemy(this.updateEnemy);
        this.toEachEnemy(this.checkCollision);
    }

    toEachEnemy(action): void {
        this.enemies.forEach(action, this);
    }

    checkCollision(enemy): void {
        if (this.objectsTouch(this.scene.player, enemy)) {
            this.objectClashing(enemy);
        }
    }
    
    protected updateEnemy(enemy): void {
        if (this.timeLeft > 0) {
            enemy.update();
        }        
    }

    protected unsetRespawn(enemy): void {
        enemy.shouldRespawn = false;
    }

    protected updateClock(): void {
        if (this.timeLeft === 0) {
            this.toEachEnemy(this.unsetRespawn);
            return;
        }
        this.timeLeft--;
        this.scene.gameUI.updateTime();
    }

    protected objectsTouch(objectA, objectB): boolean {
        return Phaser.Geom.Intersects.RectangleToRectangle(
          objectA.getBounds(),
          objectB.getBounds()
        )
      }
      protected objectClashing(monster): void {
        if ((monster.state === CurrentState.Dashing) &&
          (this.scene.player.state === CurrentState.Moving)) {
          this.scene.player.getHurt();
          this.scene.gameUI.updateLifeBar();
        }
        if  (this.scene.player.state === CurrentState.Dashing) {
          if (monster.state !== CurrentState.Dead) {
            var died = monster.getHurt();
            if (died) {
              this.scene.gameUI.updateScore();
            }
          }
        }
      }

    getEnemyGroup(): Array<any> {
        return this.enemies;
    }

    protected spawnEnemy(): any {
        let enemy = new MeleeEnemy({
            scene: this.scene,
            x: Phaser.Math.RND.integerInRange(100, 700),
            y: Phaser.Math.RND.integerInRange(100, 500),
            key: "monster",
            player: this.scene.player,
            config: DasherConfig.default
            });
        return enemy;
    }
    public getTimeLeft(): number {
        return this.timeLeft;
    }
}