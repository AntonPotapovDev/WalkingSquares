import * as Constants from '/js/constants.js';
import { WeaponBox } from '/js/item.js';

export class Spawner {
	constructor(gameScene) {
		this._gameScene = gameScene;
	}
	
	update() {
	}
	
	start() {
	}
}

export class WeaponSpawner extends Spawner {
	constructor(gameScene, weaponsToSpawn) {
		super(gameScene);
		this._weaponsToSpawn = weaponsToSpawn;
		this._weaponSpawnTimeout = Constants.TimeValues.nextWeaponSpawnTimeout;
		this._spawned = []
	}
	
	update() {
		
	}
	
	start() {
		this._spawn();
	}
	
	spawned() {
		let spawned = this._spawned.slice();
		this._spawned.length = 0;
		return spawned;
	}
	
	_spawn() {
		setTimeout(() => {
			let factor1 = Math.random() > 0.5 ? -1 : 1;
			let factor2 = Math.random() > 0.5 ? -1 : 1;
			let spawnX = this._gameScene.sizes().width / 2 * Constants.SystemValues.gameZoneRadiusFactor;
			let spawnY = this._gameScene.sizes().height / 2 * Constants.SystemValues.gameZoneRadiusFactor;
			let position = new THREE.Vector3(factor1 * Math.random() * spawnX, factor2 * Math.random() * spawnY, 0);
			
			let box = new WeaponBox(this._weaponsToSpawn.shift());
			this._gameScene.add(box);
			box.moveTo(position);
			this._spawned.push(box);
			
			this._weaponSpawnTimeout -= Constants.TimeValues.weaponSpawnTimeoutDecrease;
			if (this._weaponsToSpawn.length > 0)
				this._spawn();
		}, this._weaponSpawnTimeout);
	}
} 