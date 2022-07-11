class PlasmaGrenade extends InertialObject {

    name = "PlasmaGrenade";

    userData = {
        ...this.userData,
        damageRatio: 20,
        ttl: 100,
        isEnemyMissile: false,
    }


    constructor(speed, initialPos, initialRot, ttl, isEnemyMissile, maxSpeed) {

        super(speed, maxSpeed);

        this.add(modelManager.getPlasmaGrenadeClone());

        this.scale.set(.3, .3, .3);

        this.position.copy(initialPos);
        this.rotation.copy(initialRot);

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