import * as GObject from '/js/game.object.js';

export class Player extends GObject.Unit {
	constructor(control, weapon) {
		super();
		this.speed = 10;
		this.hp = 100;
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
			this.speed = 3;
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
			this.move(moveVector.x, moveVector.y);
			
			let mouse = this._control.mouse();
			this.lookAt(mouse.x, mouse.y);
			
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