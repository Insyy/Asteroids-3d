class InertialObject extends THREE.Object3D {

    userData = {
        updatable: true,
    }

    constructor(speed, maxSpeed) {

        super();

        this.userData.speed = speed;
        this.userData.maxSpeed = maxSpeed;

    }


    keepSelfInWorld() {
        if (this instanceof Missile || this instanceof PlasmaGrenade) return;
        if (this.position.x + game.world_w / 2 > game.world_w) {

            this.position.x -= game.world_w;

        } else if (this.position.x + game.world_w / 2 < 0) {

            this.position.x += game.world_w;

        }
        if (this.position.y + game.world_h / 2 > game.world_h) {

            this.position.y -= game.world_h;

        } else if (this.position.y + game.world_h / 2 < 0) {

            this.position.y += game.world_h;

        }
    }

    removeSelfFromScene(ignoreScore) {

        if ((this instanceof Asteroid || this instanceof EnemySpacecraft) && ignoreScore != true)
            game.addScorePoints(this);

        this.visible = false;

        game.remainingObjects = game.remainingObjects.filter(o => {
            return o.uuid !== this.uuid
        });

        removeObject3D(this);
        removeObject3D(this.userData.box3);

        if (game.settings.debugModeOn)
            removeObject3D(this.userData.boxHelper);

    }

    initBoundingBox() {

        this.userData.box3 = new THREE.Box3();

    }

    rotateOnAxes(x, y, z) {

        this.rotation.x = (this.rotation.x + Math.PI / 180 * x) % (2 * Math.PI);
        this.rotation.y = (this.rotation.y + Math.PI / 180 * y) % (2 * Math.PI);
        this.rotation.z = (this.rotation.z + Math.PI / 180 * z) % (2 * Math.PI);
    }

    translateOnAxes() {

        if (this.userData.speed == null)
            return;
        this.position.x += this.userData.speed.x;
        this.position.y += this.userData.speed.y;
        this.position.z += this.userData.speed.z;
    }

    preserveMaxSpeed() {
        if (this.userData.speed == null ||
            !typeof this.userData.speed === undefined)
            return;
        if (this.userData.speed.length() > this.userData.maxSpeed)
            this.userData.speed.setLength(this.userData.maxSpeed);

    }

    setDebugHelper(){
        if (game.settings.debugModeOn) {
            if (this.userData.boxHelper == undefined){
                this.userData.boxHelper = new THREE.Box3Helper(this.userData.box3, 0xffff00);
                game.scene.add(this.userData.boxHelper);
            }
        } else {
            if (this.userData.boxHelper != undefined)
                game.scene.remove(this.userData.boxHelper);
            else this.userData.boxHelper = undefined;
        }
    }

    updateState() {

        this.userData.box3.setFromObject(this, true);

        this.setDebugHelper();

        this.preserveMaxSpeed();
        this.translateOnAxes();
        this.keepSelfInWorld();

    }

    accelerate() {
        this.userData.speed.x -= 0.05 * Math.sin(this.rotation.z);
        this.userData.speed.y += 0.05 * Math.cos(this.rotation.z);
    }

    decelerate() {
        this.userData.speed.x += 0.05 * Math.sin(this.rotation.z);
        this.userData.speed.y -= 0.05 * Math.cos(this.rotation.z);
    }


    setValidSpawnPosition() {
        var pos_x, pos_y;
        do {

            pos_x = (Math.random() * game.world_w) - (game.world_w / 2);
            pos_y = (Math.random() * game.world_h) - (game.world_h / 2);

        } while (!isValidSpawnPosition(pos_x, pos_y));

        this.position.set(pos_x, pos_y, 0)

    }
}

function isValidSpawnPosition(x, y) {

    let spaceCraftMaxPos = new THREE.Vector3(),
        spaceCraftMinPos = new THREE.Vector3();

    spaceCraftMaxPos = game.spacecraft.userData.box3.max;
    spaceCraftMinPos = game.spacecraft.userData.box3.min;

    return ((x >= spaceCraftMaxPos.x || x <= spaceCraftMinPos.x) &&
        (y >= spaceCraftMaxPos.y || y <= spaceCraftMinPos.y))
}
