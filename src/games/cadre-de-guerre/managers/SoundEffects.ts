import { GameScene } from "../scenes/gameScene";

// Usage :
// this.scene.gameEvent.emit(signalName, Object with {sound: signalSOund});
export class SoundEffects {
    private defaultUrl: string;
    private soundList = [
        'Alarm',
        'Damage01',
        'Damage02',
        'Fire01',
        'Slash01',
        'Slash05',
        'PowerUp01',
        'PowerUp02',
        'UI04',
    ];
    // To Do, Name sounds after events
    private eventList = [
        'playerRespawned',
        'lifeUpdate',
        'entityDamaged',
        'entityDashing',
        'entityShooting',
        'entityDied',
        'countDown',
        'roundEnded'
    ];
    private sounds = []
    scene: GameScene;

    constructor(params) {
      this.defaultUrl = '/src/games/cadre-de-guerre/assets/sounds/';
      this.scene = params.scene;
    }

    preloadSound() {
      this.soundList.forEach(element => {
        this.scene.load.audio(element, [
            this.defaultUrl + element + '.mp3'
        ]);
      });
    }
    initSound() {
        this.soundList.forEach(element => {
            this.sounds[element] = this.scene.sound.add(element);
        });

        this.eventList.forEach(element => {
            this.scene.gameEvent.on(element, this.playSound, this);
        });
    }
    playSound(obj) {
        if (obj) {
            this.sounds[obj.sound].play();
        } else {
            console.log('no object sent');
        }
    }
  }
