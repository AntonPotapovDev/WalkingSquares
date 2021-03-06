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
		this._lines = [];
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

	lines() {
		if (this._lines.length == 0) {
			this._lines.push({ a:  1, b: 0, c: this._sizes.width / 2});
			this._lines.push({ a: -1, b: 0, c: this._sizes.width / 2 });
			this._lines.push({ a: 0, b:  1, c: this._sizes.height / 2});
			this._lines.push({ a: 0, b: -1, c: this._sizes.height / 2});
		}

		return this._lines;
	}
	
	renderer() {
		let rendererObj = { render: (() => {
			this._renderer.render(this._scene, this._camera);
		}).bind(this)};
		return rendererObj;
	}
	
	isOffscreen(object) {
		let res = this.isDotOffscreen(object.position());
		object.setIsOffscreen(res); 
		return res;
	}

	isDotOffscreen(vec) {
		let {x, y} = vec;
		let {width, height} = this._sizes;
		let isAbove = y > height / 2;
		let isBelow = y < -height / 2;
		let left = x < -width / 2;
		let right = x > width / 2;
		return isAbove || isBelow || left || right;
	}

	outBorders(vec) {
		let {x, y} = vec;
		let {width, height} = this._sizes;
		let res = {
			isAbove: y > height / 2,
			isBelow: y < -height / 2,
			left: x < -width / 2,
			right: x > width / 2
		};
		return res;
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
