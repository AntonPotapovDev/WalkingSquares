class WaveSettings {
	constructor() {
		this.enemyCount = 0;
		this.enemyTypes = [];
		this.startTimeout = 0;
		this.spawnRate = 0;
	}
}

class WaveController {
	constructor() {
		this._currentWave = 0;
		this._settings = [];
		this._timeToNextWave = 0;
		this._isStarted = false;
		this._left = 0;
		this._enemies = [];
	}
	
	currentWave() {
		return this._currentWave + 1;
	}
	
	timeToNextWave() {
		return this._timeToNextWave;
	}
	
	currentSettings() {
		return this._settings[Math.min(this._currentWave, this._settings.length - 1)];
	}
	
	setSettingList(settings) {
		this._settings = settings;
	}
	
	setEnemyList(enemies) {
		this._enemies = enemies;
	}
	
	isStarted() {
		return this._isStarted;
	}
	
	isWaveActive() {
		let left = 0;
		for (let enemy of this._enemies)
			if (enemy.hp > 0)
				left++;
				
		return left > 0;
	}
	
	left() {
		return this._left;
	}
	
	start() {
		if (this._isStarted || this._settings.length == 0)
			return;
		
		this._isStarted = true;
	}
	
	stop() {
		this._isStarted = false;
	}
	
	update (delta) {
		if (!this._isStarted)
			return;
		
		this._timeToNextWave -= delta;
		
		for (let enemy of this._enemies)
			if (enemy.hp <= 0)
				this._left--;
		
		if (this._timeToNextWave > 0)
			return;
		
		this._currentWave++;
		
		let waveIndex = Math.min(this._currentWave, this._settings.length - 1);
		this._timeToNextWave = this._settings[waveIndex].startTimeout;
		this._left = this._settings[waveIndex].enemyCount;
	}
}
