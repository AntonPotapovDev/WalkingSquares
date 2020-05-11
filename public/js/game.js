import { Player } from '/js/player.js';
import * as Weapon from '/js/weapon.js';

export class Game {
	constructor(gameScene, control, enemySpawner, weaponSpawner) {
		this._fpsFactor = 1;
		this._gameScene = gameScene;
		this._control = control;
		this._player = new Player(control, new Weapon.Pistol());
		this._gameScene.add(this._player);
		this._enemies = [];
		this._items = [];
		this._bullets = [];
		this._weaponSpawner = weaponSpawner;
		this._weaponSpawner.setWeaponsToSpawn([ new Weapon.Shotgun(), new Weapon.SubmachineGun() ]);
		this._enemySpawner = enemySpawner;
	}
	
	start() {
		this._enemySpawner.start();
		this._weaponSpawner.start();
		this._gameLoop();
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
			target.lookAt(this._player.position());
			target.interactWithPlayer(this._player);
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
	}
	
	_updateSpawners() {
		let spawnedWeapons = this._weaponSpawner.spawned();
		for (let weapon of spawnedWeapons)
			this._items.push(weapon);
		
		let spawnedEnemies = this._enemySpawner.spawned();
		for (let enemy of spawnedEnemies)
			this._enemies.push(enemy);
	}
}
