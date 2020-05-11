export class PhisicalValues {
	static playerSpeed     = 10;
	static deadPlayerSpeed = 3;
	static playerRadius    = 25;
	
	static enemyBaseSpeed   = 2;
	static enemySpeedFactor = 3;
	static enemyRadius = 25;
	
	static bulletSpeed  = 20;
	static bulletRadius = 5;
	
	static itemRadius = 10;
}

export class HpValues {
	static playerHp = 100;
	static enemyHP  = 1;
	static medkitHP = 20;
}

export class DamageValues {
	static enemyDamage = 1;
	static bulletDamage = 10;
}

export class TimeValues {
	static baseEnemySpawnRate = 1000;
	static enemySpawnDecrease = 2;
	static minEnemySpawnRate  = 100;
	
	static nextWeaponSpawnTimeout = 2 * 60 * 1000;
	static weaponSpawnTimeoutDecrease = 30 * 1000;
	
	static medkitSpawnTimeout = 3 * 60 * 1000;
	static medkitSpawnTimeoutDecrease = 30 * 1000;
}

export class SystemValues {
	static gameZoneRadiusOffset = 200;
	static gameZoneRadiusFactor = 0.8;
}