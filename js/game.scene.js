import * as Constants from './constants.js';
import { Colors } from './visual.js';

export class GameScene {
	constructor(width, height) {
		this._scene = new THREE.Scene();
		this._scene.background = new THREE.Color(Colors.backgroundColor);
		this._camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
		this._camera.position.z = 1;
		this._renderer = new THREE.WebGLRenderer({ antialias: true });
		this._renderer.setSize(width, height);
		this._sizes = { width: width, height: height };
		this._gameZoneRadius = Math.max(width, height)
			+ Constants.SystemValues.gameZoneRadiusOffset;
		this._objects = [];
	}
	
	clear() {
		for (let obj of this._objects)
			this.remove(obj);
		
		this._objects.length = 0;
	}
	
	domElement() {
		return this._renderer.domElement;
	}
	
	gameZoneRadius() {
		return this._gameZoneRadius;
	}
	
	add(obj) {
		this._scene.add(obj.mesh);
		this._objects.push(obj);
	}
	
	remove(obj) {
		this._scene.remove(obj.mesh);
	}
	
	objects() {
		return this._objects;
	}
	
	sizes() {
		return this._sizes;
	}
	
	renderer() {
		let rendererObj = { render: (() => {
			this._renderer.render(this._scene, this._camera);
		}).bind(this)};
		return rendererObj;
	}
	
	isOffscreen(object) {
		let {x, y} = object.position();
		let {width, height} = this._sizes;
		let isAbove = y > height / 2;
		let isBelow = y < -height / 2;
		let left = x < -width / 2;
		let right = x > width / 2;
		return isAbove || isBelow || left || right;
	}
	
	update() {
		for (let i = 0; i < this._objects.length; i++) {
			let object = this._objects[i];
			
			if (object.position().length() > this._gameZoneRadius)
				object.remove();
			
			if (!object.isNeedToRemove())
				continue;
			
			this.remove(object);
			this._objects.splice(i, 1);
			i--;
		}
	}
}
