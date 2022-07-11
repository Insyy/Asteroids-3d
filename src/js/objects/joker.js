const jokerTypes = [{
        name: 'Invincibility',
        fileName: 'invincibility.png',
        effectDuration: 10000,
        description: 'Gain invincibility'
    },
    {
        name: 'Plasma grenade',
        fileName: 'big-weapon.png',
        effectDuration: 5000,
        description: 'Replace weapon in use by plasma grenades'
    },
    {
        name: 'Restore health',
        fileName: 'health.png',
        description: 'Restore player health to intitial amount'
    },
    {
        name: 'Faster shooting',
        fileName: 'faster-shooting.png',
        effectDuration: 5000,
        description: 'Shoots faster'
    },
    {
        name: 'Double points',
        fileName: 'double-points.png',
        effectDuration: 7500,
        description: 'Double points gained'
    }
]

Array.prototype.getUniqueJokers = function () {
    let uniqueJokers = [];

    this.forEach(
        j => {
            if (uniqueJokers.findIndex(fj =>
                    j.userData.selectedJoker.name ===
                    fj.userData.selectedJoker.name) == -1)
                uniqueJokers.push(j);
        })
    return uniqueJokers;
}

class Joker extends InertialObject {

    userData = {
        ...this.userData,
        selectedJoker: undefined,
        /* timeLeft, */
        timer: null,
        blinking: new IntervalTimer(() => {

            this.visible = false;

            setTimeout(() => {

                this.visible = true;

                setTimeout(() => {}, this.getBlinkInterval());

            }, this.getBlinkInterval());

        })
    }


    constructor(choice) {

        super(new THREE.Vector3(0, 0, 0), 0, 0);

        if (choice === 0)
            this.pickRandomJoker();
        else
            this.pickChosenJoker(choice);



        this.setValidSpawnPosition()

        this.add(modelManager.getJokerSprite(this.userData.selectedJoker.name));

        this.scale.set(25, 25, 25)

        super.initBoundingBox();

        this.userData.timer = new Timer(() => {

            this.removeSelfFromScene()
        }, TIMERS.JOKERS.EXISTING_TIME)
    }


    getBlinkInterval() {
        return 300
    }


    addAndApplyJoker(spacecraft) {

        game.soundsManager.jokerPickup.play();

        const joker = this.userData.selectedJoker;

        switch (joker.name) {
            case 'Invincibility':
                spacecraft.addActiveJoker(this);
                spacecraft.setInvincibleAndBlink(this.userData.selectedJoker.effectDuration);
                break;
            case 'Restore health':
                spacecraft.restoreHP();
                break;
            case 'Faster shooting':
                spacecraft.addActiveJoker(this);
                break;
            case 'Double points':
                spacecraft.addActiveJoker(this);
                break;
            case 'Plasma grenade':
                spacecraft.addActiveJoker(this);
                break;
            default:
                break;
        }
    }

    pickChosenJoker(choice) {

        this.userData.selectedJoker = jokerTypes.find(j => {
            return j.name === choice
        });

    }

    pickRandomJoker() {

        let randomIndex = Math.floor(Math.random() * jokerTypes.length);
        this.userData.selectedJoker = jokerTypes[randomIndex];
    }

}