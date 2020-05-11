import * as Constants from '/js/constants.js';
import { WeaponBox } from '/js/item.js';
import { Enemy } from '/js/enemy.js';

export class Spawner {
	constructor(gameScene) {
		this._gameScene = gameScene;
		this._needToStop = true;
	}
	
	update() {
	}
	
	start() {
		this._needToStop = false;
	}
	
	stop() {
		this._needToStop = true;
	}
}

export class WeaponSpawner extends Spawner {
	constructor(gameScene) {
		super(gameScene);
		this._weaponsToSpawn = [];
		this._weaponSpawnTimeout = Constants.TimeValues.nextWeaponSpawnTimeout;
		this._spawned = []
	}
	
	update() {
		
	}
	
	start() {
		super.start();
		this._spawn();
	}
	
	spawned() {
		let spawned = this._spawned.slice();
		this._spawned.length = 0;
		return spawned;
	}
	
	setWeaponsToSpawn(weapons) {
		this._weaponsToSpawn = weapons;
	}
	
	_spawn() {
		if (this._needToStop)
			return;
		
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

export class EnemySpawner extends Spawner {
	constructor(gameScene) {
		super(gameScene);
		this._spawnRate = Constants.TimeValues.baseEnemySpawnRate;
		this._spawned = []
	}
	
	update() {
		
	}
	
	start() {
		super.start();
		this._spawn();
	}
	
	spawned() {
		let spawned = this._spawned.slice();
		this._spawned.length = 0;
		return spawned;
	}
	
	_spawn() {
		if (this._needToStop)
			return;
		
		setTimeout(() => {
			let factor1 = Math.random() > 0.5 ? -1 : 1;
			let factor2 = Math.random() > 0.5 ? -1 : 1;
			let position = null;
			
			let spawnX = this._gameScene.sizes().width / 2 + Constants.SystemValues.gameZoneRadiusOffset;
			let spawnY = this._gameScene.sizes().height / 2 + Constants.SystemValues.gameZoneRadiusOffset;
			if (Math.random() > 0.5)
				position = new THREE.Vector3(factor1 * spawnX, factor2 * Math.random() * spawnY, 0);
			else
				position = new THREE.Vector3(factor1 * Math.random() * spawnX, factor2 * spawnY, 0);
			
			let enemy = new Enemy();
			enemy.moveTo(position);
			this._gameScene.add(enemy);
			this._spawned.push(enemy);
			
			this._spawnRate = Math.max(Constants.TimeValues.minEnemySpawnRate, 
				this._spawnRate - Constants.TimeValues.enemySpawnDecrease);
			
			this._spawn();
		}, this._spawnRate);
	}
}
