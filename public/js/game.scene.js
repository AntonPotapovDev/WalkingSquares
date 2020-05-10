export class GameScene {
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