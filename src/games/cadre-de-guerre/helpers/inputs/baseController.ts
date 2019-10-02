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
    protected emitPointerMoved(pointer): void {
        this.pointerEvent.emit('cursorMoved', pointer);
    }

    protected emitPointerClick(pointer): void {
        if (pointer.leftButtonDown()) {
            this.pointerEvent.emit('dashButtonPressed', pointer);
        } else {
            this.pointerEvent.emit('shootButtonPressed', pointer);
        }
    }

    protected emitPointerUp(pointer): void {
        if (pointer.leftButtonDown()) {
            this.pointerEvent.emit('dashButtonUp', pointer);
        }
    }

    public getEmitter() {
        return this.pointerEvent;
    }

    public getDashHandler() {
      return this.handleDash;
    }

    protected handleDash(entity, pointer) {
      entity.useSkill(pointer, 'dash');
    }

}
