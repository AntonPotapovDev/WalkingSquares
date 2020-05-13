import { SystemValues, Text } from './constants.js';
import { Colors } from './visual.js';

export class HudModel {
	constructor() {
		this._score = 0;
		this._hp = 0;
		this._drops = 0;
	}
	
	update(score, hp, drops) {
		this._score = score;
		this._hp = hp;
		this._drops = drops;
	}
	
	score() {
		return this._score;
	}
	
	hp() {
		return this._hp;
	}
	
	drops() {
		return this._drops;
	}
}

export class Hud {
	constructor(textRenderer, gameScene, model) {
		this._renderer = textRenderer;
		this._scene = gameScene;
		this._model = model;
		this._hudFontSize = SystemValues.hudFontSize;
		this._scoreText = Text.scoreText;
		this._hpText = Text.healthText;
		this._dropsText = Text.meatText;
		this._score = null;
		this._hp = null;
		this._drops = null;
		this._init();
	}
	
	_init() {
		this._score = this._renderer.addText(this._scoreText, this._hudFontSize, 
			Colors.stringColor(Colors.enemyColor), 
			SystemValues.hudX, 
			SystemValues.hudY);
		this._hp = this._renderer.addText(this._hpText, this._hudFontSize, 
			Colors.stringColor(Colors.medkitColor), 
			this._scene.sizes().width - SystemValues.hudX - SystemValues.hudRightOffset, 
			SystemValues.hudY);
		this._drops = this._renderer.addText(this._dropsText, this._hudFontSize, 
			Colors.stringColor(Colors.meatColor), 
			this._scene.sizes().width - SystemValues.hudX - SystemValues.hudRightOffset, 
			SystemValues.hudY + this._hudFontSize + SystemValues.hudElementsSpace);
		this.update();
	}
	
	update() {
		this._score.setText(this._scoreText + this._model.score());
		this._hp.setText(this._hpText + this._model.hp());
		this._drops.setText(this._dropsText + this._model.drops());
	}
}
