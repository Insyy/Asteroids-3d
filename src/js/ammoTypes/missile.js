class Missile extends InertialObject {

    name = "Missile";

    userData = {
        ...this.userData,
        damageRatio: 8,
        ttl: 100,
        isEnemyMissile: false,
    }


    constructor(speed, initialPos, initialRot, ttl, isEnemyMissile, maxSpeed) {

        super(speed, maxSpeed);

        

        this.scale.set(.5, .5, .5);

        this.position.copy(initialPos);
        this.rotation.copy(initialRot);

        this.add(modelManager.getMissileClone());

        this.initBoundingBox();

        this.userData.ttl = ttl;
        this.userData.isEnemyMissile = isEnemyMissile;
    }

    damageAsteroid(asteroid) {

        game.soundsManager.impactSound.play();

        game.scene.add(new Explosion(explosionTypes.hit, this.position));

        this.removeSelfFromScene();

        asteroid.userData.health -= this.userData.speed.length() * this.userData.damageRatio;

    }

    isEnemy() {

        return this.userData.isEnemyMissile;

    }

    damageEnemySpacecraft(enemy) {

        game.soundsManager.impactSound.play();

        game.scene.add(new Explosion(explosionTypes.hit, this.position));

        this.removeSelfFromScene();

        enemy.userData.health -= this.userData.speed.length() * this.userData.damageRatio;

    }

    updateState() {

        super.updateState();

        if (this.userData.ttl < 1) this.removeSelfFromScene();
        this.userData.ttl--;

    }
}