import { GameScene } from "../scenes/gameScene";
import { MeleeEnemy } from "../objects/entities/enemy";
import { CurrentState } from '../helpers/currentStates';
import * as DasherConfig from '../configs/dasher';

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

    protected unsetRespawn(enemy): void {
        enemy.shouldRespawn = false;
    }
    protected setRespawn(enemy): void {
        enemy.shouldRespawn = true;
    }

    protected spawnInitialEnemies(): void {
        for (let i = 0; i != this.maxEnemies; i++) {
            this.enemies.push(this.spawnEnemy());
        }
    }

    protected roundEnded(): void {
        this.round++;
        this.toEachEnemy(this.unsetRespawn);
        this.toEachEnemy(this.killEnemy);
        this.onGoing = false;
        this.scene.gameEvent.emit('roundEnded', null);
    }

    protected roundStarted(): void {
        if (this.round === 0) {
            for (let i = 0; i != this.maxEnemies; i++) {
                this.enemies.push(this.spawnEnemy());
            }
        }
        this.timeLeft = this.startTime;
        this.toEachEnemy(this.setRespawn);
        this.toEachEnemy(this.killEnemy);
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
        return Phaser.Geom.Intersects.RectangleToRectangle(
          objectA.getBounds(),
          objectB.getBounds()
        )
      }
    protected objectClashing(monster): void {
        if ((monster.state === CurrentState.Dashing) &&
          (!this.scene.player.isInvicible)) {
          this.scene.player.getHurt();
          this.scene.gameEvent.emit('lifeUpdate');
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