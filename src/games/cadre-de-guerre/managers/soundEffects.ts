import { GameScene } from "../scenes/gameScene";
import { Config } from "../config";

// Usage :
// this.scene.gameEvent.emit(signalName, Object with {sound: signalSOund});
export class SoundEffects {
    private assetsFolder: string = Config.FOLDER + '/sounds/';
    private soundList = [
        'Alarm',
        'Damage01',
        'Damage02',
        'Explosion1',
        'Fire01',
        'Slash01',
        'Slash05',
        'PowerUp01',
        'PowerUp02',
        'PowerUp03',
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
        'roundEnded',
        'levelUp'
    ];
    private sounds = []
    scene: GameScene;

    constructor(params) {
      this.scene = params.scene;
    }

    preloadSound() {
      this.soundList.forEach(element => {
        this.scene.load.audio(element, this.assetsFolder + element + '.mp3', { instances: 1});
      });
    }
    initSound() {
        this.soundList.forEach(element => {
            this.sounds[element] = this.scene.sound.add(element);
            this.sounds[element].volume = 0.25;
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
