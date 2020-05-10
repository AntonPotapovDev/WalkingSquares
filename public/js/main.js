import * as GObject from '/js/game.object.js'

class Player extends GObject.Unit {
	constructor(control, weapon) {
		super();
		this.speed = 10;
		this.hp = 100;
		this.weapon = weapon;
		this._bullets = [];
		this._control = control;
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
		let square = new THREE.Mesh(geometry, material);
		this.mesh = square;
	}
	
	damage(dp) {
		super.damage(dp);
		this.mesh.material.color.add(new THREE.Color(0.01 * dp, -0.01 * dp, 0));
		if (this.hp == 0)
			this.mesh.material.color.copy(new THREE.Color(1, 1, 1));
	}
	
	fire() {
		return this.weapon.use(this.position(), this.lookDirection());
	}
	
	bullets() {
		let bullets = this._bullets.slice();
		this._bullets.length = 0;
		return bullets;
	}
	
	update() {
		if (this.hp > 0) {
			let moveVector = this._control.moveVector();
			this.move(moveVector.x, moveVector.y);
			
			let mouse = this._control.mouse();
			this.lookAt(mouse.x, mouse.y);
			
			for (let i = 0; i < this._control.mouseClicks(); i++) {
				let bullets = this.fire();
				this._bullets = this._bullets.concat(bullets);
			}
		}
		else {
			this.moveAlongLookDir();
		}
		this._control.mouseClicksHandled();
	}
}

class Bullet extends GObject.MovableObject {
	constructor(x, y, dirX, dirY) {
		super();
		this.speed = 20;

		let geometry = new THREE.PlaneGeometry(5, 10);
		let material = new THREE.MeshBasicMaterial({ color: 0xfff000, side: THREE.DoubleSide });
		let blast = new THREE.Mesh(geometry, material);
		blast.position.x = x;
		blast.position.y = y; 
		this.mesh = blast;
		
		this.setLookDirection(dirX, dirY);
	}
	
	update() {
		this.moveAlongLookDir();
	}
}

class Enemy extends GObject.Unit {
	constructor() {
		super();
		this.hp = 1;
		this.speed = 0.1;//2 + 3 * Math.random();
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
		let target = new THREE.Mesh(geometry, material);
		this.mesh = target;
	}
	
	update() {
		// Rewrite when AI come
		this.move(-1, -1);
	}
}

class Item extends GObject.GameObject {
	constructor(scene, object) {
		super();
		this._scene = scene;
		this._object = object;
	}
	
	pick() {
		if (this.mesh == null)
			return;
		
		this._scene.remove(this.mesh);
		return this._object;
	}
	
	update() {
		
	}
}

class WeaponBox extends Item {
	constructor(scene, weapon) {
		super(scene, weapon);
		let geometry = new THREE.PlaneGeometry(20, 20);
		let material = new THREE.MeshBasicMaterial({ color: 0x3b572f, side: THREE.DoubleSide });
		let box = new THREE.Mesh(geometry, material);
		this.mesh = box;
	}
}

class Weapon {
	constructor(ammo) {
		this._ammo = ammo;
		this._could_down = 0;
		this._ready = true;
	}
	
	use() {
		if (!this._ready)
			return;
		// infinite ammo
		//this._ammo = Math.max(0, this._ammo - 1);
		this._couldDown();
	}
	
	_couldDown() {
		setTimeout(() => { this._ready = true; }, this._could_down);
	}
}

class Pistol extends Weapon {
	constructor() {
		super(100);
		this._could_down = 300;
	}
	
	use(position, direction) {
		super.use();
		if (!this._ready || this._ammo == 0)
			return [];
		
		this._ready = false;
		let bullet = [];
		bullet.push(new Bullet(position.x, position.y, direction.x, direction.y));
		return bullet;
	}
}

class Shotgun extends Weapon {
	constructor() {
		super(100);
		this._could_down = 600;
	}
	
	use(position, direction) {
		super.use();
		if (!this._ready || this._ammo == 0)
			return [];
		
		this._ready = false;
		let bullets = [];
		let bulletCount = 4;
		let spreadAngle = 0.2;
		let delta = spreadAngle / (bulletCount - 1);
		let angle = -spreadAngle / 2;
		for (let i = 0; i < bulletCount; i++) {
			let dir = direction.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
			let bullet = new Bullet(position.x, position.y, dir.x, dir.y);
			bullets.push(bullet);
			angle += delta;
		}
		
		return bullets;
	}
}

class Game {
	constructor(gameScene, control) {
		this._fpsFactor = 1;
		this._gameScene = gameScene;
		this._control = control;
		this._player = new Player(control, new Pistol());
		this._gameScene.add(this._player);
		this._enemies = [];
		this._items = [];
		this._bullets = [];
	}
	
