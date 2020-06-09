import * as Weapon from './weapon.js';

let waveSettings = [
	{
		enemyCount:   10,
		startTimeout: 5,
		spawnRate:    1,
		maxItems:     5,
		weapons:      [ new Weapon.Shotgun() ]
	}
];

export { waveSettings };
