import { BaseLogic } from "./baseLogic";
import { eventList } from "../../configs/enums/eventList";

export class SurvivalMode extends BaseLogic {
    timeToNextBuff: number = 15000;
    playerLives: number = 1;
    timeSurvived: number = 0;
    buffEvent: Phaser.Time.TimerEvent;

    constructor(params) {
        super(params);
        this.buffEvent = this.scene.time.addEvent({ delay: this.timeToNextBuff, callback: this.IntensityUp, callbackScope: this, loop: true });
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
        this.scene.gameEvent.emit(eventList.GameOver, { sound: 'Misc03' });
    }

    // Getter
    public getTimeLeft(): number {
        return this.timeSurvived;
    }

    protected IntensityUp(): void {
        // let intensityType = Math.random() < 0.5 ? 'Power' : 'Number';
        // if (intensityType === 'Number') {
        this.maxEnemies++;
        let enemyType = this.pickEnemy();
        this.enemies.push(this.spawnEnemy(enemyType));
        // if (intensityType === 'Number') {
        this.enemiesLevel++;
        this.toEachEnemy(this.levelUpEnemy);
        // }
        if (this.enemiesLevel % 5 === 0) {
            this.redistributeEnemies();
        }
    }

    protected playerDied(entity): void {
        if (entity.faction === 'allies') {
            this.playerLives--;
        }
    }
}
