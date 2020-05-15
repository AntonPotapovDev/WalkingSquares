export class Colors {
	static bulletColor = 0xffc800;
	static enemyColor  = 0x7db08b;
	static playerColor = 0x4ea3f2;
	static deadPlayerColor = 0xf54542;
	static weaponBoxColor  = 0xe07122;
	static medkitColor = 0xf20000;
	static meatColor = 0xba5656;
	
	static stringColor(color) {
		return '#' + color.toString(16);
	}
}

function makeMesh(width, height, color, zIndex = 0) {
	let mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(width, height),
		new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide}));
	mesh.renderOrder = zIndex;
	return mesh;
}

export class Meshes {
	static playerMesh() { return makeMesh(50, 50, Colors.playerColor, 1); }
	static defaultEnemyMesh()  { return makeMesh(50, 50, Colors.enemyColor, 2); }
	static fatEnemyMesh()  { return makeMesh(80, 80, Colors.enemyColor, 2); }
	static bulletMesh() { return makeMesh(5, 10, Colors.bulletColor); }
	static weaponBoxMesh() { return makeMesh(20, 20, Colors.weaponBoxColor); }
	static medkitMesh() { return makeMesh(20, 20, Colors.medkitColor); }
	static meatMesh() { return makeMesh(20, 20, Colors.meatColor); }
}
