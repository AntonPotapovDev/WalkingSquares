export class PhisicalValues {
	static playerSpeed     = 10;
	static deadPlayerSpeed = 3;
	
	static enemyBaseSpeed   = 2;
	static enemySpeedFactor = 3;
	
	static bulletSpeed = 20;
}

export class HpValues {
	static playerHp = 100;
	static enemyHP  = 1;
}

export class DamageValues {
	static enemyDamage = 1;
}

export class TimeValues {
	static baseEnemySpawnRate = 1000;
	static enemySpawnDecrease = 2;
	static minEnemySpawnRate  = 100;
	
	static nextWeaponSpawnTimeout = 2 * 60 * 1000;
}