import * as GObject from './game.object.js';
import * as Constants from './constants.js';
import * as Visual from './visual.js';

export class Bullet extends GObject.MovableObject {
	constructor(position, direction, owner) {
		super();
		this.speed = Constants.PhisicalValues.bulletSpeed;
		this._radius = Constants.PhisicalValues.bulletRadius;
		this._damage = Constants.DamageValues.bulletDamage;
		this._owner = owner;

		this.mesh = Visual.Meshes.bulletMesh();
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		
		this.setLookDirection(direction);
	}
	
	interactWithTarget(enemy) {
		if (!this.isIntersectWith(enemy) || enemy.hp == 0 || this.isNeedToRemove())
			return;
		
		enemy.damage(this._damage);
		if (this._owner !== null && enemy.hp == 0)
			this._owner.score++;
		this.remove();
	}
	
	update(fpsFactor) {
		super.update(fpsFactor);
		this.moveAlongLookDir();
	}
}
