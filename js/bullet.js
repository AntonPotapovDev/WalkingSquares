import * as GObject from './game.object.js';
import * as Constants from './constants.js';
import * as Visual from './visual.js';

export class Blast extends GObject.MovableObject {
	constructor() {
		super();
		this._owner = null;
	}
	
	update(fpsFactor) {
		super.update(fpsFactor);
		this.moveAlongLookDir();
	}
	
	interactWithTarget(target) {
		if (!this.isIntersectWith(target) || target.hp == 0 || this.isNeedToRemove())
			return;
		
		target.damage(this._damage);
		if (this._owner !== null && target.hp == 0)
			this._owner.score++;
		this.remove();
	}
	
	setOwner(owner) {
		this._owner = owner; 
	}
	
	_placeToStart(position, direction) {
		this.mesh.position.x = position.x;
		this.mesh.position.y = position.y;
		this.setLookDirection(direction);
	}
}

export class Bullet extends Blast {
	constructor(position, direction) {
		super();
		this.speed = Constants.PhisicalValues.bulletSpeed;
		this._radius = Constants.PhisicalValues.bulletRadius;
		this._damage = Constants.DamageValues.bulletDamage;

		this.mesh = Visual.Meshes.bulletMesh();
		this._placeToStart(position, direction);
	}
}

export class Spittle extends Blast {
	constructor(position, direction) {
		super();
		this.speed = Constants.PhisicalValues.spittleSpeed;
		this._radius = Constants.PhisicalValues.spittleRadius;
		this._damage = Constants.DamageValues.spittleDamage;
		
		this.mesh = Visual.Meshes.spittleMesh();
		this._placeToStart(position, direction);
	}
}
