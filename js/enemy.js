import * as GObject from './game.object.js';
import * as Constants from './constants.js';
import * as Visual from './visual.js';
import * as AI from './ai.js';
import { Spittle } from './bullet.js';

export class Enemy extends GObject.Unit {
	constructor(aiInfo) {
		super();
		this._aiInfo = aiInfo
		this._ai = null;
		this._damage = 0
		this._blasts = [];
		this.knockBack = 0;
	}
	
	interactWithTarget(target) {
		if (!this.isIntersectWith(target) || target.hp == 0)
			return;
		
		target.push(this.lookDirection(), this.knockBack);
		target.damage(this._damage);
	}
	
	rangeAttack() {
	}
	
	blasts() {
		let blasts = this._blasts.slice();
		this._blasts.length = 0;
		return blasts;
	}
	
	damage(dp) {
		super.damage(dp);
		if (!this.isNeedToRemove() && this.hp == 0)
			this.remove();
	}
	
	update(fpsFactor) {
		super.update(fpsFactor);
		this._ai.update(fpsFactor);
	}
}

export class DefaultEnemy extends Enemy {
	constructor(aiInfo) {
		super(aiInfo);
		this._ai = new AI.DefaultEnemyAI(aiInfo);
		this._ai.setAgent(this);
		this.hp = Constants.HpValues.defaultEnemyHP;
		this._damage = Constants.DamageValues.defaultEnemyDamage;
		this.speed = Constants.PhisicalValues.defaultEnemyBaseSpeed + Constants.PhisicalValues.defaultEnemySpeedFactor * Math.random();
		this._origSpeed = this.speed;
		this._radius = Constants.PhisicalValues.defaultEnemyRadius;
		this.knockBack = Constants.KnockBackValues.defaultEnemyKnockBack;
		
		this.mesh = Visual.Meshes.defaultEnemyMesh();
	}
}

export class FatEnemy extends Enemy {
	constructor(aiInfo) {
		super(aiInfo);
		this._ai = new AI.DefaultEnemyAI(aiInfo);
		this._ai.setAgent(this);
		this.hp = Constants.HpValues.fatEnemyHP;
		this._damage = Constants.DamageValues.fatEnemyDamage;
		this.speed = Constants.PhisicalValues.fatEnemyBaseSpeed;
		this._origSpeed = this.speed;
		this._radius = Constants.PhisicalValues.fatEnemyRadius;
		this.knockBack = Constants.KnockBackValues.fatEnemyKnockBack;
		
		this.mesh = Visual.Meshes.fatEnemyMesh();
	}
}

export class Spitter extends Enemy {
	constructor(aiInfo) {
		super(aiInfo);
		this._ai = new AI.SpitterAI(aiInfo);
		this._ai.setAgent(this);
		this.hp = Constants.HpValues.spitterHP;
		this._damage = Constants.DamageValues.spitterDamage;
		this.speed = Constants.PhisicalValues.spitterSpeed;
		this._origSpeed = this.speed;
		this._radius = Constants.PhisicalValues.spitterRadius;
		this.knockBack = Constants.KnockBackValues.spitterKnockBack;
		
		this.mesh = Visual.Meshes.spitterMesh();
	}
	
	rangeAttack() {
		let spreadAngle = 0.2;
		let factor = Math.random() > 0.5 ? 1 : -1;
		let dir = this.lookDirection().clone().applyAxisAngle(new THREE.Vector3(0, 0, 1),
			spreadAngle * factor * Math.random());
		let spittle = new Spittle(this.position(), dir);
		this._blasts.push(spittle);
	}
}

export function makeDefault(aiInfo) {
	return new DefaultEnemy(aiInfo);
}

export function makeFat(aiInfo) {
	return new FatEnemy(aiInfo);
}

export function makeSpitter(aiInfo) {
	return new Spitter(aiInfo);
}
