import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';

export class Player extends GObject.Unit {
	constructor(control, weapon) {
		super();
		this.speed = Constants.PhisicalValues.playerSpeed;
		this.hp = Constants.HpValues.playerHp;
		this._radius = Constants.PhisicalValues.playerRadius;
		this.weapon = weapon;
		this._bullets = [];
		this._control = control;
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0x6d9cbd, side: THREE.DoubleSide });
		let square = new THREE.Mesh(geometry, material);
		this.mesh = square;
		
		this._deltaColor = { r: 0, g: 0, b: 0 };
		let deadColor = new THREE.Color(0xf54542);
		this._deltaColor.r = (deadColor.r - material.color.r) / Constants.HpValues.playerHp;
		this._deltaColor.g = (deadColor.g - material.color.g) / Constants.HpValues.playerHp;
		this._deltaColor.b = (deadColor.b - material.color.b) / Constants.HpValues.playerHp;
	}
	
	damage(dp) {
		super.damage(dp);
		this.mesh.material.color.r += this._deltaColor.r;
		this.mesh.material.color.g += this._deltaColor.g;
		this.mesh.material.color.b += this._deltaColor.b;
		if (this.hp == 0) {
			this.mesh.material.color.copy(new THREE.Color(0x5cd689));
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
}
