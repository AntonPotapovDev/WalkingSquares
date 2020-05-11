import { Player } from '/js/player.js';
import * as Weapon from '/js/weapon.js';
import * as AI from '/js/ai.js'

export class Game {
	constructor(gameScene, control, enemySpawner, itemSpawner) {
		this._fpsFactor = 1;
		this._gameScene = gameScene;
		this._control = control;
		this._player = null;
		this._enemies = [];
		this._items = [];
		this._bullets = [];
		this._targets = [];
		this._itemSpawner = itemSpawner;
		this._enemySpawner = enemySpawner;
		this._aiInfo = null;
	}
	
	start() {
		this._init();
		this._gameLoop();
	}
	
	_init() {
		this._player = new Player(this._control, new Weapon.Pistol());
		this._gameScene.add(this._player);
		
		this._targets.push(this._player);
		
		this._aiInfo = new AI.AiInfo(this._targets); 
		
		this._enemySpawner.setAiInfo(this._aiInfo);
		this._itemSpawner.setWeaponsToSpawn([ new Weapon.Shotgun(), new Weapon.SubmachineGun() ]);
		
		this._enemySpawner.start();
		this._itemSpawner.start();
	}
	
	_gameLoop() {
		this._control.update();
		
		this._updateSpawners();
		
		this._updatePlayer();
		this._updateBullets();
		this._updateEnemies();
		this._updateItems();
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
			this._targets.push(dropped);
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
	
	_updateGameObjects() {
		//this._aiInfo.update(this._targets);
		
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
		
		for (let i = 0; i < this._targets.length; i++) {
			if (!this._targets[i].isNeedToRemove())
				continue;
			
			this._targets.splice(i, 1);
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
