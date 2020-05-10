export class Control {
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
