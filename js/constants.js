export class PhisicalValues {
	static playerSpeed  = 500;
	static playerRadius = 25;
	
	static defaultEnemyBaseSpeed   = 70;
	static defaultEnemySpeedFactor = 30;
	static defaultEnemyRadius      = 25;
	
	static fatEnemyBaseSpeed = 60;
	static fatEnemyRadius    = 30;
	
	static bulletSpeed  = 1700;
	static bulletRadius = 5;
	
	static spittleSpeed  = 800;
	static spittleRadius = 7.5;
	
	static spitterSpeed  = 150;
	static spitterRadius = 25;
	
	static itemRadius = 10;

	static pushAccFactor        = -5;
	static minPushLength        = 100;
	static knockBackSpeedFactor = 0.6;
}

export class HpValues {
	static playerHp       = 100;
	static deadPlayerHp   = 100;
	static defaultEnemyHP = 3;
	static fatEnemyHP     = 10;
	static spitterHP      = 2;
	static medkitHP       = 20;
	static meatHP         = 100;
}

export class DamageValues {
	static defaultEnemyDamage = 5;
	static fatEnemyDamage     = 10;
	static spitterDamage      = 3;

	static bulletDamage  = 1;
	static spittleDamage = 10;
}

export class WeaponCoolDown {
	static pistolCool  = 0.3;
	static shotgunCool = 0.6;
	static smgCool     = 0.1;
	static minigunCool = 0.04;
}

export class WeaponSpeedFactor {
	static pistolSpeedFactor  = 1;
	static shotgunSpeedFactor = 1;
	static smgSpeedFactor     = 0.7;
	static minigunSpeedFactor = 0.6;
}

export class WeaponAmmo {
	static pistolAmmo  = 100;
	static shotgunAmmo = 100;
	static smgAmmo     = 100;
	static minigunAmmo = 100;
}

export class TimeValues {
	static medkitLifetime   = 5;
	static spittingInterval = 1.6;
	static firstSpittleDelay = 1.5;

	static playerImmortalityTime = 0.7;
	static meatImmoralityTime    = 0.6;
}

export class SystemValues {
	static gameZoneRadiusOffset = 200;
	static gameZoneRadiusFactor = 0.8;

	static mainFont         = 'Impact';
	static hudFontSize      = 30;
	static hudX             = 50;
	static hudY             = 50;
	static hudElementsSpace = 5;
	static hudRightOffset   = 160;
	static hudUpdateFreq    = 0.25;

	static version = 'v 0.1.0';
}

export class KnockBackValues {
	static defaultEnemyKnockBack = 700;
	static fatEnemyKnockBack     = 900;
	static spitterKnockBack      = 500;

	static spittleKnockBack = 300;
	static bulletKnockBack  = 100;

	static pistolKnockBack  = 300;
	static shotgunKnockBack = 600;
	static smgKnockBack     = 200;
	static minigunKnockBack = 300;
}

export class Chances {
	static medkitSpawnChance = 0.5;
}

export class AIValues {
	static spittingDistance = Math.floor(innerHeight * 0.6);
}

export class Text {
	static scoreText       = 'Score: ';
	static healthText      = 'Health: ';
	static meatText        = 'Meat: ';
	static weaponNameText  = 'Weapon: ';
	static leftEnemiesText = 'Left: ';
	static currentWaveText = 'Wave ';
	static toNextWaveText  = 'Next wave in: ';
	static restartText     = 'Press R to restart';
	static pauseText       = 'Pause';

	static pistolName  = 'Pistol';
	static shotgunName = 'Shotgun';
	static smgName     = 'SMG';
	static minigunName = 'Minigun';
}
