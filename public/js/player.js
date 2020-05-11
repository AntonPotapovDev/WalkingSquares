import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';
import * as Visual from '/js/visual.js';

export class Player extends GObject.Unit {
	constructor(control, weapon) {
		super();
		this.speed = Constants.PhisicalValues.playerSpeed;
		this.hp = Constants.HpValues.playerHp;
		this._radius = Constants.PhisicalValues.playerRadius;
		this.weapon = weapon;
		this._bullets = [];
		this._control = control;
		this.mesh = Visual.Meshes.playerMesh();
		
		this._deltaColor = { r: 0, g: 0, b: 0 };
		let deadColor = new THREE.Color(Visual.Colors.deadPlayerColor);
		this._deltaColor.r = (deadColor.r - this.mesh.material.color.r) / Constants.HpValues.playerHp;
		this._deltaColor.g = (deadColor.g - this.mesh.material.color.g) / Constants.HpValues.playerHp;
		this._deltaColor.b = (deadColor.b - this.mesh.material.color.b) / Constants.HpValues.playerHp;
	}
	
	damage(dp) {
		super.damage(dp);
		this.mesh.material.color.r += this._deltaColor.r;
		this.mesh.material.color.g += this._deltaColor.g;
		this.mesh.material.color.b += this._deltaColor.b;
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
	
	update() {
		if (this.hp > 0) {
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
