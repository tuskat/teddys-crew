export class BaseController {
  public name: string = 'DefaultController';
  scene: Phaser.Scene;
  pointerEvent: Phaser.Events.EventEmitter;
  constructor(params) {
    this.scene = params.scene;
    this.initControls();
  }

  protected initControls(): void {
    this.pointerEvent = new Phaser.Events.EventEmitter();
  }
  protected emitMoved(pointer): void {
    this.pointerEvent.emit('cursorMoved', pointer);
  }
  protected emitDash(pointer): void {
    this.pointerEvent.emit('dashButtonPressed', pointer);
  }
  protected emitShield(pointer): void {
    this.pointerEvent.emit('shieldButtonPressed', pointer);
  }
  protected emitShoot(pointer): void {
    this.pointerEvent.emit('shootButtonPressed', pointer);
  }

  protected emitPause(pointer): void {
    this.pointerEvent.emit('pauseButtonPressed', pointer);
  }
  public getEmitter() {
    return this.pointerEvent;
  }

  public getDashHandler() {
    return this.handleDash;
  }

  protected handleDash(entity, pointer) {
    entity.callSkill(pointer, 'dash');
  }

}
