class EnemySpacecraft extends InertialObject {
    name = 'EnemySpacecraft';

    userData = {
        ...this.userData,
        health: 200,
        shootingInterval: 2000,
        ableToFire: true,
        ammoType: 'missile',
        bulletSpeed: 4,
    };

    constructor() {

        super(null, 1, null);

        this.add(modelManager.getEnemySpacecraftClone());

        this.attachCannons();

        this.setValidSpawnPosition();

        this.initBoundingBox();


    }

    attachCannons() {

        this.userData.cannon = new THREE.Object3D();

        this.userData.cannon.position.set(
            this.position.x,
            this.position.y + 16,
            this.position.z);

        this.add(this.userData.cannon);

    }

    canShoot() {

        if (this.userData.ableToFire) {

            this.userData.ableToFire = false;

            setTimeout(() => {

                this.userData.ableToFire = true;

            }, this.userData.shootingInterval);

            return true;

        }
    }

    shootAmmo() {

        let cannonWorldPos = new THREE.Vector3()

        this.userData.cannon.getWorldPosition(cannonWorldPos);

        let speedVec = new THREE.Vector3(-2 * Math.sin( this.rotation.z ), 2 * Math.cos( this.rotation.z ), 0 );

        game.scene.add(new Missile(speedVec, cannonWorldPos, this.rotation, 75, true));

    }

    lookAtAndFixRotation() {

        this.lookAt(game.spacecraft.position);

        this.rotateX(Math.PI / 2);
        this.rotateY(Math.PI / 2);

    }

    randomlyTranslate() {

        let trans_x, trans_y, distance;

        trans_x = Math.random();
        trans_y = Math.random();

        distance = Math.random() * .5;


        this.translateOnAxis(new THREE.Vector3(trans_x, trans_y, 0), distance)

    }

    updateState() {

        if (this.userData.health < 0) {

            game.soundsManager.destructionSound.play();

            game.scene.add(new Explosion(explosionTypes.destruction, this.position));

            this.removeSelfFromScene();

        }

        super.updateState();

        this.randomlyTranslate();

        this.lookAtAndFixRotation();

        if (this.canShoot()) {

            switch (this.userData.ammoType) {
                case 'missile':
                    this.shootAmmo();
                    break;

                default:
                    break;
            }

        }
    }
}