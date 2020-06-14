import { PhisicalValues } from './constants.js';
import { PhysicEngine } from './physic.engine.js';

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
		this._isOffscreen = null;
		this._offscreenAllowed = true;
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
	
	isOffscreen() {
		return this._isOffscreen;
	}

	offscreenAllowed() {
		return this._offscreenAllowed;
	}
	
	setIsOffscreen(isOff) {
		this._isOffscreen = isOff;
	}
}

export class MovableObject extends GameObject {
	constructor() {
		super();
		this.speed = 0;
		this._look_dir = new THREE.Vector3(0, 1, 0);
		this._movement = new THREE.Vector3(0, 0, 0);
	}
	
	move(vec) {
		let x = vec.x;
		let y = vec.y;
		if (x != 0 || y != 0) {
			let length = Math.sqrt(x*x + y*y);
			x = x / length;
			y = y / length;
		}
		
		this._movement.x += this._fpsFactor * this.speed * x;
		this._movement.y += this._fpsFactor * this.speed * y;
	}

	applyMovement() {
		this.mesh.position.x += this._movement.x;
		this.mesh.position.y += this._movement.y;
		this._movement = new THREE.Vector3(0, 0, 0);
	}

	rejectMovement() {
		this._movement = new THREE.Vector3(0, 0, 0);
	}

	movement() {
		return this._movement;
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
		this._immortalityTime = 0;
		this._timeAfterDamage = 0;
		this._isImmortal = false;
		this._knockBackResist = false;
		this._isInBacking = false;
		this._backingVector = new THREE.Vector3(0, 0, 0);
		this._origSpeed = 0;
	}
	
	damage(dp) {
		if (this._isImmortal)
			return;
		
		this.hp = Math.max(this.hp - dp, 0);
		if (this._immortalityTime > 0)
			this._isImmortal = true;
	}

	update(fpsFactor) {
		super.update(fpsFactor);

		if (this._isImmortal)
			this._timeAfterDamage += fpsFactor;

		if (this._timeAfterDamage >= this._immortalityTime) {
			this._timeAfterDamage = 0;
			this._isImmortal = false;
		}

		if (this._isInBacking) {
			this._movement.x = this._backingVector.x * fpsFactor;
			this._movement.y = this._backingVector.y * fpsFactor;
			let exp = Math.exp(PhisicalValues.pushAccFactor * fpsFactor)
			this._backingVector.x *= exp;
			this._backingVector.y *= exp;
			if (this._backingVector.length() < PhisicalValues.minPushLength) {
				this._isInBacking = false;
				this.speed = this._origSpeed;
			}
		}
	}

	push(vec, speed) {
		if (this._isInBacking || this._knockBackResist)
			return;

		this._backingVector.x = vec.x * speed;
		this._backingVector.y = vec.y * speed;
		this._isInBacking = true;
		this.speed = this.speed * PhisicalValues.knockBackSpeedFactor;
	}
}
