import { Chances } from './constants.js';

export class ChanceController {
	constructor() {
		this._player = null;
		this.itemSpawnChance = Chances.itemSpawnChance;
		this.medkitSpawnChance = Chances.medkitSpawnChance;
	}
	
	update (delta) {
		let medkit = 0;
		
		if (this._player.hp == this._player.maxHp) {
			medkit = 0;
		}
		else if (this._player.hp > this._player.maxHp / 2) {
			medkit = Chances.medkitSpawnChance;
		}
		else {
			medkit = Chances.medkitSpawnChance 
					+ (1 - Chances.medkitSpawnChance) * ((this._player.maxHp - this._player.hp) / this._player.maxHp);
		}
		
		this.medkitSpawnChance = medkit;
	}
	
	setPlayer(player) {
		this._player = player;
	}
}