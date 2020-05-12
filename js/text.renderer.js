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
		this._dom = document.createElement('div');
		this._dom.style.position = 'absolute';
		this._dom.style.top = '100px';
		this._dom.style.left = '100px';
		this._dom.style.zIndex = '100';
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
	addText(text, color, x, y) {
	}
	
	setFont(font) {
	}
	
	setSize(size) {
	}
	
	update() {
	}
}

export class DomTextRenderer extends TextRendererBase {
	constructor() {
		this._textObjects = [];
		this._defaultFont = null;
		this._defaultSize = null;
	}
	
	addText(text, color, x, y) {
		let text = new DomTextObject(this._defaultFont, this._defaultSize, color, text);
		text.moveTo(x, y);
		this._textObjects.push(text);
		document.body.appendChild(text.dom());
	}
	
	setFont(font) {
		this._defaultFont = font;
	}
	
	setSize(size) {
		this._defaultSize = size.toString() + 'px';
	}
	
	update() {
	}
}