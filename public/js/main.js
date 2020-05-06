import * as GObject from '/js/game.object.js'

class Player extends GObject.Unit {
	constructor() {
		super();
		this.speed = 10;
		this.hp = 100;
		
		let geometry = new THREE.PlaneGeometry(50, 50);
		let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
	}
	
	damage(dp) {
		super.damage(dp);
		square.material.color.add(new THREE.Color(0.01 * dp, -0.01 * dp, 0));
	}
}

let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(innerWidth / - 2, innerWidth / 2, innerHeight / 2, innerHeight / - 2, 1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.PlaneGeometry(50, 50);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
let square = new THREE.Mesh(geometry, material);
let defaultDir = new THREE.Vector3(0, 1, 0);
defaultDir.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.random() * 2 * Math.PI);
let hp = 100;

let mouse = new THREE.Vector3(0, 0, 0);

scene.add(square);
camera.position.z = 1;

let score = 0;

let speed = 10;
let spawnRate = 1000;

function move(speed, vector) {
	square.position.x += speed * vector.x;
	square.position.y += speed * vector.y;
}

function lookAtMouse() {
	if (hp <= 0)
		return;

	let temp_mouse = new THREE.Vector3();
	temp_mouse.copy(mouse);
	let vec = temp_mouse.sub(square.position);
	let factor = vec.x < 0 ? 1 : -1;
	square.rotation.z = factor * vec.angleTo(new THREE.Vector3(0, 1, 0));
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
	
	//if (moveVector.x == 0 && moveVector.y == 0)
		//return;

	moveVector.normalize();
	if (hp > 0)
		move(speed, moveVector);
	else 
		move(3, defaultDir);
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
		obj.mesh.position.add(obj.vec);
		
		if (obj.mesh.position.length > 1000) {
			blasts.splice(i, 1);
			i--;
			continue;
		}
		
		let blast_deleted = false;
		for (let j = 0; j < targets.length; j++) {
			let target = targets[j];
			let dist = (target.position.clone().sub(obj.mesh.position.clone())).length();

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
		let direction = square.position.clone().sub(target.position).normalize();
		
		let factor = hp > 0 ? 1 : -1;
		
		target.position.add(direction.multiplyScalar(factor * 3));
		
		let distance = square.position.clone().sub(target.position).length();
		if (distance < 30 && hp > 0) {
			square.material.color.add(new THREE.Color(0.01, -0.01, 0));
			hp--;
			
			if (hp == 0) {
				square.material.color.copy(new THREE.Color(1,1,1));
				targets.push(square);
			}
		}
		
		if (target.position.length > 1000) {
			targets.splice(i, 1);
			i--;
		}
	}
}

function initTargets() {
	if (hp == 0)
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
	if (hp == 0)
		return;

	let angle = -0.1;
	//for (let i = 0; i < 3; i++) {
		let geometry = new THREE.PlaneGeometry(5, 10);
		let material = new THREE.MeshBasicMaterial({ color: 0xfff000, side: THREE.DoubleSide });
		let blast = new THREE.Mesh(geometry, material);
		blast.position.copy(square.position);
		blast.position.z = -0.1;
		blast.rotation.copy(square.rotation);
		scene.add(blast);
		
		let dir_vector = new THREE.Vector3();
		dir_vector.copy(mouse);
		dir_vector.sub(square.position);
		dir_vector.normalize();
		dir_vector.multiplyScalar(20);
		//dir_vector.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
		angle += 0.1;
		
		let blast_obj = {
			mesh: blast,
			vec: dir_vector
		};
		
		blasts.push(blast_obj);
	//}
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