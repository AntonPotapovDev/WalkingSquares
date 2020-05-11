import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';
import * as Visual from '/js/visual.js';

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
		this.mesh = Visual.Meshes.weaponBoxMesh();
		this._weapon = weapon;
	}
	
	pick(picker) {
		picker.weapon = this._weapon;
		this._weapon = null;
		this.remove();
	}
	
	isValid() {
		return this._weapon != null;
	}
}
