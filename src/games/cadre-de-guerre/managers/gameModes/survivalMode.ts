import { BaseMode } from "./baseMode";
import { eventList } from "../../configs/enums/eventList";

export class SurvivalMode extends BaseMode {
    playerLives: number = 1;
    timeSurvived: number = 0;
    buffEvent: Phaser.Time.TimerEvent;

    constructor(params) {
        super(params);
        this.buffEvent = this.scene.time.addEvent({ delay: 30000, callback: this.IntensityUp, callbackScope: this, loop: true});
    }

    protected roundStarted(): void {
        this.toEachEnemy(this.setRespawn);
        this.onGoing = true;
        this.spawnInitialEnemies();
        this.toEachEnemy(this.killSilentlyEnemy);
        this.scene.gameEvent.emit('roundStarted', null);
    }

    protected updateClock(): void {
        this.timeSurvived++;
        this.scene.gameEvent.emit(eventList.TimeUpdate, null);
        if (this.playerLives <= 0) {
            this.scene.player.shouldRespawn = false;
            if (this.onGoing) {
                this.timedEvent.destroy();
                this.buffEvent.destroy();
                this.roundEnded();
            }
            return;
        }
    }

    protected roundEnded(): void {
        this.onGoing = false;
        this.scene.gameEvent.emit(eventList.GameOver, {sound: 'Misc03'});
    }

    // Getter
    public getTimeLeft(): number {
        return this.timeSurvived;
    }

    protected IntensityUp(): void {
        this.maxEnemies++;
        let enemyType = Math.random() < 0.66 ? 'Enemy' : 'Shooter';
        this.enemies.push(this.spawnEnemy(enemyType));
        this.toEachEnemy(this.levelUpEnemy);
    }

    protected playerDied(entity): void {
        if (entity.faction === 'allies') {
            this.playerLives--;
        }
    }

}
