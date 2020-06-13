import * as Weapon from './weapon.js';
import * as Enemy from './enemy.js';

const waveSettings = [
	{// Wave 1
		enemyCount:   10,
		startTimeout: 5,
		spawnRate:    1,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     0,
		weapons:      [],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 1
			}
		]
	},
	{// Wave 2
		enemyCount:   20,
		startTimeout: 5,
		spawnRate:    0.9,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     1,
		weapons:      [],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.9
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			}
		]
	},
	{// Wave 3
		enemyCount:   30,
		startTimeout: 5,
		spawnRate:    0.8,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     2,
		weapons:      [],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
		
	},
	{// Wave 4
		enemyCount:   50,
		startTimeout: 5,
		spawnRate:    0.7,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     3,
		weapons:      [],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
	},
	{// Wave 5
		enemyCount:   70,
		startTimeout: 5,
		spawnRate:    0.6,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     3,
		weapons:      [ ],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
	},
	{// Wave 6
		enemyCount:   100,
		startTimeout: 5,
		spawnRate:    0.5,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     3,
		weapons:      [ new Weapon.Shotgun() ],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
	},
	{// Wave 7
		enemyCount:   150,
		startTimeout: 5,
		spawnRate:    0.4,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     3,
		weapons:      [],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
	},
	{// Wave 8
		enemyCount:   200,
		startTimeout: 5,
		spawnRate:    0.3,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     5,
		weapons:      [ new Weapon.SubmachineGun() ],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
	},
	{// Wave 9
		enemyCount:   300,
		startTimeout: 5,
		spawnRate:    0.25,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     10,
		weapons:      [],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
	},
	{// Wave 10
		enemyCount:   500,
		startTimeout: 5,
		spawnRate:    0.2,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     10,
		weapons:      [ new Weapon.Minigun() ],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
	},
	{// Wave 11
		enemyCount:   700,
		startTimeout: 5,
		spawnRate:    0.15,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     10,
		weapons:      [],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
	},
	{// Wave 12
		enemyCount:   1000,
		startTimeout: 5,
		spawnRate:    0.1,
		itemInterval: 15,
		itemChance:   0.6,
		maxItems:     15,
		weapons:      [],
		enemies:
		[
			{
				factory: Enemy.makeDefault,
				chance: 0.8
			},
			{
				factory: Enemy.makeFat,
				chance: 0.1
			},
			{
				factory: Enemy.makeSpitter,
				chance: 0.1
			}
		]
	}
];

export { waveSettings };
