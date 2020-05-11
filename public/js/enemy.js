import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';

export class Enemy extends GObject.Unit {
	constructor() {
		super();
		this.hp = Constants.HpValues.enemyHP;
		this.speed = Constants.PhisicalValues.enemyBaseSpeed + Constants.PhisicalValues.enemySpeedFactor * Math.random();
		this._radius = Constants.PhisicalValues.enemyRadius;
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0x7db08b, side: THREE.DoubleSide });
		let target = new THREE.Mesh(geometry, material);
		this.mesh = target;
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
		// Rewrite when AI come
		this.moveAlongLookDir();
	}
}
