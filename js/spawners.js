import * as Constants from './constants.js';
import * as Items from './item.js';
import { DefaultEnemy, FatEnemy } from './enemy.js';
import * as AI from './ai.js';

export class Spawner {
	constructor(gameScene) {
		this._gameScene = gameScene;
		this._needToStop = true;
	}
	
	update(fpsFactor) {
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
		this._itemSpawnTimeout = Constants.TimeValues.itemSpawnTimeout;
		this._spawned = []
		this._timePassedWeapons = 0;
		this._timePassedItems = 0;
	}
	
	update(fpsFactor) {
		if (this._needToStop)
			return;
		
		this._timePassedWeapons += fpsFactor;
		this._timePassedItems += fpsFactor;
		
		if (this._timePassedItems >= this._itemSpawnTimeout) {
			this._spawnItem();
			this._timePassedItems = 0;
		}
		
		if (this._timePassedWeapons >= this._weaponSpawnTimeout) {
			this._spawnWeapon();
			this._timePassedWeapons = 0;
		}
	}
	
	start() {
		super.start();
		this._timePassedWeapons = 0;
		this._timePassedItems = 0;
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
	
	_spawnWeapon() {
		if (this._weaponsToSpawn.length == 0)
			return;
		
		let position = this._calcSpawnPosition();
		
		let box = new Items.WeaponBox(this._weaponsToSpawn.shift());
		this._gameScene.add(box);
		box.moveTo(position);
		this._spawned.push(box);
		
		this._weaponSpawnTimeout -= Constants.TimeValues.weaponSpawnTimeoutDecrease;
	}
	
	_spawnItem() {
		if (Math.random() >= Constants.Chances.itemSpawnChance)
			return;
			
		let position = this._calcSpawnPosition();
		
		let itemsToSpawn = [ new Items.Medkit(), new Items.MeatPack() ];
		
		let item = itemsToSpawn[Math.floor(Math.random() * itemsToSpawn.length)];
		this._gameScene.add(item);
		item.moveTo(position);
		this._spawned.push(item);
	}
}

export class EnemySpawner extends Spawner {
	constructor(gameScene) {
		super(gameScene);
		this._spawnRate = Constants.TimeValues.baseEnemySpawnRate;
		this._spawned = [];
		this._timePassed = 0;
		this._aiInfo = null;
	}
	
	update(fpsFactor) {
		if (this._needToStop)
			return;
		
		this._timePassed += fpsFactor;
		
		if (this._timePassed >= this._spawnRate) {
			this._spawn();
			this._timePassed = 0;
		}
	}
	
	start() {
		super.start();
		this._timePassed = 0;
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
		let spawnFatBoy = Math.random() <= Constants.Chances.fatEnemySpawnChance;
		let enemy = spawnFatBoy ? new FatEnemy(ai) : new DefaultEnemy(ai);
		enemy.moveTo(position);
		this._gameScene.add(enemy);
		this._spawned.push(enemy);
		
		this._spawnRate = Math.max(Constants.TimeValues.minEnemySpawnRate, 
			this._spawnRate - Constants.TimeValues.enemySpawnDecrease);
	}
}
