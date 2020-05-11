export class Colors {
	static bulletColor = 0xfff000;
	static enemyColor  = 0x7db08b;
	static playerColor = 0x4ea3f2;
	static deadPlayerColor = 0xf54542;
	static weaponBoxColor  = 0xe07122;
	static medkitColor = 0xf20000;
}

function makeMesh(width, height, color) {
	let geometry = new THREE.PlaneGeometry(width, height);
	let material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
	return new THREE.Mesh(geometry, material);
}

export class Meshes {
	static playerMesh() { return makeMesh(50, 50, Colors.playerColor); }
	static enemyMesh()  { return makeMesh(50, 50, Colors.enemyColor); }
	static bulletMesh() { return makeMesh(5, 10, Colors.bulletColor); }
	static weaponBoxMesh() { return makeMesh(20, 20, Colors.weaponBoxColor); }
	static medkitMesh() { return makeMesh(20, 20, Colors.medkitColor); }
}
