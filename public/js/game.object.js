export class GameObject {
	constructor() {
		this.mesh = null;
		this.fpsFactor = 1;
	}
	
	addToScene(scene) {
		scene.add(this.mesh);
	}
	
	position() {
		return this.mesh == null ? null : this.mesh.position;
	}
}

export class MovableObject extends GameObject {
	constructor() {
		super();
		this.speed = 0;
		this._look_dir = new THREE.Vector3(0, 1, 0);
	}
	
	move(x, y) {
		this.mesh.position.x += this.fpsFactor * this.speed * x;
		this.mesh.position.y += this.fpsFactor * this.speed * y;
	}
	
	moveAlongLookDir() {
		this.move(this._look_dir.x, this._look_dir.y);
	}
	
	rotate(angle) {
		this.mesh.rotation.z += angle;
		this._look_dir.applyAxisAngle(angle);
	}
	
	lookAt(x, y) {
		let target = new THREE.Vector3(x, y, 0);
		let dir = target.clone().sub(this.position().clone()).normalize();
		let angle = dir.angleTo(this._look_dir);
		let left = new THREE.Vector3(-this._look_dir.y, this._look_dir.x, 0);
		let factor = target.sub(left).angleTo(this._look_dir) <= Math.PI / 2 ? 1 : -1;
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