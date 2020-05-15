import * as GObject from './game.object.js';
import * as Constants from './constants.js';
import * as Visual from './visual.js';

export class Enemy extends GObject.Unit {
	constructor(ai) {
		super();
		this._ai = ai;
		this._ai.setAgent(this);
		this._damage = 0
	}
	
	interactWithTarget(target) {
		if (!this.isIntersectWith(target) || target.hp == 0)
			return;
		
		target.damage(this._damage * this._fpsFactor);
	}
	
	damage(dp) {
		super.damage(dp);
		if (!this.isNeedToRemove() && this.hp == 0)
			this.remove();
	}
	
	update(fpsFactor) {
		super.update(fpsFactor);
		this._ai.update();
	}
}

export class DefaultEnemy extends Enemy {
	constructor(ai) {
		super(ai);
		this.hp = Constants.HpValues.defaultEnemyHP;
		this._damage = Constants.DamageValues.defaultEnemyDamage;
		this.speed = Constants.PhisicalValues.defaultEnemyBaseSpeed + Constants.PhisicalValues.defaultEnemySpeedFactor * Math.random();
		this._radius = Constants.PhisicalValues.defaultEnemyRadius;
		
		this.mesh = Visual.Meshes.defaultEnemyMesh();
	}
}

export class FatEnemy {
	
}
