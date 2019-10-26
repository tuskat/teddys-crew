import { GameScene } from "../../scenes/gameScene";
import { Config } from "../../config";
import { eventList } from "../../configs/enums/eventList";

// Usage :
// this.scene.gameEvent.emit(signalName, Object with {sound: signalSOund});
export class SoundEffects {
  private shouldPlaySound: boolean = true;
  private assetsFolder: string = '/sounds/';
  private musicFolder: string = '/musics/';
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
  private currentMusic = null;
  // To Do, Name sounds after events
  private eventList = [];
  private sounds = [];
  private musics = [];
  scene: GameScene;

  constructor(params) {
    this.scene = params.scene;
    this.eventList = this.enumToArray(eventList);
    window.addEventListener('soundChanged', this.onSoundEvent.bind(this));
  }

  preloadSound() {
    let assetPrefix = TARGET === 'electron' ? 'assets' : '/src/games/cadre-de-guerre/assets';
    this.assetsFolder = assetPrefix + this.assetsFolder;
    this.musicFolder = assetPrefix + this.musicFolder;

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
      this.musics[element] = this.scene.sound.add(element);
      this.musics[element].volume = 0.25;
      this.musics[element].loop = true;
    });
  
    this.eventList.forEach(element => {
      this.scene.gameEvent.on(element, this.playSound, this);
    });
  }

  cleanse() {
    this.eventList.forEach(element => {
      this.scene.gameEvent.off(element, this.playSound, this);
    });

    this.soundList.forEach(element => {
      this.scene.sound.remove(this.sounds[element]);
    });

    this.musicList.forEach(element => {
      this.scene.sound.remove(this.musics[element]);
    });
  }

  playSound(obj) {
    if (obj && this.shouldPlaySound) {
      this.sounds[obj.sound].play();
    }
  }

  public playMusic(title) {
    this.musics[title].play();
    this.currentMusic = this.musics[title];
  }

  onSoundEvent(data) {
    this.setSound(data.detail.newValue);
  }

  setSound(sound){
    if (sound === true) {
      this.currentMusic.resume();
    } else {
      this.currentMusic.pause();
    }
    this.shouldPlaySound = sound;
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
