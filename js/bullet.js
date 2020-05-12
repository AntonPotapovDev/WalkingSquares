import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';
import * as Visual from '/js/visual.js';

export class Bullet extends GObject.MovableObject {
	constructor(position, direction) {
		super();
		this.speed = Constants.PhisicalValues.bulletSpeed;
		this._radius = Constants.PhisicalValues.bulletRadius;
		this._damage = Constants.DamageValues.bulletDamage;

		this.mesh = Visual.Meshes.bulletMesh();
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		
		this.setLookDirection(direction);
	}
	
	interactWithEnemy(enemy) {
		if (!this.isIntersectWith(enemy) || enemy.hp == 0 || this.isNeedToRemove())
			return;
		
		enemy.damage(this._damage);
		this.remove();
	}
	
	update() {
		this.moveAlongLookDir();
	}
}
