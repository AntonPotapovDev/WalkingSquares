import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';

export class Player extends GObject.Unit {
	constructor(control, weapon) {
		super();
		this.speed = Constants.PhisicalValues.playerSpeed;
		this.hp = Constants.HpValues.playerHp;
		this.weapon = weapon;
		this._bullets = [];
		this._control = control;
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
		let square = new THREE.Mesh(geometry, material);
		this.mesh = square;
	}
	
	damage(dp) {
		super.damage(dp);
		this.mesh.material.color.add(new THREE.Color(0.01 * dp, -0.01 * dp, 0));
		if (this.hp == 0) {
			this.mesh.material.color.copy(new THREE.Color(1, 1, 1));
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
