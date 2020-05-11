import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';
import * as Visual from '/js/visual.js';

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
	
	interactWithPlayer(player) {
		if (!this.isIntersectWith(player) || player.hp == 0)
			return;
		
		player.damage(Constants.DamageValues.enemyDamage);
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
