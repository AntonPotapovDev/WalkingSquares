import * as GObject from '/js/game.object.js';

export class Bullet extends GObject.MovableObject {
	constructor(x, y, dirX, dirY) {
		super();
		this.speed = 20;

		let geometry = new THREE.PlaneGeometry(5, 10);
		let material = new THREE.MeshBasicMaterial({ color: 0xfff000, side: THREE.DoubleSide });
		let blast = new THREE.Mesh(geometry, material);
		blast.position.x = x;
		blast.position.y = y; 
		this.mesh = blast;
		
		this.setLookDirection(dirX, dirY);
	}
	
	update() {
		this.moveAlongLookDir();
	}
}
