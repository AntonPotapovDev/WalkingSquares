import * as GObject from './game.object.js';
import * as Constants from './constants.js';
import * as Visual from './visual.js';

export class Enemy extends GObject.Unit {
	constructor(ai) {
		super();
		this._ai = ai;
		this._ai.setAgent(this);
		this.hp = Constants.HpValues.enemyHP;
		this.speed = Constants.PhisicalValues.enemyBaseSpeed + Constants.PhisicalValues.enemySpeedFactor * Math.random();
		this._radius = Constants.PhisicalValues.enemyRadius;
		
		this.mesh = Visual.Meshes.enemyMesh();
	}
	
	interactWithTarget(target) {
		if (!this.isIntersectWith(target) || target.hp == 0)
			return;
		
		target.damage(Constants.DamageValues.enemyDamage);
	}
	
	damage(dp) {
		super.damage(dp);
		if (!this.isNeedToRemove() && this.hp == 0)
			this.remove();
	}
	
	update() {
		this._ai.update();
	}
}
