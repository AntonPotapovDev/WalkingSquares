export class Control {
	constructor(zoneWidth, zoneHeight) {
		this._width = zoneWidth;
		this._height = zoneHeight;
		this._mouse = new THREE.Vector3(0, 0, 0);
		this._moveVector = new THREE.Vector3(0, 0, 0);
		this._keyMap = {};
		this._isMouseDown = false;
		this._mouseClickCount = 0;
		this._dropCount = 0;
		this._singlePress = [ "Space", "KeyR", "Escape" ];
		this._needToRestart = false;
		this._pause = false;
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
	
	isMouseDown() {
		return this._isMouseDown;
	}

	isPause() {
		return this._pause;
	}
	
	drops() {
		return this._dropCount;
	}
	
	needToRestart() {
		return this._needToRestart;
	}
	
	restartHandled() {
		this._needToRestart = false;
	}
	
	update() {
		this._moveVector = new THREE.Vector3(0, 0, 0);
		for (let key in this._keyMap) {
			let value = this._keyMap[key];
			
			if (!value)
				continue;
			
			if (!this._pause) {
				if (key == "KeyW") this._moveVector.y = 1;
				if (key == "KeyS") this._moveVector.y = -1;
				if (key == "KeyA") this._moveVector.x = -1;
				if (key == "KeyD") this._moveVector.x = 1;
				if (key == "Space") this._dropCount++;
				if (key == "KeyR") this._needToRestart = true;
			}

			if (key == "Escape") this._pause = !this._pause;
			
			if (this._singlePress.includes(key))
				this._keyMap[key] = false;
		}
	}
	
	onKeyDown(event) {
		let isSinglePress = this._singlePress.includes(event.code);
		if (isSinglePress) this._keyMap[event.code] = event.type == "keyup";
		else this._keyMap[event.code] = event.type == "keydown";
	}
	
	onMouseMove(event) {
		if (this._pause)
			return;

		this._mouse.x = event.clientX - this._width / 2;
		this._mouse.y = -event.clientY + this._height / 2;
	}
	
	onMouseDown(event) {
		if (this._pause)
			return;

		this._isMouseDown = event.type == "mousedown";
	}

	onTabChanged(event) {
		if (document.visibilityState == 'hidden')
			this._pause = true;
	}
	
	onMouseClick(event) {
		if (this._pause) {
			this._pause = false;
			return;
		}

		this._mouseClickCount++;
	}
	
	mouseClicksHandled() {
		this._mouseClickCount = 0;
	}
	
	dropsHandled() {
		this._dropCount = 0;
	}
}
