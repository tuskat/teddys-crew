import { GameScene } from "../../scenes/gameScene";
import { Config } from "../../config";
import { eventList } from "../../configs/enums/eventList";

// Usage :
// this.scene.gameEvent.emit(signalName, Object with {sound: signalSOund});
export class SoundEffects {
  private assetsFolder: string = Config.ASSETS + '/sounds/';
  private musicFolder: string = Config.ASSETS + '/musics/';
  private musicList = [
    'firmament_loopA',
    'firmament_loopB',
  ]
  private soundList = [
    'Alarm',
    'Damage01',
    'Damage02',
    'Explosion7',
    'Fire01',
    'Fire03',
    'Slash01',
    'Slash05',
    'PowerUp01',
    'PowerUp02',
    'PowerUp03',
    'Sword01',
    'UI04',
    'Misc03'
  ];
  // To Do, Name sounds after events
  private eventList = [];
  private sounds = [];
  private music = [];
  scene: GameScene;

  constructor(params) {
    this.scene = params.scene;
    this.eventList = this.enumToArray(eventList);
  }

  preloadSound() {
    this.soundList.forEach(element => {
      this.scene.load.audio(element, this.assetsFolder + element + '.mp3', { instances: 1 });
    });
    this.musicList.forEach(element => {
      this.scene.load.audio(element, this.musicFolder + element + '.ogg', { instances: 1 });
    });
  }

  initSound() {
    this.soundList.forEach(element => {
      this.sounds[element] = this.scene.sound.add(element);
      this.sounds[element].volume = 0.25;
    });

    this.musicList.forEach(element => {
      this.music[element] = this.scene.sound.add(element);
      this.music[element].volume = 0.25;
    });
  
    this.eventList.forEach(element => {
      this.scene.gameEvent.on(element, this.playSound, this);
    });
  }

  cleanse() {
    this.eventList.forEach(element => {
      this.scene.gameEvent.off(element, this.playSound, this);
    });
  }

  playSound(obj) {
    if (obj) {
      this.sounds[obj.sound].play();
    }
  }

  public playMusic(title) {
    this.music[title].play();
  }

  enumToArray(enumList) {
    let stringList: string[] = [];

    for (let n in enumList) {
      if (typeof enumList[n] === 'string') {
        stringList.push(enumList[n]);
      }
    }
    return stringList;
  }
}
