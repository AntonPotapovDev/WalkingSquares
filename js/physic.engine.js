export class PhysicEngine {
    constructor(gameScene) {
        this._gameScene = gameScene;
    }

    update(fpsFactor) {
    }

    process(movableObject) {
        let movement = movableObject.movement();
        let newPos = this._calcNewPosition(movableObject.position(), movement);

        if (!movableObject.offscreenAllowed() && this._gameScene.isDotOffscreen(newPos)) {
            let outBorders = this._gameScene.outBorders(newPos);
            if (outBorders.left || outBorders.right) movement.x = 0;
            if (outBorders.isAbove || outBorders.isBelow) movement.y = 0;
            movableObject.applyMovement();
        }
        else {
            movableObject.applyMovement();
        }
    }

    _calcNewPosition(pos, movement) {
        return {x: pos.x + movement.x, y: pos.y + movement.y}
    }
}