let game, modelManager, uiManager;

window.addEventListener('load', () => {
    modelManager = new ModelManager();

});



function createGame() {

    window.addEventListener('resize', resize);
    window.addEventListener("keydown", onWindowKeyDown, false);
    window.addEventListener("keyup", onWindowKeyUp, false);

    game = new Game(modelManager);
    uiManager.updateLayout();

}

class Game {

    paused = false;
    over = true;
    frozen = false;

    cameraMode = 0;

    availableLevels = levels;

    currentLevelIndex = 0;

    currentJokerIndex = 0;

    remainingObjects = [];

    initialLifesCount = 3;

    settings = {
        helpToggledOn: false,
        fullScreenOn: false,
        soundOn: true,
        debugModeOn: false,
        selectedMode: 'qwerty',
        bloomOn: false,
    };

    bloomParams = {
        exposure: .5,
        bloomStrength: .5,
        bloomThreshold: 0,
        bloomRadius: .5
    };

    spacecraft;
    last_spacecraft_position = new THREE.Vector3();

    container;
    w;
    h;

    horizontal_fov;
    world_h;
    world_w;

    scene;
    camera;
    camera_offset = new THREE.Vector3(0, 0, 200);
    controls;

    renderer;
    bloomPass;
    composer;
    bloomRenderScene;
    stats;

    fps = 60;
    slow = 1;
    renderConfig = {
        antialias: true,
        //alpha: true,
        preserveDrawingBuffer: true
    };

    directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    ambientLight = new THREE.AmbientLight(0x404040, 4);

    modelManager;
    soundsManager = new SoundsManager();
    collisionsManager = new CollisionsManager();
    jokerManager = null;

    screenshotLocation;

    loop = {};

    constructor(modelManager) {

        this.scene = new THREE.Scene();

        this.modelManager = modelManager;

        this.container = document.querySelector('#AsteroidGame');
        this.w = this.container.clientWidth;
        this.h = this.container.clientHeight;


        this.camera = new THREE.PerspectiveCamera(75, this.w / this.h, 1, 10000);
        this.camera.position.copy(this.camera_offset);

        this.controls = new THREE.TrackballControls(this.camera, this.container);
        this.controls.target = new THREE.Vector3(0, 0, 0.75);
        this.controls.panSpeed = 0.4;

        this.renderer = new THREE.WebGLRenderer(this.renderConfig);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.w, this.h);
        this.renderer.domElement.id = 'canvas';
        //renderer.physicallyCorrectLights = true;
        this.container.appendChild(this.renderer.domElement);

        // add Stats.js - https://github.com/mrdoob/stats.js
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.bottom = '0px';
        document.body.appendChild(this.stats.domElement);

        //time management
        this.loop.dt = 0;
        this.loop.now = window.performance.now();
        this.loop.last = this.loop.now;
        this.loop.fps = this.fps;
        this.loop.step = 1 / this.loop.fps;
        this.loop.slow = this.slow;
        this.loop.slowStep = this.loop.slow * this.loop.step;


        this.bloomRenderScene = new THREE.RenderPass(this.scene, this.camera);

        this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        this.bloomPass.threshold = this.bloomParams.bloomThreshold;
        this.bloomPass.strength = this.bloomParams.bloomStrength;
        this.bloomPass.radius = this.bloomParams.bloomRadius;

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(this.bloomRenderScene);
        this.composer.addPass(this.bloomPass);

        this.updateWorldSize();

