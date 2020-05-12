import * as Constants from '/js/constants.js';
import * as Items from '/js/item.js';
import { Enemy } from '/js/enemy.js';
import * as AI from '/js/ai.js';

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

export class ItemSpawner extends Spawner {
	constructor(gameScene) {
		super(gameScene);
		this._weaponsToSpawn = [];
		this._weaponSpawnTimeout = Constants.TimeValues.nextWeaponSpawnTimeout;
		this._medkitSpawnTimeout = Constants.TimeValues.medkitSpawnTimeout;
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
	
	_calcSpawnPosition() {
		let factor1 = Math.random() > 0.5 ? -1 : 1;
		let factor2 = Math.random() > 0.5 ? -1 : 1;
		let spawnX = this._gameScene.sizes().width / 2 * Constants.SystemValues.gameZoneRadiusFactor;
		let spawnY = this._gameScene.sizes().height / 2 * Constants.SystemValues.gameZoneRadiusFactor;
		return new THREE.Vector3(factor1 * Math.random() * spawnX, factor2 * Math.random() * spawnY, 0);
	}
	
	_spawn() {
		this._spawnWeapon();
		this._spawnMedkit();
	}
	
	_spawnWeapon() {
		if (this._needToStop)
			return;
		
		setTimeout(() => {
			let position = this._calcSpawnPosition();
			
			let box = new Items.WeaponBox(this._weaponsToSpawn.shift());
			this._gameScene.add(box);
			box.moveTo(position);
			this._spawned.push(box);
			
			this._weaponSpawnTimeout -= Constants.TimeValues.weaponSpawnTimeoutDecrease;
			if (this._weaponsToSpawn.length > 0)
				this._spawnWeapon();
		}, this._weaponSpawnTimeout);
	}
	
	_spawnMedkit() {
		if (this._needToStop)
			return;
		
		setTimeout(() => {
			
			if (Math.random() < Constants.Chances.itemSpawnChance) {
				let position = this._calcSpawnPosition();
				
				let itemsToSpawn = [ new Items.Medkit(), new Items.Meat() ];
				
				let item = itemsToSpawn[Math.floor(Math.random() * itemsToSpawn.length)];
				this._gameScene.add(item);
				item.moveTo(position);
				this._spawned.push(item);
			}
			
			this._spawnMedkit();
		}, this._medkitSpawnTimeout);
	}
}

export class EnemySpawner extends Spawner {
	constructor(gameScene) {
		super(gameScene);
		this._spawnRate = Constants.TimeValues.baseEnemySpawnRate;
		this._spawned = [];
		this._aiInfo = null;
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
	
	setAiInfo(aiInfo) {
		this._aiInfo = aiInfo;
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
			
			let ai = new AI.EnemyAI(this._aiInfo);
			let enemy = new Enemy(ai);
			enemy.moveTo(position);
			this._gameScene.add(enemy);
			this._spawned.push(enemy);
			
			this._spawnRate = Math.max(Constants.TimeValues.minEnemySpawnRate, 
				this._spawnRate - Constants.TimeValues.enemySpawnDecrease);
			
			this._spawn();
		}, this._spawnRate);
	}
}
