import { Player } from './player.js';
import * as Weapon from './weapon.js';
import * as AI from './ai.js'
import { Hud, HudModel } from './hud.js'

export class Game {
	constructor(gameScene, control, enemySpawner, itemSpawner) {
		this._fpsFactor = 1;
		this._gameScene = gameScene;
		this._control = control;
		this._player = null;
		this._enemies = [];
		this._items = [];
		this._bullets = [];
		this._drops = [];
		this._itemSpawner = itemSpawner;
		this._enemySpawner = enemySpawner;
		this._aiInfo = null;
		this._textRenderer = null;
		this._hud = null;
		this._statistic = null;
	}
	
	start() {
		this._init();
		this._gameLoop();
	}
	
	setTextRenderer(renderer) {
		this._textRenderer = renderer;
	}
	
	_init() {
		let startWeapon = new Weapon.Pistol();
		this._player = new Player(this._control, startWeapon);
		startWeapon.setOwner(this._player);
		this._gameScene.add(this._player);
		
		this._aiInfo = new AI.AiInfo(this._gameScene); 
		
		this._enemySpawner.setAiInfo(this._aiInfo);
		this._itemSpawner.setWeaponsToSpawn([ new Weapon.Shotgun(), new Weapon.SubmachineGun() ]);
		
		if (this._textRenderer !== null) {
			this._statistic = new HudModel();
			this._player.setStatistic(this._statistic);
			this._hud = new Hud(this._textRenderer, this._gameScene, this._statistic);
		}
		
		this._enemySpawner.start();
		this._itemSpawner.start();
	}
	
	_gameLoop() {
		this._control.update();
		
		if (this._hud !== null)
			this._hud.update();
		
		this._updateSpawners();
		
		this._updatePlayer();
		this._updateBullets();
		this._updateEnemies();
		this._updateItems();
		this._updateDrops();
		this._updateGameObjects();
		this._gameScene.update();
		
		requestAnimationFrame(this._gameLoop.bind(this));
		let renderer = this._gameScene.renderer();
		renderer.render();
	}
	
	_updatePlayer() {
		this._player.update();
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
	
	_updateItems() {
		for (let i = 0; i < this._items.length; i++)
			this._player.interactWithItem(this._items[i]);
	}
	
	_updateBullets() {
		for (let i = 0; i < this._bullets.length; i++) {
			let bullet = this._bullets[i];
			bullet.update();
			
			for (let j = 0; j < this._enemies.length; j++) {
				let target = this._enemies[j];

				bullet.interactWithEnemy(target);
			}
		}
	}
	
	_updateEnemies() {
		for (let i = 0; i < this._enemies.length; i++) {
			let target = this._enemies[i];
			target.update();
		}
	}
	
	_updateDrops() {
		for (let i = 0; i < this._drops.length; i++) {
			let drop = this._drops[i];
			drop.update();
		}
	}
	
	_updateGameObjects() {
		for (let i = 0; i < this._bullets.length; i++) {
			if (!this._bullets[i].isNeedToRemove())
				continue;
			
			this._bullets.splice(i, 1);
		}
		
		for (let i = 0; i < this._enemies.length; i++) {
			if (!this._enemies[i].isNeedToRemove())
				continue;
			
			this._enemies.splice(i, 1);
		}
		
		for (let i = 0; i < this._items.length; i++) {
			if (!this._items[i].isNeedToRemove())
				continue;
			
			this._items.splice(i, 1);
		}
		
		for (let i = 0; i < this._drops.length; i++) {
			if (!this._drops[i].isNeedToRemove())
				continue;
			
			this._drops.splice(i, 1);
		}
	}
	
	_updateSpawners() {
		let spawnedItems = this._itemSpawner.spawned();
		for (let item of spawnedItems)
			this._items.push(item);
		
		let spawnedEnemies = this._enemySpawner.spawned();
		for (let enemy of spawnedEnemies)
			this._enemies.push(enemy);
		
		if (this._player.hp == 0) {
			this._enemySpawner.stop();
			this._itemSpawner.stop();
		}
	}
}
