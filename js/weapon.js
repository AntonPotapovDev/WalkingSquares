import { Bullet } from './bullet.js';

export class Weapon {
	constructor(ammo) {
		this._ammo = ammo;
		this._could_down = 0;
		this._ready = true;
	}
	
	use() {
		if (!this._ready)
			return;
		// infinite ammo
		//this._ammo = Math.max(0, this._ammo - 1);
		this._couldDown();
	}
	
	_couldDown() {
		setTimeout(() => { this._ready = true; }, this._could_down);
	}
}

export class Pistol extends Weapon {
	constructor() {
		super(100);
		this._could_down = 300;
	}
	
	use(position, direction) {
		super.use();
		if (!this._ready || this._ammo == 0)
			return [];
		
		this._ready = false;
		let bullet = [];
		bullet.push(new Bullet(position, direction));
		return bullet;
	}
}

export class Shotgun extends Weapon {
	constructor() {
		super(100);
		this._could_down = 600;
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
			let bullet = new Bullet(position, dir);
			bullets.push(bullet);
			angle += delta;
		}
		
		return bullets;
	}
}

export class SubmachineGun extends Weapon {
	constructor() {
		super(100);
		this._could_down = 100;
	}
	
	use(position, direction) {
		super.use();
		if (!this._ready || this._ammo == 0)
			return [];
		
		this._ready = false;
		let spreadAngle = 0.1;
		let factor = Math.random() > 0.5 ? 1 : -1;
		let dir = direction.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), spreadAngle * factor * Math.random());
		let bullet = new Bullet(position, dir);
		
		return [ bullet ];
	}
}
