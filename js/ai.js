import { TargetType } from './game.object.js';
import { TimeValues, AIValues } from './constants.js';

export class AiInfo {
	constructor(gameScene) {
		this._targetUnits = gameScene.objects();
	}
	
	closestTarget(from) {
		let minDist = Infinity;
		let closestTarget = null;
		for (let target of this._targetUnits) {
			let dist = target.distanceTo(from);
			if (target.targetType() != TargetType.NONE && dist < minDist) {
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
	
	update(fpsFactor) {
	}
	
	setAgent(agent) {
		this._agent = agent;
	}
}

export class DefaultEnemyAI extends AI {
	constructor(aiInfo) {
		super(aiInfo);
		this._currentTarget = null;
	}
	
	update(fpsFactor) {
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
			this._agent.interactWithTarget(this._currentTarget);
	}
}

export class SpitterAI extends AI {
	constructor(aiInfo) {
		super(aiInfo);
		this._currentTarget = null;
		this._timePassed = 0;
	}
	
	update(fpsFactor) {
		if (this._agent === null)
			return;
		
		this._timePassed += fpsFactor;
		
		let target = this._aiInfo.closestTarget(this._agent);
		if (target !== null) {
			let targetType = target.targetType();
			this._agent.lookAt(target.position());
			if (targetType == TargetType.FAKE) {
				this._agent.interactWithTarget(target);
			}
			else if (targetType == TargetType.ALIVE) {
				if (this.distanceTo(target) > AIValues.spittingDistance)
					this._agent.moveAlongLookDir();
				else if (this._timePassed >= TimeValues.spittingInterval) {
					this._agent.rangeAttack();
					this._timePassed = 0;
				}
			}
		}
		else if (this._currentTarget !== null) {
			this._agent.rotate(Math.random() * Math.PI * 2);
		}
		else {
			this._agent.moveAlongLookDir();
		}
		
		this._currentTarget = target;
	}
}
