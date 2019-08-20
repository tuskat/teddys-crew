import { BaseController } from './baseController';

export class Controller extends BaseController {
    constructor(params) {
        super(params);
    }

    protected initControls(): void {
        this.pointerEvent = new Phaser.Events.EventEmitter();
        this.scene.input.on('pointerdown', this.emitPointerClick, this);
        this.scene.input.on('pointermove', this.emitPointerMoved, this);
    }
}
