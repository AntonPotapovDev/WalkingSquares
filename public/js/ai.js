export class AiInfo {
	constructor(targets) {
		this._targetUnits = targets;
	}
	
	closestTarget(position) {
		let minDist = infinity;
		let closestTarget = null;
		for (let target of this._targetUnits) {
			let dist = target.distanceTo(position);
			if (dist < minDist) {
				minDist = dist;
				closestTarget = target;
			}
		}
		return closestTarget;
	}
	
	hasTargets() {
		for (target of this._targetUnits)
			if (target.hp != 0)
				return true;
		
		return false;
	}
	
	update(targets) {
		this._targetUnits.length = 0;
		this._targetUnits = targets;
	}
}

export class AI {
	constructor(aiInfo) {
		this._aiInfo = aiInfo;
	}
	
	update() {
	}
}

export class EnemyAI extends AI {
	constructor(aiInfo) {
		super(aiInfo, agent);
		this._agent = agent;
		this._currentTarget = null;
	}
	
	update() {
		let target = this._aiInfo.closestTarget(this._agent.position());
		if (target !== null) {
			this._currentTarget = target;
			this._agent.lookAt(target.position());
		}
		else if (this._currentTarget !== null) {
			this._currentTarget = null;
			let lookDir = new THREE.Vector3(0, 1, 0);
			lookDir.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.random() * Math.PI * 2);
			this._agent.setLookDirection(lookDir);
		}
		this._agent.moveAlongLookDir();
	}
}
