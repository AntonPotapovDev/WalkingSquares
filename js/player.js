import * as GObject from './game.object.js';
import * as Constants from './constants.js';
import * as Visual from './visual.js';

export class Player extends GObject.Unit {
	constructor(control, weapon) {
		super();
		this.speed = Constants.PhisicalValues.playerSpeed;
		this.hp = Constants.HpValues.playerHp;
		this._radius = Constants.PhisicalValues.playerRadius;
		this.weapon = weapon;
		this._bullets = [];
		this._drops = [];
		this._dropped = [];
		this._control = control;
		this.mesh = Visual.Meshes.playerMesh();
		this._aiPriority = 0.8;
	}
	
	damage(dp) {
		super.damage(dp);
		if (this.hp == 0) {
			this.mesh.material.color.copy(new THREE.Color(Visual.Colors.enemyColor));
			this.speed = Constants.PhisicalValues.deadPlayerSpeed;
		}
	}
	
	fire() {
		return this.weapon.use(this.position(), this.lookDirection());
	}
	
	bullets() {
		let bullets = this._bullets.slice();
		this._bullets.length = 0;
		return bullets;
	}
	
	dropped() {
		let dropped = this._dropped.slice();
		this._dropped.length = 0;
		return dropped;
	}
	
	addDrop(drop) {
		this._drops.push(drop);
	}
	
	_updateColor() {
		let normalColor = new THREE.Color(Visual.Colors.playerColor);
		let deadColor = new THREE.Color(Visual.Colors.deadPlayerColor);
		let diff = { r: 0, g: 0, b: 0};
		
		diff.r = deadColor.r - normalColor.r;
		diff.g = deadColor.g - normalColor.g;
		diff.b = deadColor.b - normalColor.b;
		
		let percent = (Constants.HpValues.playerHp - this.hp) / Constants.HpValues.playerHp;
		
		this.mesh.material.color.r = normalColor.r + diff.r * percent;
		this.mesh.material.color.g = normalColor.g + diff.g * percent
		this.mesh.material.color.b = normalColor.b + diff.b * percent;
	}
	
	update() {
		if (this.hp > 0) {
			
			this._updateColor();
			
			let minCount = Math.min(this._control.drops(), this._drops.length);
			for (let i = 0 ; i < minCount; i++) {
				let drop = this._drops.shift();
				drop.moveTo(this.position());
				this._dropped.push(drop);
			}
			
			this._control.dropsHandled();
			
			let moveVector = this._control.moveVector();
			this.move(moveVector);
			
			let mouse = this._control.mouse();
			this.lookAt(mouse);
			
			for (let i = 0; i < this._control.mouseClicks(); i++) {
				let bullets = this.fire();
				this._bullets = this._bullets.concat(bullets);
			}
		}
		else {
			this.moveAlongLookDir();
		}
		this._control.mouseClicksHandled();
	}
	
	interactWithItem(item) {
		if (!this.isIntersectWith(item) || this.hp == 0)
			return;
		
		item.pick(this);
	}
}
