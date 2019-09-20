// Cut down Controller class
export class MouseController {
    //  All this object does is receive the event when user click and send another event.
    // This is in case you were to create many controller, you could have several type of inputs
    // sending the same events to the player, making the input binding less of a pain
    scene: Phaser.Scene;
    pointerEvent: Phaser.Events.EventEmitter;

    constructor(params) {
        this.scene = params.scene;
        this.initControls();
    }

    protected initControls(): void {
        this.pointerEvent = new Phaser.Events.EventEmitter();
        this.scene.input.on('pointerdown', this.emitPointerClick, this);
    }

    protected emitPointerClick(pointer): void {
        if (pointer.leftButtonDown()) {
            // for the sake of simplicity we'll send different signal than we'd normally
            // In a game context it'd be more along these lines :
            /// emit('hitButton') -> Player happen to hit enemy -> emit('YouHitSomeone')
            this.pointerEvent.emit('YouHitSomeone', pointer);
        } else {
            this.pointerEvent.emit('SomeoneHitYou', pointer);
        }
    }

    public getEmitter() {
        return this.pointerEvent;
    }
}
