export const TargetType = {
	NONE: 'none',
	ALIVE: 'alive',
	FAKE: 'fake'
};

export class GameObject {
	constructor() {
		this.mesh = null;
		this._radius = 0;
		this._needToRemove = false;
		this._targetType = TargetType.NONE;
		this._fpsFactor = 1;
	}
	
	addToScene(scene) {
		scene.add(this.mesh);
	}
	
	remove() {
		this._needToRemove = true;
	}
	
	isNeedToRemove() {
		return this._needToRemove;
	}
	
	position() {
		return this.mesh == null ? null : this.mesh.position;
	}
	
	radius() {
		return this._radius;
	}
	
	targetType() {
		return this._targetType;
	}
	
	isIntersectWith(obj) {
		return this.distanceTo(obj) < this.radius() + obj.radius();
	}
	
	distanceTo(obj) {
		return this.position().distanceTo(obj.position());
	}
	
	moveTo(vec) {
		if (this.mesh == null)
			return;
		this.mesh.position.x = vec.x;
		this.mesh.position.y = vec.y;
	}
	
	update(fpsFactor) {
		this._fpsFactor = fpsFactor;
	}
}

export class MovableObject extends GameObject {
	constructor() {
		super();
		this.speed = 0;
		this._look_dir = new THREE.Vector3(0, 1, 0);
	}
	
	move(vec) {
		let x = vec.x;
		let y = vec.y;
		if (x != 0 || y != 0) {
			let length = Math.sqrt(x*x + y*y);
			x = x / length;
			y = y / length;
		}
		
		this.mesh.position.x += this._fpsFactor * this.speed * x;
		this.mesh.position.y += this._fpsFactor * this.speed * y;
	}
	
	moveAlongLookDir() {
		this.move(this._look_dir);
	}
	
	rotate(angle) {
		this.mesh.rotation.z += angle;
		this._look_dir.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
	}
	
	setLookDirection(vec) {
		let newLookDir = new THREE.Vector3(vec.x, vec.y, 0).normalize();
		let angle = newLookDir.angleTo(this._look_dir);
		let left = new THREE.Vector3(-this._look_dir.y, this._look_dir.x, 0);
		let factor = left.angleTo(newLookDir) < Math.PI / 2 ? 1 : -1;

		this.rotate(factor * angle);
	}
	
	lookDirection() {
		return this._look_dir;
	}
	
	lookAt(vec) {
		let target = new THREE.Vector3(vec.x, vec.y, 0);
		let dir = target.clone().sub(this.position().clone()).normalize();
		let angle = dir.angleTo(this._look_dir);
		let left = new THREE.Vector3(-this._look_dir.y, this._look_dir.x, 0);
		let factor = left.angleTo(dir) < Math.PI / 2 ? 1 : -1;
		this.rotate(factor * angle);
	}
}

export class Unit extends MovableObject {
	constructor() {
		super();
		this.hp = 0;
	}
	
	damage(dp) {
		this.hp = Math.max(this.hp - dp, 0);
	}
}
