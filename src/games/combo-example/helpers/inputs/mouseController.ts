export class MouseController {
    scene: Phaser.Scene;
    pointerEvent: Phaser.Events.EventEmitter;
    constructor(params) {
        this.scene = params.scene;
        this.initControls();
    }

    protected initControls(): void {
        this.pointerEvent = new Phaser.Events.EventEmitter();
        this.scene.input.on('pointerdown', this.emitPointerClick, this);
        this.scene.input.on('pointerup', this.emitPointerUp, this);
        this.scene.input.on('pointermove', this.emitPointerMoved, this);
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
