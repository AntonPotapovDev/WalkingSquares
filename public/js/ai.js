export class AiInfo {
	constructor(targets) {
		this._targetUnits = targets;
	}
	
	closestTarget(from) {
		let minDist = Infinity;
		let closestTarget = null;
		for (let target of this._targetUnits) {
			let dist = target.distanceTo(from);
			if (dist < minDist && target.hp != 0) {
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
		this._agent = null;
	}
	
	update() {
	}
	
	setAgent(agent) {
		this._agent = agent;
	}
}

export class EnemyAI extends AI {
	constructor(aiInfo) {
		super(aiInfo);
		this._currentTarget = null;
	}
	
	update() {
		if (this._agent === null)
			return;
		
		let target = this._aiInfo.closestTarget(this._agent);
		if (target !== null) {
			this._currentTarget = target;
			this._agent.lookAt(target.position());
		}
		else if (this._currentTarget !== null) {
			this._currentTarget = null;
			this._agent.rotate(Math.random() * Math.PI * 2);
		}
		
		this._agent.moveAlongLookDir();
		if (this._currentTarget !== null)
			this._agent.interactWithPlayer(this._currentTarget);
	}
}
