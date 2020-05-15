export class TextObject {	
	moveTo(vec) {
	}
	
	setText(text) {
	}
	
	text() {
	}
}

export class DomTextObject extends TextObject {
	constructor(font, size, color, text) {
		super();
		this._dom = document.createElement('div');
		this._dom.style.position = 'absolute';
		this._dom.style.top = '100px';
		this._dom.style.left = '100px';
		this._dom.style.zIndex = '100';
		this._dom.style.userSelect = 'None';
		this._dom.style.fontSmooth = '4em';
		this._dom.style.fontFamily = font;
		this._dom.style.color = color;
		this._dom.style.fontSize = size.toString() + 'px';
		this._dom.innerHTML = text;
	}
	
	moveTo(vec) {
		this._dom.style.left = vec.x.toString() + 'px';
		this._dom.style.top = vec.y.toString() + 'px';
	}
	
	setText(text) {
		this._dom.innerHTML = text;
	}
	
	text() {
		return this._dom.innerHTML;
	}
	
	dom() {
		return this._dom;
	}
}

export class TextRendererBase {
	addText(text, size, color, x, y) {
	}
	
	setFont(font) {
	}
	
	update() {
	}
}

export class DomTextRenderer extends TextRendererBase {
	constructor() {
		super();
		this._textObjects = [];
		this._defaultFont = null;
	}
	
	addText(text, size, color, x, y) {
		let textObj = new DomTextObject(this._defaultFont, size, color, text);
		textObj.moveTo({x: x, y: y});
		this._textObjects.push(textObj);
		document.body.appendChild(textObj.dom());
		return textObj;
	}
	
	setFont(font) {
		this._defaultFont = font;
	}
	
	update() {
	}
}
