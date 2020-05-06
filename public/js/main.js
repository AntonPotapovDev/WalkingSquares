import * as GObject from '/js/game.object.js'

class Player extends GObject.Unit {
	constructor() {
		super();
		this.speed = 10;
		this.hp = 100;
		
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
		let bullet = new Bullet(this.position().x, this.position().y, this.lookDirection().x, this.lookDirection().y);
		return bullet;
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
}

let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(innerWidth / - 2, innerWidth / 2, innerHeight / 2, innerHeight / - 2, 1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let player = new Player();
player.addToScene(scene);

let mouse = new THREE.Vector3(0, 0, 0);

camera.position.z = 1;

let score = 0;
let spawnRate = 1000;

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
			let dist = (target.position.clone().sub(obj.position().clone())).length();

			if (dist > 30)
				continue;

			scene.remove(target);
			targets.splice(j, 1);
			j--;
			score++;
			
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
		let direction = player.position().clone().sub(target.position).normalize();
		
		let factor = player.hp > 0 ? 1 : -1;
		
		target.position.add(direction.multiplyScalar(factor * 3));
		
		let distance = player.position().clone().sub(target.position).length();
		if (distance < 30) {
			
			player.damage(1);
			if (player.hp == 0)
				player.speed = 3;
		}
		
		if (target.position.length > 1000) {
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
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
		let target = new THREE.Mesh(geometry, material);
		scene.add(target);
		targets.push(target);
		target.position.copy(position);
		
		if (spawnRate > 100)
			spawnRate -= 5;
		
		initTargets();
	}, spawnRate);
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

	let bullet = player.fire();
	bullet.addToScene(scene);
	
	blasts.push(bullet);
}

let keyMap = {};
let blasts = [];
let targets = [];

document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyDown, false);
document.addEventListener("mousemove", onMouseMove, false );
document.addEventListener("click", onMouseClick, false );

initTargets();
render();