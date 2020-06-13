import * as Constants from './constants.js';
import * as Items from './item.js';
import { DefaultEnemy, FatEnemy, Spitter } from './enemy.js';
import * as AI from './ai.js';

export class Spawner {
	constructor(gameScene) {
		this._gameScene = gameScene;
		this._needToStop = true;
		this._waveController = null;
		this._chanceController = null;
	}
	
	setWaveController(waveController) {
		this._waveController = waveController;
	}
	
	setChanceController(chanceController) {
		this._chanceController = chanceController;
	}
	
	update(fpsFactor) {
	}
	
	reset() {
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
		this._spawned = []
		this._timePassed = 0;
		this._itemSpawned = 0;
		this._lastWave = -1;
		this._isWeaponsSpawned = false;
	}
	
	update(fpsFactor) {
		if (this._needToStop)
			return;
		
		this._timePassed += fpsFactor;
		
		let newWave = this._waveController.currentWave();
		if (newWave != this._lastWave) {
			this._timePassed = 0;
			this._itemSpawned = 0;
			this._lastWave = newWave;
			this._isWeaponsSpawned = false;
		}
		
		if (!this._isWeaponsSpawned) {
			this._spawnWeapon();
			this._isWeaponsSpawned = true;
		}
		
		if (this._timePassed >= this._waveController.currentSettings().itemInterval) {
			this._spawnItem();
			this._timePassed = 0;
		}
	}
	
	reset() {
		this._timePassed = 0;
		this._spawned.length = 0;
		this._itemSpawned = 0;
		this._lastWave = -1;
		this._isWeaponsSpawned = false;
	}
	
	start() {
		super.start();
		this._timePassed = 0;
		this._isWeaponsSpawned = false;
	}
	
	spawned() {
		let spawned = this._spawned.slice();
		this._spawned.length = 0;
		return spawned;
	}
	
	_calcSpawnPosition() {
		let factor1 = Math.random() > 0.5 ? -1 : 1;
		let factor2 = Math.random() > 0.5 ? -1 : 1;
		let spawnX = this._gameScene.sizes().width / 2 * Constants.SystemValues.gameZoneRadiusFactor;
		let spawnY = this._gameScene.sizes().height / 2 * Constants.SystemValues.gameZoneRadiusFactor;
		return new THREE.Vector3(factor1 * Math.random() * spawnX, factor2 * Math.random() * spawnY, 0);
	}
	
	_spawnWeapon() {
		let weapons = this._waveController.currentSettings().weapons;
		if (weapons.length == 0)
			return;
		
		for (let weapon of weapons) {
			let position = this._calcSpawnPosition();
			
			let box = new Items.WeaponBox(weapon);
			this._gameScene.add(box);
			box.moveTo(position);
			this._spawned.push(box);
		}
	}
	
	_spawnItem() {
		if (Math.random() >= this._waveController.currentSettings().itemChance ||
			this._itemSpawned >= this._waveController.currentSettings().maxItems)
			return;
			
		let position = this._calcSpawnPosition();
		
		let spawnMedkit = Math.random() < this._chanceController.medkitSpawnChance;
		
		let item = spawnMedkit ? new Items.Medkit() : new Items.MeatPack();
		this._gameScene.add(item);
		item.moveTo(position);
		this._spawned.push(item);
		this._itemSpawned++;
	}
}

export class EnemySpawner extends Spawner {
	constructor(gameScene) {
		super(gameScene);
		this._spawned = [];
		this._timePassed = 0;
		this._aiInfo = null;
		this._spawnedCount = 0;
		this._currentChances = [];
		this._lastWave = -1;
	}
	
	update(fpsFactor) {
		if (this._needToStop)
			return;
		
		if (this._waveController.isWaveActive())
			this._timePassed += fpsFactor;
		
		let newWave = this._waveController.currentWave();
		if (this._lastWave != newWave) {
			this._lastWave = newWave;
			this._spawnedCount = 0;
			
			this._currentChances.length = 0;
			let enemies = this._waveController.currentSettings().enemies;
			let first = 0;
			let second = 0;
			for (let i = 0; i < enemies.length - 1; i++) {
				second += enemies[i].chance;
				this._currentChances.push({first: first, second: second});
				first = second;
			}
			this._currentChances.push({first: first, second: 1});
		}
		
		if (this._waveController.isWaveActive()
			&& this._timePassed >= this._waveController.currentSettings().spawnRate
			&& this._spawnedCount < this._waveController.currentSettings().enemyCount) {
			this._spawn();
			this._timePassed = 0;
		}
	}
	
	reset() {
		this._spawned.length = 0;
		this._timePassed = 0;
		this._spawnedCount = 0;
		this._currentChances.length = 0;
		this._lastWave = -1;
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
	
	_chooseEnemy() {
		let number = Math.random();
		for (let i = 0; i < this._currentChances.length; i++)
			if (number >= this._currentChances[i].first && number < this._currentChances[i].second)
				return i;
		return null;
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
		
		let enemyIndex = this._chooseEnemy();
		let enemy = this._waveController.currentSettings().enemies[enemyIndex].factory(this._aiInfo);
		enemy.moveTo(position);
		this._gameScene.add(enemy);
		this._spawned.push(enemy);
		this._spawnedCount++;
	}
}
