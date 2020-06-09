import { Chances } from './constants.js';

export class ChanceController {
	constructor() {
		this._player = null;
		this.itemSpawnChance = Chances.itemSpawnChance;
		this.medkitSpawnChance = Chances.medkitSpawnChance;
	}
	
	update (delta) {
		if (player.hp == player.maxHp) {
			medkit = 0;
		}
		else if (player.hp > player.maxHp / 2) {
			medkit = Chances.medkitSpawnChance;
		}
		else {
			medkit = Chances.medkitSpawnChance 
					+ (1 - Chances.medkitSpawnChance) * ((player.maxHp - player.hp) / player.maxHp);
		}
		
		this.medkitSpawnChance = medkit;
	}
	
	setPlayer(player) {
		this._player = player;
	}
}