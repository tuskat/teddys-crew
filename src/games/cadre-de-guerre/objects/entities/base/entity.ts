import { CurrentState } from '../../../configs/enums/currentStates';
import { GameScene } from '../../../scenes/gameScene';
import { GraphicEffects } from '../../../energy/graphicEffects';
import { eventList } from '../../../configs/enums/eventList';
import { MovingGraphicEffects } from '../../../energy/movingGraphicEffects';
import defaultAnimtationPresets from '../../../configs/enums/defaultAnimationPresets';


export class Entity extends Phaser.GameObjects.Sprite {
  animationPreset = defaultAnimtationPresets;
  scene: GameScene;
  gameEvent:  Phaser.Events.EventEmitter = null;
  life = 1;
  maxLife = this.life;
  level = 1;
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
  shadowPatch: Phaser.GameObjects.Sprite = null;

  constructor(params) {
    super(params.scene, params.x, params.y, 'game-atlas', params.key + '.png');

    this.initVariables(params.config);
    this.initImage();

    this.spriteFolder = params.folder;
    this.scene.add.existing(this);

    this.createShadow();
    this.setDepth(1);
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
  }

  cleanse(): void {
    this.shouldRespawn = false;
    this.shadowPatch.clearAlpha();
    this.shadowPatch.destroy();
    this.flushLifebar();
    this.flushCustom();
    this.setActive(false);
    this.setVisible(false);
    this.destroy();
  }
  // init methods
  protected initVariables(config): void {
    this.target = new Phaser.Math.Vector2(0, 0);

    for (let key in config){
      this[key] = config[key] || this[key];
   }
    this.config = config;

    this.graphicEffects = this.scene.add.group({
      active: true,
      maxSize: 5,
      runChildUpdate: true
    });
    this.maxLife = this.life;
  }

  protected initImage(): void {
    this.setOrigin(0.5, 0.5);
    this.scale = 1;
  }
 
  updatShadowPosition(): void {
    this.shadowPatch.x = this.x;
    this.shadowPatch.y = this.y;
    this.shadowPatch.alpha = (this.state === CurrentState.Dead) ? 0 : 0.35;
  }

  createShadow(): void {

    this.shadowPatch = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, 'shadow');
    this.shadowPatch.setOrigin(0.5, 0.5);
    // this.shadowPatch.setSize(30,30);
    this.scene.add.existing(this.shadowPatch);
    this.shadowPatch.setDepth(0);
  }

// Create children
  protected createGraphicEffect(animation = 'explode', followParent = false): void {
  if (this.graphicEffects.getLength() < 5) {
    let effect = null;
    if (followParent === true) {
      effect = new MovingGraphicEffects({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: 'Air_14_00000',
        gfxName: animation,
        flipX: this.flipX, 
        parent: this});
    } else {
      effect = new GraphicEffects({
        scene: this.scene,
        x: this.x,
        y: this.y,
        key: 'Air_14_00000',
        gfxName: animation,
        flipX: this.flipX }); 
    }
    this.graphicEffects.add(effect);
  }
}

  // actions
  protected doNothing(): void {}

  public getExperience(): number {
    return (5 * (this.level * this.config.baseXP));
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
      duration: 200,
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

  protected die(sound = true, playerKill = true): void {
    if (!this.isDead()) {
      if (sound) {
        this.scene.gameEvent.emit(eventList.Dying, { sound: 'Explosion7', experience: playerKill ? this.getExperience() : 0, faction: this.faction });
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
      if (this.life > 0) {
        this.state = CurrentState.Hurting;
        this.isInvicible = true;
        this.setTint(0xFF6347);
        this.scene.time.delayedCall(this.invicibleFrame, this.endHurtingCallback, [], this);
      } else {
        this.die();
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

}
