import { Player } from './player.js';
import * as Weapon from './weapon.js';
import * as AI from './ai.js'
import { Hud, HudModel } from './hud.js'
import { WaveController } from './wave.controller.js';
import { waveSettings } from './wave.settings.js';
import { ChanceController } from './chance.controller.js';
import { PhysicEngine } from './physic.engine.js';

export class Game {
	constructor(gameScene, control, textRenderer, enemySpawner, itemSpawner) {
		this._prevTime = 0;
		this._currentTime = 0;
		this._gameScene = gameScene;
		this._control = control;
		this._player = null;
		this._enemies = [];
		this._items = [];
		this._bullets = [];
		this._enemyBlasts = [];
		this._drops = [];
		this._itemSpawner = itemSpawner;
		this._enemySpawner = enemySpawner;
		this._aiInfo = null;
		this._textRenderer = textRenderer;
		this._statistic = new HudModel();
		this._hud = new Hud(this._textRenderer, this._gameScene, this._statistic);
		this._waveController = null;
		this._chanceController = null;
		this._physicEngine = new PhysicEngine(this._gameScene);
	}
	
	start() {
		this._init();
		this._prevTime = Date.now();
		this._gameLoop();
	}
	
	_init() {
		let startWeapon = new Weapon.Pistol();
		this._player = new Player(this._control, startWeapon);
		startWeapon.setOwner(this._player);
		this._gameScene.add(this._player);
		
		this._aiInfo = new AI.AiInfo(this._gameScene); 
		
		this._enemySpawner.setAiInfo(this._aiInfo);
		
		this._waveController = new WaveController();
		this._waveController.setSettingList(waveSettings);
		this._waveController.setEnemyList(this._enemies);
		
		this._enemySpawner.setWaveController(this._waveController);
		this._itemSpawner.setWaveController(this._waveController);
		this._waveController.start();
		
		this._chanceController = new ChanceController();
		this._chanceController.setPlayer(this._player);
		this._enemySpawner.setChanceController(this._chanceController);
		this._itemSpawner.setChanceController(this._chanceController);
		
		this._enemySpawner.start();
		this._itemSpawner.start();
		
		this._statistic.update(this._player, this._waveController, this._control);
		this._hud.update(0, true);
	}
	
	_gameLoop() {
		this._currentTime = Date.now();
		let fpsFactor = (this._currentTime - this._prevTime) / 1000;
		if (this._control.isPause()) {
			fpsFactor = 0;
			this._hud.update(0, true);
		}
		
		this._control.update();
		
		if (this._control.needToRestart()) {
			this._resetAll();
			this._init();
			this._control.restartHandled();
		}
		
		this._hud.update(fpsFactor);
		
		this._updatePlayer(fpsFactor);
		this._updateBullets(fpsFactor);
		this._updateEnemies(fpsFactor);
		this._updateItems(fpsFactor);
		this._updateDrops(fpsFactor);
		this._updateSpawners(fpsFactor);
		
		this._statistic.update(this._player, this._waveController, this._control);
		
		this._clearObjects();
		this._gameScene.update();
		
		requestAnimationFrame(this._gameLoop.bind(this));
		let renderer = this._gameScene.renderer();
		renderer.render();
		
		this._prevTime = this._currentTime;
	}
	
	_updatePlayer(fpsFactor) {
		this._player.update(fpsFactor);
		this._physicEngine.process(this._player);
		let bullets = this._player.bullets();
		for (let i = 0; i < bullets.length; i++) {
			this._gameScene.add(bullets[i]);
			this._bullets.push(bullets[i]);
		}
		
		let dropped = this._player.dropped();
		for (let i = 0; i < dropped.length; i++) {
			this._gameScene.add(dropped[i]);
			this._drops.push(dropped[i]);
		}
	}
	
	_updateItems(fpsFactor) {
		for (let i = 0; i < this._items.length; i++) {
			this._items[i].update(fpsFactor);
			this._player.interactWithItem(this._items[i]);
		}
	}
	
	_updateBullets(fpsFactor) {
		for (let i = 0; i < this._bullets.length; i++) {
			let bullet = this._bullets[i];
			bullet.update(fpsFactor);
			this._physicEngine.process(bullet);
			
			for (let j = 0; j < this._enemies.length; j++) {
				let target = this._enemies[j];

				bullet.interactWithTarget(target);
			}
		}
		
		for (let i = 0; i < this._enemyBlasts.length; i++) {
			this._enemyBlasts[i].update(fpsFactor);
			this._physicEngine.process(this._enemyBlasts[i]);
			this._enemyBlasts[i].interactWithTarget(this._player);
		}
	}
	
	_updateEnemies(fpsFactor) {
		for (let i = 0; i < this._enemies.length; i++) {
			let target = this._enemies[i];
			target.update(fpsFactor);
			this._gameScene.isOffscreen(target);
			this._physicEngine.process(target);
			
			let blasts = target.blasts();
			for (let j = 0; j < blasts.length; j++) {
				this._gameScene.add(blasts[j]);
				this._enemyBlasts.push(blasts[j]);
			}
		}
	}
	
	_updateDrops(fpsFactor) {
		for (let i = 0; i < this._drops.length; i++) {
			let drop = this._drops[i];
			drop.update(fpsFactor);
		}
	}
	
	_resetAll() {
		this._gameScene.clear();
		this._enemySpawner.stop();
		this._itemSpawner.stop();
		this._enemies.length = 0;
		this._items.length = 0;
		this._drops.length = 0;
		this._enemySpawner.reset();
		this._itemSpawner.reset();
		this._waveController.reset();
	}
	
	_clearObjects() {
		for (let i = 0; i < this._bullets.length; i++) {
			if (!this._bullets[i].isNeedToRemove())
				continue;
			
			this._bullets.splice(i, 1);
			i--;
		}
		
		for (let i = 0; i < this._enemyBlasts.length; i++) {
			if (!this._enemyBlasts[i].isNeedToRemove())
				continue;
			
			this._enemyBlasts.splice(i, 1);
			i--;
		}
		
		for (let i = 0; i < this._enemies.length; i++) {
			if (!this._enemies[i].isNeedToRemove())
				continue;
			
			this._enemies.splice(i, 1);
			i--;
		}
		
		for (let i = 0; i < this._items.length; i++) {
			if (!this._items[i].isNeedToRemove())
				continue;
			
			this._items.splice(i, 1);
			i--;
		}
		
		for (let i = 0; i < this._drops.length; i++) {
			if (!this._drops[i].isNeedToRemove())
				continue;
			
			this._drops.splice(i, 1);
			i--;
		}
	}
	
	_updateSpawners(fpsFactor) {
		this._waveController.update(fpsFactor);
		this._chanceController.update(fpsFactor);
		
		this._itemSpawner.update(fpsFactor);
		let spawnedItems = this._itemSpawner.spawned();
		for (let item of spawnedItems)
			this._items.push(item);
		
		this._enemySpawner.update(fpsFactor);
		let spawnedEnemies = this._enemySpawner.spawned();
		for (let enemy of spawnedEnemies)
			this._enemies.push(enemy);
		
		if (this._player.hp == 0) {
			this._enemySpawner.stop();
			this._itemSpawner.stop();
		}
	}
}
