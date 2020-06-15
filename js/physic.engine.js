export class PhysicEngine {
    constructor(gameScene) {
        this._gameScene = gameScene;
    }

    update(fpsFactor) {
    }

    process(movableObject) {
        let movement = movableObject.movement();
        let newPos = this._calcNewPosition(movableObject.position(), movement);

        if (!movableObject.offscreenAllowed()) {
            let intersections = this._checkScreenBorderCollision(newPos, movableObject);
            for (let line of intersections) {
                movement.x *= Math.abs(line.b);
                movement.y *= Math.abs(line.a);
            }
        }

        movableObject.applyMovement();
    }

    _checkScreenBorderCollision(newPosition, obj) {
        let x = newPosition.x;
        let y = newPosition.y;
        let intersections = [];
        for (let line of this._gameScene.lines()) {
            let distance = Math.abs(line.a * x + line.b * y + line.c)
                / Math.sqrt(line.a * line.a + line.b * line.b);
            if (distance <= obj.radius())
                intersections.push(line);
        }
        
        return intersections;
    }

    _calcNewPosition(pos, movement) {
        return {x: pos.x + movement.x, y: pos.y + movement.y}
    }
}
