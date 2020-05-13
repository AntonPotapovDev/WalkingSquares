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
		this._scoreText = 'Score: ';
		this._hpText = 'Health: ';
		this._dropsText = 'Meat: '
		this._score = null;
		this._hp = null;
		this._drops = null;
		this._init();
	}
	
	_init() {
		this._renderer.setFont('cursive');
		this._renderer.setSize(20);
		this._score = this._renderer.addText(this._scoreText, '#ffc800', 50, 50);
		this._hp = this._renderer.addText(this._hpText, '#f20000', this._scene.sizes().width - 150, 50);
		this._drops = this._renderer.addText(this._dropsText, '#ba5656', this._scene.sizes().width - 150, 75);
		this.update();
	}
	
	update() {
		this._score.setText(this._scoreText + this._model.score());
		this._hp.setText(this._hpText + this._model.hp());
		this._drops.setText(this._dropsText + this._model.drops());
	}
}
