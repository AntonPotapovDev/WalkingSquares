export class Colors {
	static bulletColor = 0xfff000;
	static enemyColor  = 0x7db08b;
	static playerColor = 0x4ea3f2;
	static deadPlayerColor = 0xf54542;
	static weaponBoxColor  = 0x40160b;
}

function makeMesh(width, height, color) {
	let geometry = new THREE.PlaneGeometry(width, height);
	let material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
	return new THREE.Mesh(geometry, material);
}

export class Meshes {
	static playerMesh = makeMesh(50, 50, Colors.playerColor);
	static enemyMesh  = makeMesh(50, 50, Colors.enemyColor);
	static bulletMesh = makeMesh(5, 10, Colors.bulletColor);
	static weaponBoxMesh = makeMesh(20, 20, Colors.weaponBoxColor);
}