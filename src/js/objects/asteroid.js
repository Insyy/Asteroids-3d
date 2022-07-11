class Asteroid extends InertialObject {

    name = "Asteroid";

    userData = {
        ...this.userData,
        sizeScale: 0.02,
        health: 0,
        healthFactor: 1000,
    };

    constructor(speed, maxSpeed, childNumber) {

        super(speed, maxSpeed);

        this.add(modelManager.getAsteroidClone());

        this.setRandomProperties();

        this.userData.health = this.userData.sizeScale *
            this.userData.divisionsLeft *
            this.userData.healthFactor;

        this.userData.childNumber = childNumber;

        this.initBoundingBox();


    }

    setSize() {

        this.scale.set(
            this.userData.divisionsLeft * this.userData.sizeScale,
            this.userData.divisionsLeft * this.userData.sizeScale,
            this.userData.divisionsLeft * this.userData.sizeScale
        );

    }

    destroySelfAndSpawnChildren() {

        game.soundsManager.destructionSound.play();

        this.removeSelfFromScene();

        if (this.userData.divisionsLeft > 1) {

            for (let childNumber = 0; childNumber < this.userData.childNumber; childNumber++) {

                let clonedAsteroid = new Asteroid(new THREE.Vector3(0, 0, 0), .999, this.userData.childNumber);

                clonedAsteroid.setPropertiesFromParent(this, childNumber);

                game.scene.add(clonedAsteroid);

                game.remainingObjects.push(clonedAsteroid);
            }
        }
    }

    setRandomProperties() {

        //set random division count between 3 and 5
        this.userData.divisionsLeft = Math.round(Math.random() * 2) + 1;
        //set size according to divisions left
        this.setSize();

        this.setValidSpawnPosition();
        //set randomly generated rotation
        let randomRotation = Math.random() * 2;
        this.userData.rotation = new THREE.Vector3(Math.random(), Math.random(), Math.random());

        let speedVec = new THREE.Vector3(-2 * Math.sin(randomRotation), 2 * Math.cos(randomRotation), 0);

        this.userData.speed = speedVec.normalize();
    }

    setPropertiesFromParent(parent, childNumber) {

        //set rotation
        let rotationZ = 0;
        childNumber == 1 ? (rotationZ = Math.PI / 2) : (rotationZ = -Math.PI / 2);
        this.rotation.z = parent.rotation.z += rotationZ;

        const parentSpeed = parent.userData.speed;
        let newSpeed = new THREE.Vector3();

        switch (childNumber) {
            case 0:
                newSpeed.set(parentSpeed.x, parentSpeed.y, parentSpeed.z);
                break;
            case 1:
                parentSpeed.copy(newSpeed);
                break;
            case 2:
                newSpeed.set(parentSpeed.x, parentSpeed.y, parentSpeed.z);
                break;

            default:
                break;
        }

        newSpeed.copy(this.userData.speed);

        //this.rotation.z *= (Math.random() * .4) + .8

        this.userData.rotation = parent.userData.rotation.multiplyScalar(.8);

        //decrease divisions left and set according size
        this.userData.divisionsLeft = parent.userData.divisionsLeft - 1;
        this.setSize();

        //set position
        this.position.set(parent.position.x, parent.position.y, parent.position.z);
        this.position.z -= this.userData.sizeScale * this.userData.divisionsLeft * 40;
    }

    updateState() {

        super.updateState();

        this.rotateOnAxes(this.userData.rotation.x, this.userData.rotation.y, this.userData.rotation.z);

        if (this.userData.health < 0) {

            game.scene.add(new Explosion(explosionTypes.destruction, this.position));

            this.destroySelfAndSpawnChildren();
        }


    }
}