import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';

export class Bullet extends GObject.MovableObject {
	constructor(position, direction) {
		super();
		this.speed = Constants.PhisicalValues.bulletSpeed;

		let geometry = new THREE.PlaneGeometry(5, 10);
		let material = new THREE.MeshBasicMaterial({ color: 0xfff000, side: THREE.DoubleSide });
		let blast = new THREE.Mesh(geometry, material);
		blast.position.copy(new THREE.Vector3(position.x, position.y, 0)); 
		this.mesh = blast;
		
		this.setLookDirection(direction);
	}
	
	update() {
		this.moveAlongLookDir();
	}
}
