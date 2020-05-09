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
		let bullets = this._bullets.splice();
		this._bullets.length = 0;
		return bullets;
	}
	
	update() {
		let moveVector = this._control.moveVector();
		if (this.hp > 0) 
			player.move(moveVector.x, moveVector.y);
		else 
			player.moveAlongLookDir();
		
		for (let i = 0; i < this._control.mouseClicks(); i++) {
			let bullets = this.fire();
			this._bullets = this._bullets.concat(bullets);
		}
		control.mouseClicksHandled();
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
		this.speed = 2 + 3 * Math.random();
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
		let target = new THREE.Mesh(geometry, material);
		this.mesh = target;
	}
	
	update() {
		// Rewrite when AI come
		this.move(0, 0);
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
			return null;
		
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
			return null;
		
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
		this._player = new Player();
		this._enemies = [];
		this._items = [];
	}
	
	start() {
		
	}
	
	_update() {
		
	}
}

class GameScene {
	constructor(width, height) {
		this._scene = new THREE.Scene();
		this._camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
		this._camera.position.z = 1;
		this._renderer = new THREE.WebGLRenderer();
		this._renderer.setSize(width, height);
		this._objects = [];
	}
	
	domElement() {
		return this._renderer.domElement;
	}
	
	add(graphicsPresenter) {
		this._objects.push(graphicsPresenter);
		this._scene.add(graphicsPresenter.mesh);
	}
	
	renderer() {
		let rendererObj = { render: () => {
			this._renderer.render(this._scene, this._camera);
		}};
		return rendererObj;
	}
	
	update() {
		for (let i = 0; i < this._objects.lengh; i++) {
			let object = this._objects[i];
			if (object.needToRemove()) {
				this._scene.remove(object.mesh);
				this._objects.splice(i, 1);
				i--;
			}
		}
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

let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(innerWidth / - 2, innerWidth / 2, innerHeight / 2, innerHeight / - 2, 1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let keyMap = {};
let blasts = [];
let targets = [];
let items = [];

let player = new Player(null, new Pistol());
player.addToScene(scene);

let mouse = new THREE.Vector3(0, 0, 0);

camera.position.z = 1;

let score = 0;
let spawnRate = 1000;
let weaponSpawnRate = 2 * 60 * 1000;
let weaponSpawnCount = 0;

function lookAtMouse() {
	if (player.hp <= 0)
		return;

	player.lookAt(mouse.x, mouse.y);
}

function handleKeys() {
	let moveVector = new THREE.Vector2(0, 0);
	for (let key in keyMap) {
		let val = keyMap[key];
		
		if (!val)
			continue;

		if (key == "KeyW")
			moveVector.y = 1;
		if (key == "KeyS")
			moveVector.y = -1;
		if (key == "KeyA")
			moveVector.x = -1;
		if (key == "KeyD")
			moveVector.x = 1;
	}

	moveVector.normalize();
	if (player.hp > 0)
		player.move(moveVector.x, moveVector.y);
	else 
		player.moveAlongLookDir();
	
	for (let i = 0; i < items.length; i++) {
		let distance = items[i].position().clone().sub(player.position()).length();
		console.log(distance);
		if (distance > 40)
			continue;

		let item = items[i].pick();
		player.weapon = item;
		items.splice(i, 1);
		i--;
	}
}

function render() {
	handleKeys();
	
	lookAtMouse();
	updateBlasts();
	updateTargets();
	
	requestAnimationFrame(render);     
	renderer.render(scene, camera);
}

function updateBlasts() {
	for (let i = 0; i < blasts.length; i++) {
		let obj = blasts[i];
		obj.moveAlongLookDir();
		
		if (obj.position().length > 1000) {
			scene.remove(obj.mesh);
			blasts.splice(i, 1);
			i--;
			continue;
		}
		
		let blast_deleted = false;
		for (let j = 0; j < targets.length; j++) {
			let target = targets[j];
			let dist = (target.position().clone().sub(obj.position().clone())).length();

			if (dist > 30)
				continue;

			scene.remove(target.mesh);
			targets.splice(j, 1);
			j--;
			score++;
			//spawnRate = Math.max(1, spawnRate - 3);
			if (blast_deleted)
				continue;
			
			scene.remove(obj.mesh);
			blasts.splice(i, 1);
			i--;
			blast_deleted = true;
		}
	}
}

function updateTargets() {
	for (let i = 0; i < targets.length; i++) {
		let target = targets[i];
		target.lookAt(player.position().x, player.position().y);
		target.moveAlongLookDir();
		
		let distance = player.position().clone().sub(target.position()).length();
		if (distance < 30 && player.hp != 0) {
			
			player.damage(1);
			if (player.hp == 0)
				player.speed = 3;
		}
		
		if (target.position().length > 1000) {
			scene.remove(target.mesh);
			targets.splice(i, 1);
			i--;
		}
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

function onDocumentKeyDown(event) {
	keyMap[event.code] = event.type == "keydown";
}

function onMouseMove(event) {
	mouse.x = event.clientX - window.innerWidth / 2;
	mouse.y = -event.clientY + window.innerHeight / 2;
}

function onMouseClick(event) {
	if (player.hp == 0)
		return;

	let bullets = player.fire();
	
	if (bullets == null)
		return;
	
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].addToScene(scene);
		blasts.push(bullets[i]);
	}
}

document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyDown, false);
document.addEventListener("mousemove", onMouseMove, false );
document.addEventListener("click", onMouseClick, false );

initTargets();
initWeapons();
render();