        this.initMenu();
    }

    initMenu() {

        if (uiManager == undefined)
            uiManager = new UImanager(document.body);
        else uiManager.updateLayout();

        this.soundsManager.menuMusic.play();

        uiManager.toggleFullMenuDisplay();
        if (document.getElementById("help").style.display == 'none')
            uiManager.toggleKeysHelpDisplay();

        this.setupWorld();
    }

    setupWorld() {

        this.scene.add(this.directionalLight);
        this.scene.add(this.ambientLight);

        this.scene.background = modelManager.getSpaceTexture();

        this.renderer.render(this.scene, this.camera);

    }

    startGame = (() => {

        this.spacecraft = new SpaceCraft(2, .1, .1, .075);

        this.scene.add(this.spacecraft);

        this.over = false;
        this.currentLevelIndex = 0;

        this.setupCurrentLevel();

        this.gameLoop();
    })

    prepareNewLevel() {

        this.remainingObjects.forEach(o => {
            if (o instanceof InertialObject)
                o.removeSelfFromScene();
        })

        this.scene.children.forEach(c => {
            if (c instanceof Joker || c instanceof Missile || c instanceof PlasmaGrenade)
                c.removeSelfFromScene()
        })

        this.soundsManager.clearAllMusic();

        this.spacecraft.repositionAndGainHP()

    }

    setupCurrentLevel() {

        const {
            levelNumber,
            asteroidCount,
            asteroidChildCount,
            enemySpacecraftsCount,
            jokerInterval,
        } =
        this.availableLevels[this.currentLevelIndex];

        this.prepareNewLevel();

        this.soundsManager.levelsMusic[this.currentLevelIndex].play()

        uiManager.showNextLevelText(levelNumber);

        if (this.jokerManager != null)
            this.jokerManager.clearTimer();

        this.jokerManager = new JokerManager(jokerInterval);
        this.jokerManager.startGeneration();

        this.frozen = true;

        uiManager.updateLayout();

        setTimeout(() => {
            this.frozen = false;
        }, 3000);

        this.addAsteroids(asteroidCount, asteroidChildCount);

        this.addEnemySpacecrafts(enemySpacecraftsCount);

    }



    setCameraMode(number) {
        switch (number) {

            case 0:

                if (this.cameraMode !== 0)
                    this.cameraMode = 0;
                break;

            case 1:

                if (this.cameraMode !== 1)
                    this.cameraMode = 1;
                break;
            case 2:

                if (this.cameraMode !== 2)
                    this.cameraMode = 2;
                this.spacecraft.position.set(0, 0, 0)
                break;
            default:
                break;
        }
    }






    gameLoop = (() => {
        this.loop.now = window.performance.now();
        this.loop.dt = this.loop.dt + Math.min(1, (this.loop.now - this.loop.last) / 1000);
        while (this.loop.dt > this.loop.slowStep) {
            this.loop.dt = this.loop.dt - this.loop.slowStep;

            if (!this.paused &&
                !this.over &&
                !this.frozen)
                this.update(this.loop.step); // déplace les objets d'une fraction de seconde
        }
        if (this.settings.bloomOn) {
            this.composer.render();
        } else this.renderer.render(this.scene, this.camera);
        // rendu de la scène
        this.loop.last = this.loop.now;

        requestAnimationFrame(this.gameLoop); // relance la boucle du jeu

        this.controls.update();
        this.stats.update();
    })

    update() {

        if (this.remainingObjects.length === 0) {

            this.soundsManager.levelCompleted.play();

            this.currentLevelIndex += 1;

            if (this.currentLevelIndex == this.availableLevels.length) {
                this.gameOver();
            } else {
                this.currentLevelIndex = this.currentLevelIndex % this.availableLevels.length;
                this.setupCurrentLevel();
            }
        }

        uiManager.updateLayout();

        this.updateSceneObjects();
        this.updateCamera();

        if (this.spacecraft.userData.player.currentLifes < 1) {
            this.gameOver();
            return;
        }

    }

    updateCamera() {

        switch (this.cameraMode) {

            case 0:

                this.camera.position.copy(this.camera_offset)
                break;

            case 1:

                this.camera.position.set(this.spacecraft.position.x, this.spacecraft.position.y, this.camera_offset.z);
                this.camera.rotation.set(0, 0, this.spacecraft.rotation.z);

                break;

            case 2:

                const shipPos = new THREE.Vector3();
                this.spacecraft.getWorldPosition(shipPos);

                const delta = shipPos.clone().sub(this.last_spacecraft_position);

                this.scene.children.forEach(child => {

                    child.position.x -= delta.x;
                    child.position.y -= delta.y;


                })

                this.camera.position.x = this.spacecraft.position.x;
                this.camera.position.y = this.spacecraft.position.y;

                break;

            default:
                break;
        }
    }

    updateSceneObjects() {

        this.last_spacecraft_position.copy(this.spacecraft.position);

        this.scene.children.forEach(child => {
            if (child.userData.updatable)
                child.updateState();
        })

        this.collisionsManager.checkForCollisions(this.scene.children);
    }

    destroyAllObjects() {

        this.remainingObjects.forEach(o => {

            if (o instanceof InertialObject) {

                this.scene.add(new Explosion(explosionTypes.destruction, o.position));

                o.removeSelfFromScene(true);

            }
        })

        this.remainingObjects = [];
    }

    gameOver() {

        this.spacecraft.userData.blinking.clear();
        window.clearTimeout(this.spacecraft.userData.timer);

        this.soundsManager.gameOver.play();

        this.soundsManager.clearAllMusic();

        this.scene.children.forEach(function (child) {
            if (child instanceof InertialObject)
                child.removeSelfFromScene();
        })

        uiManager.showGameOver();

        this.jokerManager.clearTimer();

        this.over = true;

    }

    addAsteroids(count, childCount) {

        for (let n = 0; n < count; n++) {

            let clonedAsteroid = new Asteroid(new THREE.Vector3(0, 0, 0), 0.999, childCount);
            clonedAsteroid.setRandomProperties();

            this.scene.add(clonedAsteroid);

            this.remainingObjects.push(clonedAsteroid);
        }
    }

    addEnemySpacecrafts(count) {

        setTimeout(() => {

            for (let n = 0; n < count; n++) {

                let clonedEnemySpacecraft = new EnemySpacecraft();

                this.scene.add(clonedEnemySpacecraft);

                this.remainingObjects.push(clonedEnemySpacecraft);
            }

        }, 1000);

    }



    addScorePoints(objectDestroyed) {

        const multiplier = this.spacecraft.isActiveJoker('Double points') ?
            2 : 1;

        let score = 0;

        if (objectDestroyed instanceof Asteroid) {

            score = objectDestroyed.userData.divisionsLeft * SCORES.ASTEROID * multiplier;

        } else if (objectDestroyed instanceof EnemySpacecraft) {

            score = SCORES.ENEMY_SPACECRAFT * multiplier;

        }
        this.spacecraft.userData.player.score += score;
    }

    switchMute() {

        Howler.mute(this.settings.soundOn);

        this.settings.soundOn = !this.settings.soundOn;

    }

    handlePause() {

        this.paused = !this.paused;

        this.soundsManager.toggleLevelMusic();

        uiManager.handleEscPress();

        if (this.paused) {

            this.spacecraft.userData.player.activeJokers.forEach(activeJoker => {

                if (activeJoker.userData.timer !== null)

                    activeJoker.userData.timer.pause();
            });

            this.scene.children.forEach(child => {
                if (child instanceof Joker) {
                    child.userData.timer.pause();
                }
            })

            this.jokerManager.pauseGeneration();

        } else {

            this.spacecraft.userData.player.activeJokers.forEach(activeJoker => {

                activeJoker.userData.timer.resume();
            });

            this.scene.children.forEach(child => {
                if (child instanceof Joker) {
                    child.userData.timer.resume();
                }
            })

            this.jokerManager.resumeGeneration();
        }

        if (this.spacecraft.userData.player.invincibleModeOn) {

            if (this.paused) {

                if (this.spacecraft.userData.timer != null)

                    this.spacecraft.userData.timer.pause();

                this.spacecraft.userData.blinking.pause();

            } else {

                if (this.spacecraft.userData.blinking.paused)

                    this.spacecraft.userData.blinking.resume();

                if (this.spacecraft.userData.timer != null)

                    this.spacecraft.userData.timer.resume();
            }
        }
    }
    /** SCREENSHOT SECTION
     */
    capture = (() => {
        html2canvas(document.querySelector('canvas')).then(function (canvas) {

            var win = window.open();
            win.document.write('<iframe src="' + canvas.toDataURL("image/png") + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen> </iframe>');

        })
    })

    updateWorldSize() {

        this.horinzontal_fov = 2 * THREE.Math.radToDeg(Math.atan(Math.tan(THREE.Math.degToRad(this.camera.fov) / 2) * this.camera.aspect));
        // compute the width and the height at z = 0
        this.world_w = Math.tan(THREE.Math.degToRad(this.horinzontal_fov) / 2) * this.camera.position.z * 2;
        this.world_h = Math.tan(THREE.Math.degToRad(this.camera.fov) / 2) * this.camera.position.z * 2;

    }
}

function removeObject3D(object) {
    if (!(object instanceof THREE.Object3D)) return false;
    // for better memory management and performance
    if (object.geometry) {
        object.geometry.dispose();
    }
    if (object.material) {
        if (object.material instanceof Array) {
            // for better memory management and performance
            object.material.forEach(material => material.dispose());
        } else {
            // for better memory management and performance
            object.material.dispose();
        }
    }
    if (object.parent) {
        object.parent.remove(object);
    }
    // the parent might be the scene or another Object3D, but it is sure to be removed this way
    return true;
}

function waitingKeypress() {

    return new Promise((resolve) => {

        document.addEventListener('keyup', onKeyHandler);
        document.addEventListener('click', onKeyHandler);

        function onKeyHandler(e) {
            document.removeEventListener('keyup', onKeyHandler);
            document.removeEventListener('click', onKeyHandler);
            resolve();
        }

    });
}