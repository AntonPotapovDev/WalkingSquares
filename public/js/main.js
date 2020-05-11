import { Game } from '/js/game.js';
import { Control } from '/js/control.js';
import { GameScene } from '/js/game.scene.js';
import * as Spawners from '/js/spawners.js';

function main() {
	let control = new Control(innerWidth, innerHeight);
	document.addEventListener("keydown", control.onKeyDown.bind(control), false);
	document.addEventListener("keyup", control.onKeyDown.bind(control), false);
	document.addEventListener("mousemove", control.onMouseMove.bind(control), false );
	document.addEventListener("click", control.onMouseClick.bind(control), false );
	document.addEventListener("keypress", control.onKeyDown.bind(control), false);
	
	let gameScene = new GameScene(innerWidth, innerHeight);
	document.body.appendChild(gameScene.domElement());
	
	let enemySpawner = new Spawners.EnemySpawner(gameScene);
	let itemSpawner = new Spawners.ItemSpawner(gameScene);
	
	let game = new Game(gameScene, control, enemySpawner, itemSpawner);
	game.start();
}

main();
