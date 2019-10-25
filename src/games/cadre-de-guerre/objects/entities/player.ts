import { CurrentState } from '../../configs/enums/currentStates';
import { GameScene } from '../../scenes/gameScene';
import { eventList } from '../../configs/enums/eventList';
import { LevellingEntity } from './base/levellingEntity';
import { BaseController } from '../../helpers/inputs/baseController';
import { GameObjects } from 'phaser';

export class Player extends LevellingEntity {
  scene: GameScene;
  dashSpeed = this.maxSpeedX;
  state = CurrentState.Moving;
  closeSkillsHandler = null;
  skillIcons: GameObjects.Image[] = [];

  constructor(params) {
    super(params);
    this.initBody();
    this.initInput(params.controller);
    this.initUI();
    this.cloneSkillInfos();
    this.scene.gameEvent.on(eventList.ComboPowerUp, this.powerUp, this);
    this.scene.gameEvent.on(eventList.ComboLoss, this.powerDown, this);
  }

  protected initBody(): void {
    this.body.maxVelocity.x = this.maxSpeedX;
    this.body.maxVelocity.y = this.maxSpeedY;
    this.body.setSize(this.config.size, this.config.size, true);
    this.body.setOffset(this.width / 4, this.height / 3);
  }

  protected initInput(controller: BaseController): void {
    this.inputEvent = controller.getEmitter();
    this.closeSkillsHandler = controller.getDashHandler();
    this.inputEvent.on('dashButtonPressed', this.meleeClick, this);
    this.inputEvent.on('shieldButtonPressed', this.shieldToClick, this);
    this.inputEvent.on('shootButtonPressed', this.shootToClick, this);
    this.inputEvent.on('cursorMoved', this.handlePointer, this);
  }

  protected initUI(): void {
    // first 3 skills are attac...for lazyness purpose
    for (let i = 0; i !== 3; i++) {
      let frame = `${this.name}/Skill_${(i + 1)}.png`;
      let icon = this.scene.add.sprite((this.scene.sys.canvas.width - 180) + (i * 55), this.scene.sys.canvas.height - 64, 'game-ui', frame);
      icon.scale = 0.75;
      this.skillIcons[this.skillNames[i]] = icon;
    }
  }

  protected updatePosition(): void {
    if (this.target) {
      let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
      if (this.body.speed > 0) {
        if (distance < this.distanceToStop) {
          this.body.setVelocity(0);
        }
      }
    }
  }

  updateCooldown(delta): void {
    this.skillNames.forEach((element) => {
      let cooldown = this[element + '_info'].cooldown;
      if (cooldown > 0) {
        this[element + '_info'].cooldown -= delta;
        if (this[element + '_info'].cooldown <= 0) {
          this.scene.gameEvent.emit(eventList.SkillRestored, { sound: 'Sword01', entity: this });
        }
      }
    })
  }
  // Override
  protected isVulnerable(): boolean {
    if (this.isInvicible) {
      return false;
    }
    if (this.state === CurrentState.Dead ||
      this.state === CurrentState.Hurting ||
      this.state === CurrentState.Dashing) {
      return false;
    }
    return true;
  }

  // move to controller
  protected closeToCursor(): boolean {
    if (this.target) {
      let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) * 2;
      if (distance < this.distanceToStop) {
        return true;
      }
    }
    return false;
  }
  // move to controller
  protected handlePointer(pointer): void {
    if (this.blockingState()) {
      return;
    }
    this.target.x = pointer.x;
    this.target.y = pointer.y;
    // Move at 200 px/s:
    if (!this.closeToCursor()) {
      this.scene.physics.moveToObject(this, this.target, this.speed);
    } else {
      this.body.setVelocity(0);
    }
  }

  protected callSkill(pointer, action): void {
    if (!this.blockingState()) {
      this.target.x = pointer.x;
      this.target.y = pointer.y;
      this.state = CurrentState.WindingUp;
      this.actionPending = this.scene.time.delayedCall(this.delayToAction, this.useSkill, [action], this);
    }
  }
  // quick and dirty. To tidy up once we have more than Torb
  // Otherwise we hardcode where the cooldown is and that ain't cool :/
  protected useSkill(action) {
    let success = this[action]();
    if (success === true) {
      let icon = this.skillIcons[action];
      if (this[action + '_info'].cooldownDuration > 0) {
        icon.alpha = 0.15;
        icon.setTint(0x808080);
        this.scene.add.tween({
          targets: [icon],
          ease: 'Linear.easeIn',
          alpha: 1,
          duration: this[action + '_info'].cooldownDuration,
          onComplete: function () {
            icon.clearTint();
          }.bind(this)
        });
      } else {
        this.scene.add.tween({
          targets: [icon],
          ease: 'Bounce.easeInOut',
          alpha: 0.5,
          duration: this.actionDuration / 2,
          yoyo: true,
        });
      }
    } else {
      this.state = CurrentState.Moving;
    }
  }
  // surprisingly ok
  protected meleeClick(pointer): void {
    this.closeSkillsHandler(this, pointer);
  }
  // refactor : update target somewhere, use dash without pointer
  protected dashToClick(pointer): void {
    this.callSkill(pointer, 'dash');
  }

  protected shieldToClick(pointer): void {
    this.callSkill(pointer, 'shield');
  }

  protected shootToClick(pointer): void {
    this.callSkill(pointer, 'shoot');
  }

  protected doneRespawning(): void {
    this.scene.gameEvent.emit(eventList.Respawn, { sound: 'PowerUp02' });
    this.state = CurrentState.Moving;
    this.isInvicible = false;
  }

  protected powerUp(): void {
    this.comboPower += 1;
  }
  protected powerDown(): void {
    this.comboPower = 1;
  }
}
