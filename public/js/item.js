import * as GObject from '/js/game.object.js';

export class Item extends GObject.GameObject {
	constructor(object) {
		super();
		this._object = object;
	}
	
	pick() {
		return this._object;
	}
	
	update() {
		
	}
}

export class WeaponBox extends Item {
	constructor(weapon) {
		super(weapon);
		let geometry = new THREE.PlaneGeometry(20, 20);
		let material = new THREE.MeshBasicMaterial({ color: 0x3b572f, side: THREE.DoubleSide });
		let box = new THREE.Mesh(geometry, material);
		this.mesh = box;
	}
}