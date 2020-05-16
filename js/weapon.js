import { Bullet } from './bullet.js';
import { WeaponCoolDown, WeaponAmmo } from './constants.js';

export class Weapon {
	constructor() {
		this._ammo = 0;
		this._coolDown = 0;
		this._timePassed = 0;
		this._ready = true;
		this._owner = null;
		this._isHoldable = false;
	}
	
	setOwner(owner) {
		this._owner = owner;
	}
	
	isHoldable() {
		return this._isHoldable;
	}
	
	coolDown() {
		return this._coolDown;
	}
	
	update(fpsFactor) {
		if (!this._ready)
			this._timePassed += fpsFactor;
		
		if (this._timePassed < this._coolDown)
			return;
		
		this._timePassed = 0;
		this._ready = true;
	}
	
	use() {
		if (!this._ready)
			return;
		// infinite ammo
		//this._ammo = Math.max(0, this._ammo - 1);
	}
}

export class Pistol extends Weapon {
	constructor() {
		super();
		this._ammo = WeaponAmmo.pistolAmmo;
		this._coolDown = WeaponCoolDown.pistolCool;
	}
	
	use(position, direction) {
		super.use();
		if (!this._ready || this._ammo == 0)
			return [];
		
		this._ready = false;
		let bullet = [];
		bullet.push(new Bullet(position, direction, this._owner));
		return bullet;
	}
}

export class Shotgun extends Weapon {
	constructor() {
		super();
		this._ammo = WeaponAmmo.shotgunAmmo;
		this._coolDown = WeaponCoolDown.shotgunCool;
	}
	
	use(position, direction) {
		super.use();
		if (!this._ready || this._ammo == 0)
			return [];
		
		this._ready = false;
		let bullets = [];
		let bulletCount = 4;
		let spreadAngle = 0.2;
		let delta = spreadAngle / (bulletCount - 1);
		let angle = -spreadAngle / 2;
		for (let i = 0; i < bulletCount; i++) {
			let dir = direction.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
			let bullet = new Bullet(position, dir, this._owner);
			bullets.push(bullet);
			angle += delta;
		}
		
		return bullets;
	}
}

export class SubmachineGun extends Weapon {
	constructor() {
		super();
		this._ammo = WeaponAmmo.submachineGunAmmo;
		this._isHoldable = true;
		this._coolDown = WeaponCoolDown.submachineGunCool;
	}
	
	use(position, direction) {
		super.use();
		if (!this._ready || this._ammo == 0)
			return [];
		
		this._ready = false;
		let spreadAngle = 0.1;
		let factor = Math.random() > 0.5 ? 1 : -1;
		let dir = direction.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), spreadAngle * factor * Math.random());
		let bullet = new Bullet(position, dir, this._owner);
		
		return [ bullet ];
	}
}

export class Minigun extends Weapon {
	constructor() {
		super();
		this._ammo = WeaponAmmo.minigunAmmo;
		this._isHoldable = true;
		this._coolDown = WeaponCoolDown.minigunCool;
	}
	
	use(position, direction) {
		super.use();
		if (!this._ready || this._ammo == 0)
			return [];
		
		this._ready = false;
		let spreadAngle = 0.15;
		let factor = Math.random() > 0.5 ? 1 : -1;
		let dir = direction.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), spreadAngle * factor * Math.random());
		let bullet = new Bullet(position, dir, this._owner);
		
		return [ bullet ];
	}
}
