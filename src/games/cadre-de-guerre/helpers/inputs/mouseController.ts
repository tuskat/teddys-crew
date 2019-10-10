import { BaseController } from './baseController';

export class MouseController extends BaseController {

  constructor(params) {
    super(params);
    this.name = 'MouseController';
  }

  protected initControls(): void {
    this.pointerEvent = new Phaser.Events.EventEmitter();
    this.scene.input.on('pointerdown', this.emitPointerClick, this);
    this.scene.input.on('pointermove', this.emitMoved, this);
    this.scene.input.on('wheel', this.emitShield, this);
    this.scene.input.keyboard.on('keydown-' + 'ESC', this.emitPause, this);
  }

  protected emitPointerClick(pointer): void {
    if (pointer.leftButtonDown()) {
      this.pointerEvent.emit('dashButtonPressed', pointer);
    } else {
      this.pointerEvent.emit('shootButtonPressed', pointer);
    }
  }

  // Classes that inherit from controller send this function
  // to character to handle 2 choices 1 input situation
  // Mouse might be the only one in that situation we'll see
  public handleDash(entity, pointer): void {
    let distance = Phaser.Math.Distance.Between(entity.x, entity.y, entity.target.x, entity.target.y);
    if (distance > 10) {
      entity.callSkill(pointer, 'dash');
    } else {
      entity.callSkill(pointer, 'shield');
    }
  }
}
