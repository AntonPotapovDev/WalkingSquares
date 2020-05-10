import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';

export class Enemy extends GObject.Unit {
	constructor() {
		super();
		this.hp = Constants.HpValues;
		this.speed = Constants.PhisicalValues.enemyBaseSpeed + Constants.PhisicalValues.enemySpeedFactor * Math.random();
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
		let target = new THREE.Mesh(geometry, material);
		this.mesh = target;
	}
	
	update() {
		// Rewrite when AI come
		this.moveAlongLookDir();
	}
}
