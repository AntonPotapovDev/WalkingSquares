import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';

export class Item extends GObject.GameObject {
	constructor() {
		super();
		this._radius = Constants.PhisicalValues.itemRadius;
	}
	
	pick(picker) {
		
	}
	
	update() {
		
	}
	
	isValid() {
		return false;
	}
}

export class WeaponBox extends Item {
	constructor(weapon) {
		super(weapon);
		let geometry = new THREE.PlaneGeometry(20, 20);
		let material = new THREE.MeshBasicMaterial({ color: 0x40160b, side: THREE.DoubleSide });
		let box = new THREE.Mesh(geometry, material);
		this.mesh = box;
		this._weapon = weapon;
	}
	
	pick(picker) {
		picker.weapon = this._weapon;
		this._weapon = null;
	}
	
	isValid() {
		return this._weapon != null;
	}
}
