import { GameScene } from "../../scenes/gameScene";
import { eventList } from "../../configs/enums/eventList";
import { BaseLogic } from "./baseLogic";

export class RoundMode extends BaseLogic {
    scene: GameScene;
    maxEnemies = 5;
    enemiesLevel = 1;
    startTime = 15;

    constructor(params) {
        super(params);
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

}
