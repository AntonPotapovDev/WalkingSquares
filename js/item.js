import * as GObject from './game.object.js';
import * as Constants from './constants.js';
import * as Visual from './visual.js';

export class Item extends GObject.GameObject {
	constructor() {
		super();
		this._radius = Constants.PhisicalValues.itemRadius;
	}
	
	pick(picker) {
	}
}

export class WeaponBox extends Item {
	constructor(weapon) {
		super();
		this.mesh = Visual.Meshes.weaponBoxMesh();
		this._weapon = weapon;
	}
	
	pick(picker) {
		picker.weapon = this._weapon;
		picker.weapon.setOwner(picker);
		this._weapon = null;
		this.remove();
	}
}

export class Medkit extends Item {
	constructor() {
		super();
		this.mesh = Visual.Meshes.medkitMesh();
		this._health = Constants.HpValues.medkitHP;
		this._timePassed = 0;
	}
	
	update(fpsFactor) {
		super.update(fpsFactor);
		this._timePassed += fpsFactor;
		
		if (this._timePassed < Constants.TimeValues.medkitLifetime)
			return;
		
		this._timePassed = 0;
		this.remove();
	}
	
	pick(picker) {
		picker.hp = Math.min(picker.hp + this._health, picker.maxHp);
		this._health = 0;
		this.remove();
	}
}

export class Meat extends GObject.GameObject {
	constructor() {
		super();
		this.mesh = Visual.Meshes.meatMesh();
		this.hp = Constants.HpValues.meatHP;
		this._targetType = GObject.TargetType.FAKE;
	}
	
	update(fpsFactor) {
		super.update(fpsFactor);
		if (this.hp == 0)
			this.remove();
	}
	
	damage(dp) {
		this.hp = Math.max(0, this.hp - dp);
	}
}

export class MeatPack extends Item {
	constructor() {
		super();
		this.mesh = Visual.Meshes.meatMesh();
		this._meat = new Meat();
	}
	
	update() {
		if (this.hp == 0)
			this.remove();
	}
	
	pick(picker) {
		picker.addDrop(this._meat);
		this._meat = null;
		this.remove();
	}
}

