import * as GObject from '/js/game.object.js';
import * as Constants from '/js/constants.js';

export class Enemy extends GObject.Unit {
	constructor() {
		super();
		this.hp = Constants.HpValues;
		this.speed = Constants.PhisicalValues.enemyBaseSpeed + Constants.PhisicalValues.enemySpeedFactor * Math.random();
		this._radius = Constants.PhisicalValues.enemyRadius;
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0x5cd689, side: THREE.DoubleSide });
		let target = new THREE.Mesh(geometry, material);
		this.mesh = target;
	}
	
	update() {
		// Rewrite when AI come
		this.moveAlongLookDir();
	}
}
