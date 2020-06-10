export class PhisicalValues {
	static playerSpeed     = 500;
	static deadPlayerSpeed = 150;
	static playerRadius    = 25;
	
	static defaultEnemyBaseSpeed   = 100;
	static defaultEnemySpeedFactor = 150;
	static defaultEnemyRadius = 25;
	
	static fatEnemyBaseSpeed  = 70;
	static fatEnemyRadius = 27.5;
	
	static bulletSpeed  = 1700;
	static bulletRadius = 5;
	
	static spittleSpeed = 1000;
	static spittleRadius = 7.5;
	
	static spitterSpeed = 200;
	static spitterRadius = 25;
	
	static itemRadius = 10;
}

export class HpValues {
	static playerHp = 100;
	static defaultEnemyHP = 1;
	static fatEnemyHP = 3;
	static medkitHP = 20;
	static meatHP = 250;
	static spitterHP = 1;
}

export class DamageValues {
	static defaultEnemyDamage = 50;
	static fatEnemyDamage = 80;
	static bulletDamage = 1;
	static spittleDamage = 10;
	static spitterDamage = 15;
}

export class WeaponCoolDown {
	static pistolCool  = 0.3;
	static shotgunCool = 0.6;
	static submachineGunCool = 0.1;
	static minigunCool = 0.04;
}

export class WeaponAmmo {
	static pistolAmmo = 100;
	static shotgunAmmo = 100;
	static submachineGunAmmo = 100;
	static minigunAmmo = 100;
}

export class TimeValues {
	static itemSpawnTimeout = 15;
	static medkitLifetime = 5;
	static spittingInterval = 1.2;
}

export class SystemValues {
	static gameZoneRadiusOffset = 200;
	static gameZoneRadiusFactor = 0.8;
	static hudFontSize = 30;
	static hudX = 50;
	static hudY = 50;
	static hudElementsSpace = 5;
	static hudRightOffset = 160;
	static hudUpdateFreq = 0.25;
}

export class Chances {
	static itemSpawnChance = 0.6;
	static medkitSpawnChance = 0.5;
	static fatEnemySpawnChance = 0.1;
	static spitterSpawnChance = 0.1;
}

export class AIValues {
	static spittingDistance = Math.floor(innerHeight * 0.6);
}

export class Text {
	static mainFont    = 'Impact';
	static scoreText  = 'Score: ';
	static healthText = 'Health: ';
	static meatText   = 'Meat: ';
	static weaponNameText = 'Weapon: ';
	static leftEnemiesText = 'Left: ';
	static currentWaveText = 'Wave ';
	static toNextWaveText = 'Next wave in: ';
	static restartText = 'Press R to restart';
	static pistolName = 'Pistol';
	static shotgunName = 'Shotgun';
	static submachineGunName = 'SMG';
	static minigunName = 'Minigun';
}
