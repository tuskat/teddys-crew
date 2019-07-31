import { BaseController } from './baseController';

export class Controller extends BaseController {
    scene: Phaser.Scene;
    pointerEvent: Phaser.Events.EventEmitter;
    constructor(params) {
        super();
        this.scene = params.scene;
        this.initControls();
    }

    private initControls(): void {
        this.pointerEvent = new Phaser.Events.EventEmitter();
        this.scene.input.on('pointerdown', this.emitPointerClick, this);
        this.scene.input.on('pointermove', this.emitPointerMoved, this);
    }
    private emitPointerMoved(pointer): void {
        this.pointerEvent.emit('cursormoved', pointer);
    }

    private emitPointerClick(pointer): void {
        if (pointer.leftButtonDown()) {
            this.pointerEvent.emit('dbuttonpressed', pointer);
        } else {
            this.pointerEvent.emit('bbuttonpressed', pointer);
        }
    }

    public getEmitter() {
        return this.pointerEvent;
    }
}
