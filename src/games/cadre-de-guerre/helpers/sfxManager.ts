import { GameScene } from "../scenes/gameScene";

export class SfxManager {
    private defaultUrl: string;
    private soundList = [
        'Alarm',
        'Damage01',
        'Damage02',
        'Fire01',
        'PowerUp02',
        'UI04'
    ];
    // To Do, Name sounds after events
    private eventList = [
        'playerRespawned',
        'lifeUpdate',
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
        console.log(this);
        if (obj) {
            this.sounds[obj.sound].play();
        } else {
            console.log('no object sent');
        }
    }
  }
  