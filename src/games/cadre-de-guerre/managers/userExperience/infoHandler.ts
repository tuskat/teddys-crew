import { GameScene } from "../../scenes/gameScene";
import { Config } from "../../config";
import { eventList } from "../../configs/enums/eventList";
// import Axios from "axios";
import { emit } from "cluster";

export class InfoHandler {
  private db_instance;
  private eventList = [];
  private infoObject = [];
  protected infoLogged: number = 0;
  scene: GameScene;

  constructor(params) {
    this.scene = params.scene;
    this.eventList = this.enumToArray(eventList);
  }

  async initInfoLog() {
    // this.db_instance = Axios.create({
    //     baseURL: 'http://localhost:8000/',
    //     timeout: 1000
    //   });
    this.eventList.forEach(ev => {
      this.scene.gameEvent.on(ev, this.logInfo.bind(this, ev), this);
    });

    // const { data } = await this.db_instance.get('top10');
  }

  logInfo(eventName, obj) {
    if (obj) {
      this.infoObject[this.infoLogged] = obj;
      this.infoLogged++;
    }
    if (this.infoLogged % 100 === 0) {
      console.log(this.infoObject);
    }
    // if (obj && obj.name) {
    //     if (obj.name === 'GameOver') {
    //         console.log(this.infoObject);
    //         this.db_instance.post('gameStats', this.infoObject);
    //     }
    // }
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

  public getInfo() {
    return this.infoObject;
  }
}