	start() {
		this._gameLoop();
	}
	
	_gameLoop() {
		this._control.update();
		this._updatePlayer();
		this._updateBullets();
		this._updateEnemies();
		
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
			this._items.splice(i, 1);
			i--;
		}
	}
	
	_updateBullets() {
		for (let i = 0; i < this._bullets.length; i++) {
			let obj = this._bullets[i];
			obj.update();
			
			if (obj.position().length > 1000) {
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
			
			let distance = this._player.position().clone().sub(target.position()).length();
			if (distance < 30 && this._player.hp != 0) {
				this._player.damage(1);
			}
			
			if (target.position().length > 1000) {
				this._gameScene.remove(target);
				this._enemies.splice(i, 1);
				i--;
			}
		}
	}
}

class GameScene {
	constructor(width, height) {
		this._scene = new THREE.Scene();
		this._camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
		this._camera.position.z = 1;
		this._renderer = new THREE.WebGLRenderer();
		this._renderer.setSize(width, height);
	}
	
	domElement() {
		return this._renderer.domElement;
	}
	
	add(obj) {
		this._scene.add(obj.mesh);
	}
	
	remove(obj) {
		this._scene.remove(obj.mesh);
	}
	
	renderer() {
		let rendererObj = { render: (() => {
			this._renderer.render(this._scene, this._camera);
		}).bind(this)};
		return rendererObj;
	}
}

class Control {
	constructor(zoneWidth, zoneHeight) {
		this._width = zoneWidth;
		this._height = zoneHeight;
		this._mouse = new THREE.Vector3(0, 0, 0);
		this._moveVector = new THREE.Vector3(0, 0, 0);
		this._keyMap = {};
		this._isMouseDown = false;
		this._mouseClickCount = 0;
	}
	
	mouse() {
		return this._mouse.clone();
	}
	
	moveVector() {
		return this._moveVector.clone();
	}
	
	mouseClicks() {
		return this._mouseClickCount;
	}
	
	update() {
		this._moveVector = new THREE.Vector3(0, 0, 0);
		for (let key in this._keyMap) {
			let value = this._keyMap[key];
			
			if (!value)
				continue;

			if (key == "KeyW") this._moveVector.y = 1;
			if (key == "KeyS") this._moveVector.y = -1;
			if (key == "KeyA") this._moveVector.x = -1;
			if (key == "KeyD") this._moveVector.x = 1;
		}
	}
	
	onKeyDown(event) {
		this._keyMap[event.code] = event.type == "keydown";
	}
	
	onMouseMove(event) {
		this._mouse.x = event.clientX - this._width / 2;
		this._mouse.y = -event.clientY + this._height / 2;
	}
	
	onMouseDown(event) {
		this._isMouseDown = event.type == "mousedown";
	}
	
	onMouseClick(event) {
		this._mouseClickCount++;
	}
	
	mouseClicksHandled() {
		this._mouseClickCount = 0;
	}
}

function initTargets() {
	if (player.hp == 0)
		return;

	setTimeout(() => {
		let factor1 = Math.random() > 0.5 ? -1 : 1;
		let factor2 = Math.random() > 0.5 ? -1 : 1;
		let position = null;
		
		if (Math.random() > 0.5)
			position = new THREE.Vector3(factor1 * 800, factor2 * Math.random() * 800, 0);
		else
			position = new THREE.Vector3(factor1 * Math.random() * 800, factor2 * 800, 0);
		
		let enemy = new Enemy();
		enemy.moveTo(position);
		enemy.addToScene(scene);
		targets.push(enemy);
		
		spawnRate = Math.max(100, spawnRate - 2);
		
		initTargets();
	}, spawnRate);
}

function initWeapons() {
	setTimeout(() => {
		let factor1 = Math.random() > 0.5 ? -1 : 1;
		let factor2 = Math.random() > 0.5 ? -1 : 1;
		let position = new THREE.Vector3(factor1 * Math.random() * 300, factor2 * Math.random() * 300, 0);
		
		let box = new WeaponBox(scene, new Shotgun());
		box.moveTo(position);
		box.addToScene(scene);
		items.push(box);
		
		weaponSpawnCount++;
	}, weaponSpawnRate);
}

function main() {
	let control = new Control(innerWidth, innerHeight);
	document.addEventListener("keydown", control.onKeyDown.bind(control), false);
	document.addEventListener("keyup", control.onKeyDown.bind(control), false);
	document.addEventListener("mousemove", control.onMouseMove.bind(control), false );
	document.addEventListener("click", control.onMouseClick.bind(control), false );
	
	let gameScene = new GameScene(innerWidth, innerHeight);
	document.body.appendChild(gameScene.domElement());
	
	let game = new Game(gameScene, control);
	game.start();
}

main();
