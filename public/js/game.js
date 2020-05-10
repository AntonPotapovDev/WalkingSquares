import { Player } from '/js/player.js';
import { Enemy } from '/js/enemy.js';
import * as Weapon from '/js/weapon.js';
import { WeaponBox } from '/js/item.js';
import * as Constants from '/js/constants.js';

export class Game {
	constructor(gameScene, control) {
		this._fpsFactor = 1;
		this._gameScene = gameScene;
		this._control = control;
		this._player = new Player(control, new Weapon.Pistol());
		this._gameScene.add(this._player);
		this._enemies = [];
		this._items = [];
		this._bullets = [];
		this._spawnRate = Constants.TimeValues.baseEnemySpawnRate;
		this._weaponSpawnTimeout = Constants.TimeValues.nextWeaponSpawnTimeout;
		this._gameZoneRadius = Math.max(gameScene.sizes().width, gameScene.sizes().height)
			+ Constants.SystemValues.gameZoneRadiusOffset;
	}
	
	start() {
		this._initEnemies();
		this._initWeaponSpawn();
		this._gameLoop();
	}
	
	_gameLoop() {
		this._control.update();
		this._updatePlayer();
		this._updateBullets();
		this._updateEnemies();
		this._updateItems();
		
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
		for (let i = 0; i < this._items.length; i++) {
			let distance = this._items[i].position().clone().sub(this._player.position()).length();
			if (distance > 40)
				continue;

			let item = this._items[i].pick();
			this._player.weapon = item;
			this._gameScene.remove(this._items[i]);
			this._items.splice(i, 1);
			i--;
		}
	}
	
	_updateBullets() {
		for (let i = 0; i < this._bullets.length; i++) {
			let obj = this._bullets[i];
			obj.update();
			
			if (obj.position().length > this._gameZoneRadius) {
				this._scene.remove(obj.mesh);
				this._bullets(i, 1);
				i--;
				continue;
			}
			
			let blast_deleted = false;
			for (let j = 0; j < this._enemies.length; j++) {
				let target = this._enemies[j];
				let dist = (target.position().clone().sub(obj.position().clone())).length();

				if (dist > 30)
					continue;

				this._gameScene.remove(target);
				this._enemies.splice(j, 1);
				j--;
				if (blast_deleted)
					continue;
				
				this._gameScene.remove(obj);
				this._bullets.splice(i, 1);
				i--;
				blast_deleted = true;
			}
		}
	}
	
	_updateEnemies() {
		for (let i = 0; i < this._enemies.length; i++) {
			let target = this._enemies[i];
			target.update();
			target.lookAt(this._player.position());
			
			let distance = this._player.position().clone().sub(target.position()).length();
			if (distance < 30 && this._player.hp != 0) {
				this._player.damage(Constants.DamageValues.enemyDamage);
			}
			
			if (target.position().length > this._gameZoneRadius) {
				this._gameScene.remove(target);
				this._enemies.splice(i, 1);
				i--;
			}
		}
	}
	
	_initEnemies() {
		if (this._player.hp == 0)
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
			this._enemies.push(enemy);
			
			this._spawnRate = Math.max(Constants.TimeValues.minEnemySpawnRate, 
				this._spawnRate - Constants.TimeValues.enemySpawnDecrease);
			
			this._initEnemies();
		}, this._spawnRate);
	}
	
	_initWeaponSpawn() {
		setInterval(() => {
			let factor1 = Math.random() > 0.5 ? -1 : 1;
			let factor2 = Math.random() > 0.5 ? -1 : 1;
			let spawnX = this._gameScene.sizes().width / 2 * Constants.SystemValues.gameZoneRadiusFactor;
			let spawnY = this._gameScene.sizes().height / 2 * Constants.SystemValues.gameZoneRadiusFactor;
			let position = new THREE.Vector3(factor1 * Math.random() * spawnX, factor2 * Math.random() * spawnY, 0);
			
			let box = new WeaponBox(new Weapon.Shotgun());
			this._gameScene.add(box);
			box.moveTo(position);
			this._items.push(box);
			
		}, this._weaponSpawnTimeout);
	}
}
