export class PhisicalValues {
	static playerSpeed     = 500;
	static deadPlayerSpeed = 150;
	static playerRadius    = 25;
	
	static enemyBaseSpeed   = 100;
	static enemySpeedFactor = 150;
	static enemyRadius = 25;
	
	static bulletSpeed  = 1000;
	static bulletRadius = 5;
	
	static itemRadius = 10;
}

export class HpValues {
	static playerHp = 100;
	static enemyHP  = 1;
	static medkitHP = 20;
	static meatHP = 250;
}

export class DamageValues {
	static enemyDamage = 1;
	static bulletDamage = 10;
}

export class TimeValues {
	static baseEnemySpawnRate = 1000;
	static enemySpawnDecrease = 2;
	static minEnemySpawnRate  = 100;
	
	static nextWeaponSpawnTimeout = 2 * 60;
	static weaponSpawnTimeoutDecrease = 30;
	
	static itemSpawnTimeout = 15;
	static medkitLifetime = 5 * 1000;
}

export class SystemValues {
	static gameZoneRadiusOffset = 200;
	static gameZoneRadiusFactor = 0.8;
	static hudFontSize = 30;
	static hudX = 50;
	static hudY = 50;
	static hudElementsSpace = 5;
	static hudRightOffset = 160;
}

export class Chances {
	static itemSpawnChance = 0.6; 
}

export class Text {
	static mainFont    = 'cursive';
	static scoreText  = 'Score: ';
	static healthText = 'Health: ';
	static meatText   = 'Meat: ';
}
