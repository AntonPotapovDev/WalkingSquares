import * as GObject from './game.object.js';

let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(innerWidth / - 2, innerWidth / 2, innerHeight / 2, innerHeight / - 2, 1, 1000);
camera.position.z = 1;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.PlaneGeometry(50, 50);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
let square = new THREE.Mesh(geometry, material);

let player = new GObject.Unit();
player.mesh = square;
player.addToScene(scene);
player.lookAt(300, -150);

function render() {	
	requestAnimationFrame(render);     
	renderer.render(scene, camera);
}

render();