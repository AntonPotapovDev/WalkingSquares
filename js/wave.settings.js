import * as Weapon from './weapon.js';

let waveSettings = [
	{
		enemyCount:   10,
		startTimeout: 5,
		spawnRate:    1,
		itemChance:   0.6,
		maxItems:     0,
		weapons:      []
	},
	{
		enemyCount:   20,
		startTimeout: 5,
		spawnRate:    0.9,
		itemChance:   0.6,
		maxItems:     1,
		weapons:      []
	},
	{
		enemyCount:   30,
		startTimeout: 5,
		spawnRate:    0.8,
		itemChance:   0.6,
		maxItems:     2,
		weapons:      []
	},
	{
		enemyCount:   50,
		startTimeout: 5,
		spawnRate:    0.7,
		itemChance:   0.6,
		maxItems:     3,
		weapons:      []
	},
	{
		enemyCount:   70,
		startTimeout: 5,
		spawnRate:    0.6,
		itemChance:   0.6,
		maxItems:     3,
		weapons:      [ ]
	},
	{
		enemyCount:   100,
		startTimeout: 5,
		spawnRate:    0.5,
		itemChance:   0.6,
		maxItems:     3,
		weapons:      [ new Weapon.Shotgun() ]
	},
	{
		enemyCount:   150,
		startTimeout: 5,
		spawnRate:    0.4,
		itemChance:   0.6,
		maxItems:     3,
		weapons:      []
	},
	{
		enemyCount:   200,
		startTimeout: 5,
		spawnRate:    0.3,
		itemChance:   0.6,
		maxItems:     5,
		weapons:      [ new Weapon.SubmachineGun() ]
	},
	{
		enemyCount:   300,
		startTimeout: 5,
		spawnRate:    0.25,
		itemChance:   0.6,
		maxItems:     10,
		weapons:      []
	},
	{
		enemyCount:   500,
		startTimeout: 5,
		spawnRate:    0.2,
		itemChance:   0.6,
		maxItems:     10,
		weapons:      [ new Weapon.Minigun() ]
	},
	{
		enemyCount:   700,
		startTimeout: 5,
		spawnRate:    0.15,
		itemChance:   0.6,
		maxItems:     10,
		weapons:      []
	},
	{
		enemyCount:   1000,
		startTimeout: 5,
		spawnRate:    0.1,
		itemChance:   0.6,
		maxItems:     15,
		weapons:      []
	}
];

export { waveSettings };
