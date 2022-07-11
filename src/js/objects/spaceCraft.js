"uses strict";
class SpaceCraft extends InertialObject {

    name = 'SpaceCraft';

    userData = {
        ...this.userData,
        shieldModel: modelManager.getSpacecraftShieldModel(),
        shootingInterval: TIMERS.SPACECRAFT.SHOOTING_INTERVAL,
        ableToFire: true,
        ammoType: 'missile',
        ammoSpeed: 4,
        timer: null,
        player: {
            name: 'id',
            currentLifes: 3,
            score: 0,
            activeJokers: [],
            invincibleModeOn: false,
            controls: {
                isForwardUp: false,
                isBackwardUp: false,
                isRotateRightUp: false,
                isRotateLeftUp: false,
                isShooting: false,
            },
        },
        blinking: new IntervalTimer(() => {

            this.visible = false;

            setTimeout(() => {

                this.visible = true;

                setTimeout(() => {}, TIMERS.INVINCIBILITY.BLINK_INTERVAL / 2);

            }, TIMERS.INVINCIBILITY.BLINK_INTERVAL / 2);
        }, TIMERS.INVINCIBILITY.BLINK_INTERVAL),
    };

    constructor(
        maxSpeed,
        decrementAmount,
        incrementAmount,
        rotateAmount
    ) {

        super(new THREE.Vector3(0, 0, 0), maxSpeed);

        this.userData.decrementAmount = decrementAmount;
        this.userData.incrementAmount = incrementAmount;
        this.userData.rotateAmount = rotateAmount;

        this.add(modelManager.getSpacecraftClone());

        this.userData.shieldModel.visible = false;
        this.add(this.userData.shieldModel);

        this.attachCannons();
        this.attachTrail();

        this.userData.trail = new SpacecraftTrail(this);

        this.initBoundingBox();

    }

    isActiveJoker(name) {
        return (this.userData.player.activeJokers.find(j => {
                return j.userData.selectedJoker.name === name
            }) !==
            undefined ? true : false)
    }

    attachTrail() {

        this.userData.trailPosition = new THREE.Object3D();
        this.userData.trailPosition.position.set(
            this.position.x,
            this.position.y - 15,
            this.position.z);

        this.add(this.userData.trailPosition);
    }

    attachCannons() {
        this.userData.rightCannon = new THREE.Object3D();
        this.userData.leftCannon = new THREE.Object3D();

        this.userData.leftCannon.position.set(
            this.position.x - 12.5,
            this.position.y,
            this.position.z);

        this.userData.rightCannon.position.set(
            this.position.x + 12.5,
            this.position.y,
            this.position.z);

        this.add(this.userData.leftCannon);
        this.add(this.userData.rightCannon);

    }

    canShoot() {

        this.userData.shootingInterval = this.isActiveJoker('Faster shooting') ?
            (TIMERS.SPACECRAFT.SHOOTING_INTERVAL / 2) :
            TIMERS.SPACECRAFT.SHOOTING_INTERVAL

        if (this.userData.ableToFire) {

            this.userData.ableToFire = false;

            setTimeout(() => {

                this.userData.ableToFire = true;

            }, this.userData.shootingInterval);

            return true;

        }
    }

    updateState() {

        super.updateState();

        let position = new THREE.Vector3();
        this.userData.trailPosition.getWorldPosition(position)
        this.userData.trail.update(position, this.rotation, this.userData.player.controls.isForwardUp);

        if (this.userData.player.controls.isForwardUp)
            this.accelerate();
        if (this.userData.player.controls.isBackwardUp)
            this.decelerate();
        if (this.userData.player.controls.isRotateLeftUp)
            this.rotateLeft();
        if (this.userData.player.controls.isRotateRightUp)
            this.rotateRight();

        if (this.userData.player.controls.isShooting && this.canShoot()) 
            this.shootAmmo();

    }


    setInvincibleAndBlink(TIME) {

        this.userData.player.invincibleModeOn = true;
        this.userData.shieldModel.visible = true;

        this.userData.blinking.start()

        this.userData.timer = new Timer(() => {

            this.userData.blinking.clear()
            this.userData.timer = null;
            this.userData.player.invincibleModeOn = false;
            this.userData.shieldModel.visible = false;
        }, TIME)
    }

    setJokerActiveDurationTimer(joker) {

        joker.userData.timer = new Timer(() => {
            this.userData.player.activeJokers = this.userData.player.activeJokers.filter(j => {
                return joker.uuid != j.uuid
            });
        }, joker.userData.selectedJoker.effectDuration);

    }

    addActiveJoker(joker) {

        this.setJokerActiveDurationTimer(joker);

        this.userData.player.activeJokers.push(joker);

    }

    rotateRight() {

        this.rotation.z -= this.userData.rotateAmount;

    }

    rotateLeft() {

        this.rotation.z += this.userData.rotateAmount;

    }

    shootAmmo() {

        let rightCannonWorldPos = new THREE.Vector3(),
            leftCannonWorldPos = new THREE.Vector3();

        this.userData.rightCannon.getWorldPosition(rightCannonWorldPos);
        this.userData.leftCannon.getWorldPosition(leftCannonWorldPos);

        this.userData.ammoType = this.isActiveJoker('Plasma grenade') ?
            'Plasma grenade' : 'missile';

        let speedVec = new THREE.Vector3(-2 * Math.sin(this.rotation.z), 2 * Math.cos(this.rotation.z), 0).setLength(this.userData.ammoSpeed);

        switch (this.userData.ammoType) {

            case 'missile':
                game.scene.add(new Missile(
                    speedVec,
                    rightCannonWorldPos,
                    this.rotation,
                    80,
                    false));
                game.scene.add(new Missile(
                    speedVec,
                    leftCannonWorldPos,
                    this.rotation,
                    80,
                    false));
                game.soundsManager.missileLaunchSound.play();
                break;

            case 'Plasma grenade':
                game.scene.add(new PlasmaGrenade(
                    speedVec,
                    rightCannonWorldPos,
                    this.rotation,
                    80,
                    false));
                game.scene.add(new PlasmaGrenade(
                    speedVec,
                    leftCannonWorldPos,
                    this.rotation,
                    80,
                    false));
                    game.soundsManager.plasmaGrenadeLaunchSound.play();
                break;

            default:
                break;
        }


    }

    restoreHP() {

        this.userData.player.currentLifes = 3

    }

    repositionAndGainHP() {

        this.position.set(0, 0, 0);

        this.rotation.set(0, 0, 0);

        this.userData.speed.set(0, 0, 0);

        this.restoreHP();

    }

}