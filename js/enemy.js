import * as GObject from './game.object.js';
import * as Constants from './constants.js';
import * as Visual from './visual.js';

export class Enemy extends GObject.Unit {
	constructor(ai) {
		super();
		this._ai = ai;
		this._ai.setAgent(this);
	}
	
	interactWithTarget(target) {
		if (!this.isIntersectWith(target) || target.hp == 0)
			return;
		
		target.damage(Constants.DamageValues.enemyDamage * this._fpsFactor);
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
		this.hp = Constants.HpValues.enemyHP;
		this.speed = Constants.PhisicalValues.enemyBaseSpeed + Constants.PhisicalValues.enemySpeedFactor * Math.random();
		this._radius = Constants.PhisicalValues.enemyRadius;
		
		this.mesh = Visual.Meshes.enemyMesh();
	}
}

export class FatEnemy {
	
}
