import * as DasherConfig from '../../configs/dasher';
import * as ShooterConfig from '../../configs/shooter';
import * as ZonerConfig from '../../configs/zoner';

import { GameScene } from "../../scenes/gameScene";
import { Enemy } from "../../objects/entities/enemy";
import { eventList } from "../../configs/enums/eventList";
import { ObjectUtils } from "../../utils/objectUtils";
const { matches } = require('z');

export class BaseLogic {
    scene: GameScene;
    maxEnemies = 5;
    enemiesLevel = 1;
    startTime = 15;
    onGoing = false;
    round = 0;
    enemies = [];
    timeLeft = 0;
    timedEvent: Phaser.Time.TimerEvent;

    constructor(params) {
        this.scene = params.scene;
        this.setBackgroundCollision(this.scene.player);
        
        this.timedEvent = this.scene.time.addEvent({ delay: 1000, callback: this.updateClock, callbackScope: this, loop: true});
        this.scene.gameEvent.on(eventList.StartRound, this.startRound, this);
        this.scene.gameEvent.on(eventList.Dying, this.playerDied, this);
    }

    public cleanse(): void {
        this.toEachEnemy(this.flushEnemy);
        this.enemies = null;
        this.scene.gameEvent.off(eventList.StartRound, this.startRound, this);
        this.scene.gameEvent.off(eventList.Dying, this.playerDied, this);
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
    protected playerDied(entity): void {
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

    protected setAllOverlaps(enemy): void {
        // player bullets hit enemies
        this.scene.physics.add.overlap(this.scene.player.getBullets(),enemy,this.singleHitOnEntity,null,this);
        // player bullets erase enemies bullets
        this.scene.physics.add.overlap(this.scene.player.getBullets(),enemy.getBullets(),this.bulletHitBullet,null,this);
        // player zoning erase enemies bullets
        this.scene.physics.add.overlap(this.scene.player.getMelee(),enemy.getBullets(),this.bulletHitBullet,null,this);
        // player zoning hit enemies
        this.scene.physics.add.overlap(this.scene.player.getMelee(),enemy,this.multiHitOnEntity,null,this);
        // enemies bullet hurt player
        this.scene.physics.add.overlap(enemy.getBullets(),this.scene.player,this.singleHitOnEntity,null);
        // enemies zones hurt player
        this.scene.physics.add.overlap(enemy.getMelee(),this.scene.player,this.multiHitOnEntity,null);
    }
    protected setBackgroundCollision(entity) {
        this.scene.physics.add.collider(entity, this.scene.mapGenerator.getGroundLayer());
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
        this.scene.gameEvent.emit(eventList.RoundEnded, {sound: 'PowerUp01'});
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

    public getEnemyGroup(): Array<any> {
        return this.enemies;
    }

    // Misc
    toEachEnemy(action): void {
        this.enemies.forEach(action, this);
    }
    // Todo : One function can do both
    pickEnemy(): void {
        let type = (parseInt(ObjectUtils.weightedRandomization({0:0.5, 1:0.4, 2:0.1})) + 1);
        return matches(type)(
            (x = 1) => 'Dasher',
            (x = 2) => 'Shooter',
            (x = 3) => 'Zoner'
        );
    }

    getEnemyClassConfig(type): any {
        return matches(type)(
            (x = 'Dasher') => DasherConfig.default,
            (x = 'Shooter') => ShooterConfig.default,
            (x = 'Zoner') => ZonerConfig.default
        );
    }
}
