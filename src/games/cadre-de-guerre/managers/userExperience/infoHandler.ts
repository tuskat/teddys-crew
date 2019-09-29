import { GameScene } from "../../scenes/gameScene";
import { Config } from "../../config";
import { eventList } from "../../configs/enums/eventList";

export class InfoHandler {
    private eventList = [];
    private infoObject = [];
    protected infoLogged: number = 0;
    scene: GameScene;

    constructor(params) {
      this.scene = params.scene;
      this.eventList = this.enumToArray(eventList);
    }

    initInfoLog() {
        this.eventList.forEach(element => {
            this.scene.gameEvent.on(element, this.logInfo, this);
        });
    }

    cleanse() {
        this.eventList.forEach(element => {
            this.scene.gameEvent.off(element, this.logInfo, this);
        });
    }

    logInfo(obj) {
        this.infoLogged++;
        if (obj) {
            this.infoObject[this.infoLogged] = obj;
        }
        if (this.infoLogged % 100 === 0) {
            console.log(this.infoObject);
        }
    }

    enumToArray(enumList) {
        let stringList: string[] = [];

        for(let n in enumList) {
            if (typeof enumList[n] === 'string') {
                stringList.push(enumList[n]);
            }
        }
        return stringList;
    }
  }
