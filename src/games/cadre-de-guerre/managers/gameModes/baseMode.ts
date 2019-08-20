import { GameScene } from "../../scenes/gameScene";
import { Enemy } from "../../objects/entities/enemy";
import { CurrentState } from '../../configs/currentStates';
import * as DasherConfig from '../../configs/dasher';
import * as ShooterConfig from '../../configs/shooter';
export class BaseMode {
    scene: GameScene;
    maxEnemies = 5;
    startTime = 15;
    onGoing = false;
    round = 0;
    enemies = [];
    timeLeft = 0;
    timedEvent: Phaser.Time.TimerEvent;


    constructor(params) {
        this.scene = params.scene;
        this.timedEvent = this.scene.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true});
    }

    create(): void {
        this.scene.gameEvent.on('startRound', this.roundStarted, this);
    }

    update(time, delta): void {
        if (this.onGoing) {
            this.toEachEnemy(this.updateEnemy);
            this.toEachEnemy(this.checkCollision);
        }
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
        enemy.update();       
    }

    protected killEnemy(enemy): void {
        enemy.die();       
    }

    protected killSilentlyEnemy(enemy): void {
        enemy.die(false);       
    }

    protected unsetRespawn(enemy): void {
        enemy.shouldRespawn = false;
    }
    protected setRespawn(enemy): void {
        enemy.shouldRespawn = true;
    }

    protected spawnInitialEnemies(): void {
        for (let i = 0; i != this.maxEnemies; i++) {
            let enemyType = Math.random() < 0.5 ? 'Enemy' : 'Shooter';
            this.enemies.push(this.spawnEnemy(enemyType));
        }

        this.toEachEnemy((enemy: Enemy) => {
            this.scene.physics.add.overlap(
              this.scene.player.getBullets(),
              enemy,
              this.bulletHitEntity,
              null,
              this
            );
            this.scene.physics.add.overlap(
              enemy.getBullets(),
              this.scene.player,
              this.bulletHitEntity,
              null
            );
        });
    }

    protected roundEnded(): void {
        this.round++;
        this.toEachEnemy(this.unsetRespawn);
        this.toEachEnemy(this.killSilentlyEnemy);
        this.onGoing = false;
        this.scene.gameEvent.emit('roundEnded', {sound: 'PowerUp01'});
    }

    protected roundStarted(): void {
        if (this.round === 0) {
            this.spawnInitialEnemies();
        }
        this.timeLeft = this.startTime;
        this.toEachEnemy(this.setRespawn);
        this.toEachEnemy(this.killSilentlyEnemy);
        this.onGoing = true;
        this.scene.gameEvent.emit('roundStarted', null);
    }
    protected updateClock(): void {
        if (this.timeLeft === 0) {
            if (this.onGoing) {
                this.roundEnded();
            }
            return;
        }
        this.timeLeft--;
        this.scene.gameEvent.emit('timeUpdate', null);
    }

    protected objectsTouch(objectA, objectB): boolean {
        if (objectA.body && objectB.body) {
        let rect1 = new Phaser.Geom.Rectangle();
        let rect2 = new Phaser.Geom.Rectangle();
        rect1 = objectA.body.getBounds(rect1);
        rect2 = objectB.body.getBounds(rect2);
        return Phaser.Geom.Intersects.RectangleToRectangle(
            rect1,
            rect2
        )
        } else {
            return false;
        }
      }
    protected objectClashing(monster): void {
        if ((monster.state === CurrentState.Dashing) &&
          (!this.scene.player.isInvicible)) {
          this.scene.player.getHurt();
        }
        if  (this.scene.player.state === CurrentState.Dashing) {
          if (monster.state !== CurrentState.Dead) {
            var died = monster.getHurt();
            if (died) {
              this.scene.gameEvent.emit('scoreUpdate');
            }
          }
        }
      }

    getEnemyGroup(): Array<any> {
        return this.enemies;
    }

    protected spawnEnemy(folder): any {
        let config = (folder === 'Shooter') ? ShooterConfig : DasherConfig;
        let enemy = new Enemy({
            scene: this.scene,
            x: Phaser.Math.RND.integerInRange(100, 700),
            y: Phaser.Math.RND.integerInRange(100, 500),
            key: folder + "/Idle",
            player: this.scene.player,
            config: config.default,
            folder: folder
            });
        return enemy;
    }
    public getTimeLeft(): number {
        return this.timeLeft;
    }
    
    protected bulletHitLayer(bullet): void {
        bullet.destroy();
    }

    protected bulletHitObstacles(bullet, obstacle): void {
        bullet.destroy();
    }

    protected bulletHitEntity(bullet, entity): void {
        if (entity.state !== CurrentState.Dead) {
            bullet.destroy();
            entity.getHurt();
        }
    }
}
