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
    this.scene.input.keyboard.on('keydown-' + 'ESC', this.emitPause, this);
  }

  protected emitPointerClick(pointer): void {
    if (pointer.leftButtonDown()) {
      this.pointerEvent.emit('dashButtonPressed', pointer);
    } else if (pointer.rightButtonDown()) {
      this.pointerEvent.emit('shieldButtonPressed', pointer);
    }
  }
}
