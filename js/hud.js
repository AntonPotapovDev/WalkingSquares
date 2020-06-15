import { TargetType } from './game.object.js';
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
		this._timeToNextWave = 0;
		this._showLeft = false;
		this._targetType = TargetType.NONE;
		this._pause = false;
	}
	
	update(player, waveController, control) {
		this._score = player.score;
		this._targetType = player.targetType();
		this._hp = this._targetType === TargetType.ALIVE ? player.hp : 0;
		this._drops = player.dropsCount();
		this._weaponName = player.weapon.name();	
		this._left = waveController.left();
		this._wave = waveController.currentWave() + 1;
		this._showLeft = waveController.isWaveActive();
		this._timeToNextWave = waveController.timeToNextWave();
		this._pause = control.isPause();
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
	
	timeToNextWave() {
		return this._timeToNextWave;
	}
	
	targetType() {
		return this._targetType;
	}

	isPause() {
		return this._pause;
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
		this._toNextWaveText = Text.toNextWaveText;
		this._restartText = Text.restartText;
		this._pauseText = Text.pauseText;
		this._score = null;
		this._hp = null;
		this._drops = null;
		this._weaponName = null;
		this._left = null;
		this._wave = null;
		this._timer = null;
		this._restart = null;
		this._version = null;
		this._pause = null;
		this._init();
		this._scoreValue = 0;
		this._hpValue = 0;
		this._dropsValue = 0;
		this._weaponNameValue = '';
		this._leftValue = 0;
		this._waveValue = 0;
		this._timeToNextValue = 0;
		this._showLeftValue = false;
		this._targetTypeValue = TargetType.NONE;
		this._timePassed = 0;
		this._pauseValue = false;
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
			Colors.stringColor(Colors.waveColor), 0, SystemValues.hudY);
		this._wave.moveToHCenter();
		this._timer = this._renderer.addText(this._toNextWaveText, this._hudFontSize,
			Colors.stringColor(Colors.waveColor), 0, SystemValues.hudY);
		this._timer.moveToHCenter();
		this._restart = this._renderer.addText('', this._hudFontSize * 2,
			Colors.stringColor(Colors.restartTextColor), 
			this._scene.sizes().width - SystemValues.hudX - SystemValues.hudRightOffset * 3, 
			this._scene.sizes().height - SystemValues.hudY - 100);
		this._version = this._renderer.addText(SystemValues.version, this._hudFontSize * 0.6,
			Colors.stringColor(Colors.waveColor),
			10, this._scene.sizes().height - this._hudFontSize * 0.6 - 10);
		this._pause = this._renderer.addText(this._pauseText, this._hudFontSize * 4,
			Colors.stringColor(Colors.waveColor), 0, this._scene.sizes().height / 2 * 0.8);
		this._pause.moveToHCenter();
		this._pause.hide();
		this.update();
	}
	
	update(fpsFactor, force = false) {
		this._timePassed += fpsFactor;
		if (this._timePassed < SystemValues.hudUpdateFreq && !force)
			return;
		
		this._timePassed = 0;
		
		let newScore = this._model.score();
		let newHp = this._model.hp();
		let newDrops = this._model.drops();
		let newWeapon = this._model.weaponName();
		let newLeft = this._model.left();
		let newShowLeft = this._model.showLeft();
		let newWave = this._model.currentWave();
		let newTimeLeft = this._model.timeToNextWave();
		let newTargetType = this._model.targetType();
		let newPause = this._model.isPause();
		
		if (newScore != this._scoreValue) {
			this._scoreValue = newScore;
			this._score.setText(this._scoreText + newScore);
		}
		if (newHp != this._hpValue) {
			this._hpValue = newHp;
			this._hp.setText(this._hpText + Math.floor(newHp));
			let restartText = newHp <= 0 && newTargetType !== TargetType.ALIVE ? this._restartText : '';
			this._restart.setText(restartText);
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
		if (newWave != this._timeToNextValue || newShowLeft != this._showLeftValue) {
			this._timeToNextValue = newTimeLeft;
			let text = !newShowLeft ? this._toNextWaveText + Math.ceil(newTimeLeft) : '';
			this._timer.setText(text);
		}
		if (newPause != this._pauseValue) {
			this._pauseValue = newPause;
			if (newPause) this._pause.show();
			else this._pause.hide();
		}
		this._showLeftValue = newShowLeft;
	}
}
