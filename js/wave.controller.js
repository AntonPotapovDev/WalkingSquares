class WaveSettings {
	constructor() {
		this.enemyCount = 0;
		this.enemyTypes = [];
		this.startTimeout = 0;
	}
}

class WaveController {
	constructor() {
		this._currentWave = 0;
		this._settings = [];
		this._timeToNextWave = 0;
		this._isActive = false;
		this._totalSpawned = 0;
	}
	
	currentWave() {
		return this._currentWave + 1;
	}
	
	currentSettings() {
		return this._settings[Math.min(this._currentWave, this._settings.length - 1)];
	}
	
	setSettingList(settings) {
		this._settings = settings;
	}
	
	isStarted() {
		return this._isActive;
	}
	
	totalSpawned() {
		return this._totalSpawned;
	}
	
	start() {
		if (this._settings.length == 0)
			return;
		
		this._isActive = true;
		this._timeToNextWave = this._settings[0].startTimeout;
		this._totalSpawned += this._settings[0].enemyCount;
	}
	
	stop() {
		this._isActive = false;
	}
	
	update (delta) {
		this._timeToNextWave -= delta;
		
		if (this._timeToNextWave > 0)
			return;
		
		this._currentWave++;
		
		let waveIndex = Math.min(this._currentWave, this._settings.length - 1);
		this._timeToNextWave = this._settings[waveIndex].startTimeout;
		this._totalSpawned += this._settings[waveIndex].enemyCount;
	}
}
