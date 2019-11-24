import { CurrentState } from "../configs/enums/currentStates";

/**
 * @name Shoot
 **/
export function Shoot() {
	return function (target) {
		let skill = {
			name : 'shoot',
			cooldownDuration: 0,
			cooldown : 0,
			hasCooldown: false,
		}
		target.prototype[skill.name+'_info'] = skill;
		target.prototype.shoot = function () {
			if (this.scene.time.now > this.lastShoot) {
				if (this.projectiles.getLength() < 2) {
					let bullet = this.createBullet(this.getAngle());
					this.lastShoot = this.scene.time.now + this.actionDuration;
					this.resolveState(CurrentState.Shooting);
					this.scene.gameEvent.emit(this.events['shoot'].name, { sound: this.events['shoot'].sound, entity: bullet });
					this.scene.time.delayedCall(this.actionDuration, this.endActionCallback, [], this);
					return true;
				}
			}
			return false;
		};
	}
}

/**
 * @name Shield
 **/
export function Shield() {
	return function (target) {
		let skill = {
			name: 'shield',
			cooldownDuration: 7 * 1000,
			cooldown: 0,
			hasCooldown: true,
		}
		target.prototype[skill.name+'_info'] = skill;
		target.prototype.shield = function () {
			if ((this.aura.getLength() < 1) && (this[skill.name+'_info'].cooldown <= 0)) {
				this.resolveState(CurrentState.Shooting);
				this.createCloseSkill(this.animationPreset.shield);
				this[skill.name+'_info'].cooldown = this[skill.name+'_info'].cooldownDuration;
				this.scene.gameEvent.emit(this.events['shield'].name, { sound: this.events['shield'].sound });
				this.scene.time.delayedCall((this.actionDuration * 3), this.endActionCallback, [], this);
				return true;
			}
			return false;
		};
	}
}

/**
 * @name Explode
 **/
export function Explode() {
	return function (target) {
		let skill = {
			name: 'explode',
			cooldownDuration: 0,
			cooldown: 0,
			hasCooldown: false,
		}
		target.prototype[skill.name+'_info'] = skill;
		target.prototype.explode = function () {
			if ((this.aura.getLength() < 1) && (this[skill.name+'_info'].cooldown <= 0)) {
				this.resolveState(CurrentState.Shooting);
				this.createGrowingSkill(this.animationPreset.shield);
				this[skill.name+'_info'].cooldown = this[skill.name+'_info'].cooldownDuration;
				this.scene.gameEvent.emit(this.events['shield'].name, { sound: this.events['shield'].sound });
				this.scene.time.delayedCall(this.actionDuration / 2, this.die, [true, false], this);
				return true;
			}
			return false;
		};
	}
}


/**
 * @name Dash
 **/
export function Dash() {
	return function (target) {
		let skill = {
			name : 'dash',
			cooldownDuration: 0,
			cooldown : 0,
			hasCooldown: false,
		}
		target.prototype[skill.name+'_info'] = skill;
		target.prototype.dash = function (alpha = 0.75) {
			this.resolveState(CurrentState.Dashing);
			this.createGraphicEffect('dash');
			this.createDashSkill(this.animationPreset.dash, this.getAngle(), alpha);
			this.scene.gameEvent.emit(this.events['dash'].name, { sound: this.events['dash'].sound });
			this.scene.physics.moveToObject(this, this.target, this.speed * 4);
			this.scene.time.delayedCall(this.actionDuration, this.endActionCallback, [], this);
			return true;
		};
	}
}

/**
 * @name Ram
 **/
export function Ram() {
	return function (target) {
		let skill = {
			name : 'ram',
			cooldownDuration: 0,
			cooldown : 0,
			hasCooldown: false,
		}
		target.prototype[skill.name+'_info'] = skill;
		target.prototype.ram = function () {
			this.resolveState(CurrentState.Dashing);
			this.createGraphicEffect('dash');
			this.createDashSkill(this.animationPreset.dash, this.getAngle(), 0);
			this.scene.gameEvent.emit(this.events['dash'].name, { sound: this.events['dash'].sound });
			this.scene.physics.moveToObject(this, this.target, this.speed * 3);
			this.scene.time.delayedCall(this.actionDuration, this.endActionCallback, [], this);
			return true;
		};
	}
}