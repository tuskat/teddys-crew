import { CurrentState } from '../../../configs/enums/currentStates'
import _ = require('lodash');
import { GameScene } from '../../../scenes/gameScene';
import { Bullet } from '../../bullets';
import { GraphicEffects } from '../../graphicEffects';
import { eventList } from '../../../configs/enums/eventList';


export class Entity extends Phaser.GameObjects.Sprite {
  animationPreset = {
    spawn: 'waterSpawn',
    explode: 'explode',
    bullet: 'fire'
  }
  scene: GameScene;
  gameEvent:  Phaser.Events.EventEmitter;
  life = 1;
  maxLife = this.life;
  level = 1;
  experience = 0;
  experienceToLevelUp = 20;
  power = 1;
  state = CurrentState.Moving;
  speed = 100;
  bulletSpeed = 0;
  skills = [];
  signatureSkill = 'doNothing';
  distanceToStop = 100;
  maxSpeedX;
  maxSpeedY;
  delayToAction;
  isInvicible;
  invicibleFrame = 300;
  target: Phaser.Math.Vector2;
  rangedSkill: any;
  shouldRespawn = true;
  timeToRespawn = 1000;
  actionDuration = 500;
  actionPending = null;
  faction = '';
  events = {};
  config: any;
  spriteFolder = null;
  previousState = null;
  lastShoot: number = 0;
  graphicEffects: Phaser.GameObjects.Group;

  constructor(params) {
    super(params.scene, params.x, params.y, 'game-atlas', params.key + '.png');
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.initVariables(params.config);
    this.initImage();
    this.initLevel();
    if (params.level > 1) {
      this.powerLevel(params.level);
    }
    this.spriteFolder = params.folder;
    this.scene.add.existing(this);
    this.rangedSkill = this.scene.add.group({
      classType: Bullet,
      maxSize: 2,
      runChildUpdate: true
    });
  }
  // init methods
  protected initVariables(config): void {
    this.target = new Phaser.Math.Vector2(0, 0);
    _.each(config, (val, key) => this[key] = val);
    this.config = config;

    this.graphicEffects = this.scene.add.group({
      active: true,
      maxSize: 5,
      runChildUpdate: true
    });
    this.maxLife = this.life;
  }

  protected initImage(): void {
    this.scale = 0.5;
    this.setOrigin(0.5, 0.5);
  }

  protected initLevel(): void {
    this.gameEvent = this.scene.getGameEvent();
    this.gameEvent.on(eventList.Dying, this.experienceGained, this);
  }


// Create children
  protected createGraphicEffect(animation = 'explode'): void {
    if (this.graphicEffects.getLength() < 5) {
      this.graphicEffects.add(
        new GraphicEffects({
          scene: this.scene,
          x: this.x,
          y: this.y,
          key: 'Air_14_00000',
          gfxName: animation,
          flipX: this.flipX })
      );
    }
  }

  protected createBullet(rotation): void {
    this.rangedSkill.add(
      new Bullet({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: "Fire_13_00000",
        rotation: rotation,
        gfxName: this.animationPreset.bullet,
        speed: this.bulletSpeed
      })
    );
  }
  // actions

  protected doNothing(): void {

  }
  protected powerLevel(level): void {
    for (let i = 1; i !== level; i++) {
      this.level++;
      this.distributeStats();
    }
  }

  protected distributeStats(): string {
    let buff = '';
    switch (this.level % 3) {
      case 0: {
        this.power++;
        buff = 'Power Up';
        break;
      }
      case 1: {
        this.speed = this.speed + (this.speed * 0.075);
        buff = 'Speed Up';
        break;
      }
      case 2: {
        this.life += 2;
        this.maxLife += 2;
        buff = 'Hp Up';
        // enum to set "Allies =1, Foes, Neutrals"
        if (this.faction === 'allies') {
          this.scene.gameEvent.emit(eventList.LifeUpdate, null);
        }
        break;
      }
    }
    return buff;
  }

  protected levelUp(): void {
    this.level++;
    this.experience = this.experience - this.experienceToLevelUp;
    this.experienceToLevelUp = (this.experienceToLevelUp + (this.experienceToLevelUp * 1.05));
    // to be decided separately later
    let buff = this.distributeStats();
    this.scene.gameEvent.emit(eventList.LevelUp,  { sound: 'PowerUp03', entity: this, buff: buff });
  }

  // make generic
  protected experienceGained(event): void {
      if (event.faction !== this.faction) {
        this.experience += event.experience;
        if (this.experience >= this.experienceToLevelUp) {
          this.levelUp();
      }
    }
  }


  public getBullets(): Phaser.GameObjects.Group {
    return this.rangedSkill;
  }

  public getExperience(): number {
    return (5 * (this.level * this.config.life));
  }

  // Anim complete
  // protected animCompleteCallback(anim) {
  //   if (anim.key === 'explode') {
  //     this.alpha = 0;
  //     this.scene.gameEvent.emit('scoreUpdate');
  //     this.setFrame(this.spriteFolder + '/Idle' + '.png');
  //   }
  // }

  redrawLifebar(): void {}
  hideLifebar(): void {}

  flush(): void {
    this.setActive(false);
    this.setVisible(false);
    this.destroy();
  }
}
