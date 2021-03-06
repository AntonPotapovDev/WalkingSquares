import { Game } from './game.js';
import { Control } from './control.js';
import { GameScene } from './game.scene.js';
import * as Spawners from './spawners.js';
import * as TextRenderer from './text.renderer.js'
import { SystemValues } from './constants.js';
import { TextureLoader } from './visual.js';

function main() {
	let control = new Control(innerWidth, innerHeight);
	document.addEventListener("keydown", control.onKeyDown.bind(control), false);
	document.addEventListener("keyup", control.onKeyDown.bind(control), false);
	document.addEventListener("mousemove", control.onMouseMove.bind(control), false );
	document.addEventListener("click", control.onMouseClick.bind(control), false );
	document.addEventListener("mousedown", control.onMouseDown.bind(control), false );
	document.addEventListener("mouseup", control.onMouseDown.bind(control), false );
	document.addEventListener('visibilitychange', control.onTabChanged.bind(control), false);
	
	let gameScene = new GameScene(innerWidth, innerHeight);
	document.body.appendChild(gameScene.domElement());
	
	let textRenderer = new TextRenderer.DomTextRenderer();
	textRenderer.setFont(SystemValues.mainFont);
	
	let enemySpawner = new Spawners.EnemySpawner(gameScene);
	let itemSpawner = new Spawners.ItemSpawner(gameScene);
	
	let game = new Game(gameScene, control, textRenderer, enemySpawner, itemSpawner);
	
	let textureLoader = new TextureLoader();
	textureLoader.loadTextures(game.start.bind(game));
}

main();
