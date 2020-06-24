export class Colors {
	static bulletColor = 0xffffff;
	static defaultEnemyColor = 0x7db08b;
	static fatEnemyColor = 0x4db068;
	static playerColor = 0x4ea3f2;
	static deadPlayerColor = 0xf54542;
	static weaponBoxColor  = 0xe07122;
	static medkitColor = 0xe31b1b;
	static meatColor = 0xba5656;
	static backgroundColor = 0x303030;
	static waveColor = 0xededed;
	static restartTextColor = 0x9c1c1c;
	static spittleColor = 0x69ff2e;
	static spitterColor = 0xf7a54d;
	
	static stringColor(color) {
		return '#' + color.toString(16);
	}
}

export class Meshes {
	static playerMesh() { return makeMesh(50, 50, Colors.playerColor, Textures.playerTexture, 1); }
	static defaultEnemyMesh()  { return makeMesh(50, 50, Colors.defaultEnemyColor, null, 2); }
	static fatEnemyMesh()  { return makeMesh(55, 55, Colors.fatEnemyColor, null, 2); }
	static bulletMesh() { return makeMesh(5, 10, Colors.bulletColor, null); }
	static weaponBoxMesh() { return makeMesh(20, 20, Colors.weaponBoxColor, null); }
	static medkitMesh() { return makeMesh(20, 20, Colors.medkitColor, null); }
	static meatMesh() { return makeMesh(20, 20, Colors.meatColor, null); }
	static spittleMesh() { return makeMesh(15, 15, Colors.spittleColor, null); }
	static spitterMesh() { return makeMesh(50, 50, Colors.spitterColor, null, 2); }
}

export class Textures {
	static playerTexture = { src: null };
}

let textureMap = [
	//{ url: '../textures/', link: Textures.playerTexture }
];

export class TextureLoader {
	constructor() {
		this._loader = new THREE.TextureLoader();
	}
	
	loadTextures(callback) {
		if (textureMap.length == 0) {
			callback();
			return;
		}
		this._load(0, callback);
	}

	_load(index, finalCallback) {
		let node = textureMap[index];
		this._loader.load(node.url, texture => {
				node.link.src = texture;
				if (index + 1 < textureMap.length)
					this._load(index + 1, finalCallback);
				else
					finalCallback();
			},
		undefined, err => {
				console.log('Unable to load texture:', url);
			}
		);
	}
}

function makeMesh(width, height, color, texture, zIndex = 0) {
	let material = null;
	if (texture != null && texture.src != null) material = { map: texture.src, side: THREE.DoubleSide };
	else material = { color: color, side: THREE.DoubleSide };
	
	let mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(width, height),
		new THREE.MeshBasicMaterial(material));
	mesh.renderOrder = zIndex;
	
	return mesh;
}
