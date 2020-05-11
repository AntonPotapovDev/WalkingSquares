export class GameScene {
	constructor(width, height) {
		this._scene = new THREE.Scene();
		this._camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
		this._camera.position.z = 1;
		this._renderer = new THREE.WebGLRenderer();
		this._renderer.setSize(width, height);
		this._sizes = { width: width, height: height };
		this._objects = [];
	}
	
	domElement() {
		return this._renderer.domElement;
	}
	
	add(obj) {
		this._scene.add(obj.mesh);
		this._objects.push(obj);
	}
	
	remove(obj) {
		this._scene.remove(obj.mesh);
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
	
	update() {
		for (let i = 0; i < this._objects.length; i++) {
			let object = this._objects[i];
			if (!object.isNeedToRemove())
				continue;
			
			this.remove(object);
			this._objects.splice(i, 1);
			i--;
		}
	}
}
