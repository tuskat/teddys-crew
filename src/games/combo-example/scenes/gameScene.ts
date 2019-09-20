import { MouseController } from '../helpers/inputs/mouseController';
import { ComboManager } from '../managers/userExperience/comboManager';

export class GameScene extends Phaser.Scene {
  public comboWidget: ComboManager;
  public gameEvent: Phaser.Events.EventEmitter = null;

  constructor() {
    super({
      key: "GameScene"
    });

    if (this.gameEvent === null) {
      this.gameEvent = new Phaser.Events.EventEmitter();
    }
  }

  create(): void {
    var player1input = new MouseController(this.scene);
    this.comboWidget = new ComboManager({scene : this, controller : player1input});
  }

  update(time, delta): void {
    this.comboWidget.update(time, delta);
  }
}
