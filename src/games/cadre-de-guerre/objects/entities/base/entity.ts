import _ = require('lodash/core');
import { CurrentState } from '../../../configs/enums/currentStates';
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
  gameEvent:  Phaser.Events.EventEmitter = null;
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
  shadowPatch: Phaser.GameObjects.Graphics = null;

  constructor(params) {
    super(params.scene, params.x, params.y, 'game-atlas', params.key + '.png');
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.initVariables(params.config);
    this.initImage();

    this.spriteFolder = params.folder;
    this.scene.add.existing(this);
    this.rangedSkill = this.scene.add.group({
      classType: Bullet,
      maxSize: 2,
      runChildUpdate: true
    });
    this.shadowPatch = this.scene.add.graphics();
    this.redrawShadow();
    this.setDepth(1);
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
 
  updatShadowPosition(): void {
    this.shadowPatch.x = this.x;
    this.shadowPatch.y = this.y;
    this.shadowPatch.alpha = (this.state === CurrentState.Dead) ? 0 : 0.35;
  }

  redrawShadow(): void {
    if (this.shadowPatch.alpha === 0 && this.life > 0) {
      this.shadowPatch.alpha = 1;
    }
    this.shadowPatch.clear();
    this.shadowPatch.fillStyle(0x000000, 0.35);
    this.shadowPatch.fillEllipse(0,25,this.width / 2,20);
    this.shadowPatch.setDepth(0);
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
  protected doNothing(): void {}

  public getBullets(): Phaser.GameObjects.Group {
    return this.rangedSkill;
  }

  public getExperience(): number {
    return (5 * (this.level * this.config.life));
  }


  // Respawn
  protected respawn(): void {
    if (this.shouldRespawn === false) {
      return;
    }
    this.x = Phaser.Math.RND.integerInRange(100, 700);
    this.y = Phaser.Math.RND.integerInRange(100, 500);
    this.isInvicible = true;
    this.life = this.maxLife;
    this.createGraphicEffect(this.animationPreset.spawn);
    this.scene.add.tween({
      targets: [this],
      ease: 'Sine.easeInOut',
      alpha: {
        getStart: () => 0,
        getEnd: () => 1
      },
      duration: this.delayToAction,
      onComplete: this.doneRespawning.bind(this)
    });
  }

  protected doneRespawning(): void {
    if (!this.shouldRespawn) {
      this.alpha = 0;
      return;
    }
    this.isInvicible = false;
    this.state = CurrentState.Moving;
    this.redrawLifebar();
  }

  protected delayedRespawn(): void {
    this.scene.time.delayedCall(this.timeToRespawn, this.respawn, [], this);
  }

  protected die(sound = true): void {
    if (!this.isDead()) {
      if (sound) {
        this.scene.gameEvent.emit(eventList.Dying, { sound: 'Explosion7', experience: this.getExperience(), faction: this.faction });
        this.createGraphicEffect(this.animationPreset.explode);
        this.scene.gameEvent.emit(eventList.ScoreUpdate);
        this.setFrame(this.spriteFolder + '/Idle' + '.png');
      }
      this.alpha = 0;
      this.state = CurrentState.Dead;
      this.hideLifebar();
      this.scene.time.delayedCall(this.timeToRespawn, this.respawn, [], this);
    }
  }

  // status
  protected isVulnerable(): boolean {
    if (this.state === CurrentState.Dead ||
      this.state === CurrentState.Hurting) {
      return false;
    }
    return true;
  }

  protected isDead(): boolean {
    if (this.state === CurrentState.Dead) {
      return true;
    }
    return false;
  }

  public hurt(entity = { power: 1 }): number {
    if (this.isVulnerable()) {
      if (this.actionPending) {
        this.actionPending.remove(false);
      }
      this.life = this.life - entity.power;
      this.createGraphicEffect('hit');
      this.scene.gameEvent.emit(this.events['hurt'].name, { sound: this.events['hurt'].sound, faction: this.faction });
      if (this.life < 0) {
        this.life = 0;
      }
      this.redrawLifebar();
      if (this.life === 0) {
        this.die();
      } else if (this.life > 0) {
        this.state = CurrentState.Hurting;
        this.isInvicible = true;
        this.setTint(0xFF6347);
        this.scene.time.delayedCall(this.invicibleFrame, this.endHurtingCallback, [], this);
      }
      return this.life;
    }
    return -1;
  }

  protected endHurtingCallback(): void {
    this.clearTint();
    this.isInvicible = false;
    if (this.state !== CurrentState.Dead) {
      this.state = CurrentState.Moving;
    }
  }

  redrawLifebar(): void {}

  hideLifebar(): void {}
  // erase stuff
  flushLifebar(): void {}

  flushCustom(): void {}

  cleanse(): void {
    this.flushLifebar();
    this.flushCustom();
    this.setActive(false);
    this.setVisible(false);
    this.destroy();
  }
}
