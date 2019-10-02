import { BaseController } from './baseController';

export class MouseController extends BaseController {
    constructor(params) {
        super(params);
        this.name = 'MouseController';
    }

    protected initControls(): void {
        this.pointerEvent = new Phaser.Events.EventEmitter();
        this.scene.input.on('pointerdown', this.emitPointerClick, this);
        this.scene.input.on('pointerup', this.emitPointerUp, this);
        this.scene.input.on('pointermove', this.emitPointerMoved, this);
    }
    // Classes that inherit from controller send this function
    // to character to handle 2 choices 1 input situation
    // Mouse might be the only one in that situation we'll see
    public handleDash(entity, pointer): void {
        let distance = Phaser.Math.Distance.Between(entity.x, entity.y, entity.target.x, entity.target.y);
        if (distance > 15) {
            entity.useSkill(pointer, 'dash');
        } else {
            entity.useSkill(pointer, 'shield');
        }
    }
}
