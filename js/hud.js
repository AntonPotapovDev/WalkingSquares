import { SystemValues, Text } from './constants.js';
import { Colors } from './visual.js';

export class HudModel {
	constructor() {
		this._score = 0;
		this._hp = 0;
		this._drops = 0;
		this._weaponName = '';
		this._left = 0
		this._wave = 0
		this._showLeft = false;
	}
	
	update(score, hp, drops, weaponName, waveController) {
		this._score = score;
		this._hp = hp;
		this._drops = drops;
		this._weaponName = weaponName;
		this._left = waveController.left();
		this._wave = waveController.currentWave() + 1;
		this._showLeft = waveController.isWaveActive();
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
	
	weaponName() {
		return this._weaponName;
	}
	
	left() {
		return this._left;
	}
	
	currentWave() {
		return this._wave;
	}
	
	showLeft() {
		return this._showLeft;
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
		this._weaponNameText = Text.weaponNameText;
		this._leftText = Text.leftEnemiesText;
		this._waveText = Text.currentWaveText;
		this._score = null;
		this._hp = null;
		this._drops = null;
		this._weaponName = null;
		this._left = null;
		this._wave = null;
		this._init();
		this._scoreValue = 0;
		this._hpValue = 0;
		this._dropsValue = 0;
		this._weaponNameValue = '';
		this._leftValue = 0;
		this._waveValue = 0;
		this._showLeftValue = false;
		this._timePassed = 0;
	}
	
	_init() {
		this._score = this._renderer.addText(this._scoreText, this._hudFontSize, 
			Colors.stringColor(Colors.defaultEnemyColor), 
			SystemValues.hudX, 
			SystemValues.hudY);
		this._weaponName = this._renderer.addText(this._weaponNameText, this._hudFontSize,
			Colors.stringColor(Colors.weaponBoxColor),
			SystemValues.hudX,
			SystemValues.hudY + this._hudFontSize + SystemValues.hudElementsSpace);
		this._hp = this._renderer.addText(this._hpText, this._hudFontSize, 
			Colors.stringColor(Colors.medkitColor), 
			this._scene.sizes().width - SystemValues.hudX - SystemValues.hudRightOffset, 
			SystemValues.hudY);
		this._drops = this._renderer.addText(this._dropsText, this._hudFontSize, 
			Colors.stringColor(Colors.meatColor), 
			this._scene.sizes().width - SystemValues.hudX - SystemValues.hudRightOffset, 
			SystemValues.hudY + this._hudFontSize + SystemValues.hudElementsSpace);
		this._left = this._renderer.addText(this._leftText, this._hudFontSize,
			Colors.stringColor(Colors.waveColor), 
			SystemValues.hudX,
			SystemValues.hudY + this._hudFontSize * 2 + SystemValues.hudElementsSpace * 2);
		this._wave = this._renderer.addText(this._waveText, this._hudFontSize,
			Colors.stringColor(Colors.waveColor), 
			SystemValues.hudX + this._scene.sizes().width / 2 - 100,
			SystemValues.hudY);
		this.update();
	}
	
	update(fpsFactor) {
		this._timePassed += fpsFactor;
		if (this._timePassed < SystemValues.hudUpdateFreq)
			return;
		
		this._timePassed = 0;
		
		let newScore = this._model.score();
		let newHp = this._model.hp();
		let newDrops = this._model.drops();
		let newWeapon = this._model.weaponName();
		let newLeft = this._model.left();
		let newShowLeft = this._model.showLeft();
		let newWave = this._model.currentWave();
		
		if (newScore != this._scoreValue) {
			this._scoreValue = newScore;
			this._score.setText(this._scoreText + newScore);
		}
		if (newHp != this._hpValue) {
			this._hpValue = newHp;
			this._hp.setText(this._hpText + Math.floor(newHp));
		}
		if (newDrops != this._dropsValue) {
			this._dropsValue = newDrops;
			this._drops.setText(this._dropsText + newDrops);
		}
		if (newWeapon != this._weaponNameValue) {
			this._weaponNameValue = newWeapon;
			this._weaponName.setText(this._weaponNameText + newWeapon);
		}
		if (newLeft != this._leftValue || newShowLeft != this._showLeftValue) {
			this._leftValue = newLeft;
			let text = newShowLeft ? this._leftText + newLeft : '';
			this._left.setText(text);
		}
		if (newWave != this._waveValue || newShowLeft != this._showLeftValue) {
			this._waveValue = newWave;
			let text = newShowLeft ? this._waveText + newWave : '';
			this._wave.setText(text);
		}
		this._showLeftValue = newShowLeft;
	}
}
