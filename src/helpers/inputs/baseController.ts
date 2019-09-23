export class BaseController {
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
        this.pointerEvent.emit('cursormoved', pointer);
    }

    protected emitPointerClick(pointer): void {
        if (pointer.leftButtonDown()) {
            this.pointerEvent.emit('dbuttonpressed', pointer);
        } else {
            this.pointerEvent.emit('bbuttonpressed', pointer);
        }
    }

    protected emitPointerUp(pointer): void {
        if (pointer.leftButtonDown()) {
            this.pointerEvent.emit('dbuttonup', pointer);
        }
    }

    public getEmitter() {
        return this.pointerEvent;
    }
}
