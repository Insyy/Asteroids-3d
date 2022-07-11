class ModelManager {

    asteroidModel = new THREE.Object3D();
    spacecraftModel = new THREE.Object3D();
    missileModel = new THREE.Object3D();
    plasmaGrenadeModel = new THREE.Object3D();
    enemySpacecraftModel = new THREE.Object3D();
    spaceTexture = new THREE.CubeTexture();
    spacecraftShieldModel;
    explosionModel = new THREE.Object3D();
    jokerSprites = {
        invincibility: undefined,
        health: undefined,
        fastBullet: undefined,
        plasmaGrenade: undefined,
        doublePoints: undefined,
    }


    gltfLoader
    cubeTextureLoader
    textureLoader;

    constructor() {

        this.setupLoadingManager();

        this.gltfLoader = new THREE.GLTFLoader(this.loadingManager);
        this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager);
        this.textureLoader = new THREE.TextureLoader(this.loadingManager)

        this.loadAsteroidModel();
        this.loadSpacecraftModel();
        this.loadMissileModel();
        this.loadPlasmaGrenadeModel();
        this.loadEnemySpacecraftModel();
        this.loadSpaceTexture();
        this.loadJokerSprites();
        this.loadSpacecraftShieldModel();
        this.loadExplosionModel();

    }

    setupLoadingManager() {

        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {

            //console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.loadingManager.onLoad = () => {

            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('fade-out');

            loadingScreen.addEventListener('transitionend', (event) => {
                event.target.remove();
            });

            //console.log('Loading complete!');
            createGame();

        };


        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {

            //console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.loadingManager.onError = (url) => {

            console.log('There was an error loading ' + url);

        };

    };

    loadSpacecraftShieldModel() {
        const material = new THREE.MeshPhongMaterial({
            color: 0x66CCFF, // red (can also use a CSS color string here)
            /* flatShading: true, */
            transparent: true,
            opacity: .5
        });
        const radius = 16; // ui: radius
        const widthSegments = 12; // ui: widthSegments
        const heightSegments = 8; // ui: heightSegments
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

        this.spacecraftShieldModel = new THREE.Mesh(geometry, material);

    }

    loadJokerSprites() {

        this.textureLoader.setPath("./src/medias/images/Jokers/")

        let map = this.textureLoader.load("Invincibility.png");
        let material = new THREE.SpriteMaterial({
            map: map
        });

        this.jokerSprites.invincibility = new THREE.Sprite(material);


        map = this.textureLoader.load("big-weapon.png");
        material = new THREE.SpriteMaterial({
            map: map
        });

        this.jokerSprites.plasmaGrenade = new THREE.Sprite(material);


        map = this.textureLoader.load("health.png");
        material = new THREE.SpriteMaterial({
            map: map
        });

        this.jokerSprites.health = new THREE.Sprite(material);


        map = this.textureLoader.load("faster-shooting.png");
        material = new THREE.SpriteMaterial({
            map: map
        });

        this.jokerSprites.fastBullet = new THREE.Sprite(material);


        map = this.textureLoader.load("double-points.png");
        material = new THREE.SpriteMaterial({
            map: map
        });

        this.jokerSprites.doublePoints = new THREE.Sprite(material);

    }

    loadExplosionModel() {
        this.gltfLoader.setPath("./src/medias/models/explosion/");

        this.gltfLoader.load(
            // resource URL
            "scene.gltf",
            // called when the resource is loaded
            (gltf) => {
                this.explosionModel.add(gltf.scene);
            },
        );
    }

    loadSpaceTexture() {
        this.spaceTexture =
            this.cubeTextureLoader
            .setPath('./src/medias/images/spaceCubeOrange/')
            .load([
                'left.png',
                'right.png',
                'up.png',
                'down.png',
                'front.png',
                'back.png'
            ]);
    }

    loadAsteroidModel() {

        this.gltfLoader.setPath("./src/medias/models/hollow_asteroid/");

        this.gltfLoader.load(
            // resource URL
            "scene.gltf",
            // called when the resource is loaded
            (gltf) => {

                this.asteroidModel.up.set(0, 0, 1);
                this.asteroidModel.add(gltf.scene);

            },
        );
    }

    loadSpacecraftModel() {

        this.gltfLoader.setPath("./src/medias/models/spacecraft/");

        this.gltfLoader.load(
            // resource URL
            "scene.gltf",
            // called when the resource is loaded
            (gltf) => {
                //fix scale, position and rotation for facing forward and taking
                //into account the 2 guns
                this.spacecraftModel.up.set(0, 0, 1);
                this.spacecraftModel.scale.set(.05, .05, .05)
                this.spacecraftModel.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI);
                this.spacecraftModel.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
                this.spacecraftModel.position.z += 4;
                this.spacecraftModel.add(gltf.scene);
            },
        );
    }

    loadEnemySpacecraftModel() {

        this.gltfLoader.setPath("./src/medias/models/colonial_fighter_red_fox/");

        this.gltfLoader.load(
            // resource URL
            "scene.gltf",
            // called when the resource is loaded
            (gltf) => {
                //fix scale, position and rotation for facing forward and taking
                //into account the 2 guns

                this.asteroidModel.up.set(0, 0, 1);

                this.enemySpacecraftModel.scale.set(20, 20, 20)
                this.enemySpacecraftModel.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
                this.enemySpacecraftModel.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

                this.enemySpacecraftModel.add(gltf.scene);

            },
        );
    }

    loadMissileModel() {

        this.gltfLoader.setPath("./src/medias/models/green_missile/");

        this.gltfLoader.load(
            // resource URL
            "scene.gltf",
            // called when the resource is loaded
            (gltf) => {
                //fix scale, position and rotation for facing forward and taking
                //into account the 2 guns
                this.missileModel.scale.set(.1, .1, .05)

                this.missileModel.add(gltf.scene);
            },
        );
    }

    loadPlasmaGrenadeModel() {

        this.gltfLoader.setPath("./src/medias/models/i60_plasma_grenade/");

        this.gltfLoader.load(
            // resource URL
            "scene.gltf",
            // called when the resource is loaded
            (gltf) => {
                //fix scale, position and rotation for facing forward and taking
                //into account the 2 guns
                this.plasmaGrenadeModel.scale.set(.1, .1, .05)

                this.plasmaGrenadeModel.add(gltf.scene);
            },
        );
    }

    getExplosionClone() {
        return  this.explosionModel.clone();
    }

    getMissileClone() {
        var clone = this.missileModel.clone();

        clone.traverse((obj) => {
            if (obj.isMesh) {

                obj.geometry = obj.geometry.clone();
                obj.material = obj.material.clone();
            }
        });
        return clone;
    }

    getPlasmaGrenadeClone() {
        var clone = this.plasmaGrenadeModel.clone();

        clone.traverse((obj) => {
            if (obj.isMesh) {
                obj.geometry = obj.geometry.clone();
                obj.material = obj.material.clone();
            }
        });
        return clone;
    }

    getSpacecraftClone() {
        var clone = this.spacecraftModel.clone();

        clone.traverse((obj) => {
            if (obj.isMesh) {

                obj.geometry = obj.geometry.clone();
                obj.material = obj.material.clone();
            }
        });
        return clone;
    }

    getEnemySpacecraftClone() {
        var clone = this.enemySpacecraftModel.clone();

        clone.traverse((obj) => {
            if (obj.isMesh) {

                obj.geometry = obj.geometry.clone();
                obj.material = obj.material.clone();
            }
        });
        return clone;
    }

    getAsteroidClone() {
        var clone = this.asteroidModel.clone();

        clone.traverse((obj) => {
            if (obj.isMesh) {

                obj.geometry = obj.geometry.clone();
                obj.material = obj.material.clone();
            }
        });
        return clone;
    }

    getSpaceTexture() {
        return this.spaceTexture;
    }

    getSpacecraftShieldModel() {
        return this.spacecraftShieldModel;
    }

    getJokerSprite(name) {

        switch (name) {
            case 'Invincibility':
                return this.jokerSprites.invincibility.clone()
                break;
            case 'Plasma grenade':
                return this.jokerSprites.plasmaGrenade.clone()
                break;
            case 'Restore health':
                return this.jokerSprites.health.clone()
                break;
            case 'Faster shooting':
                return this.jokerSprites.fastBullet.clone()
                break;
            case 'Double points':
                return this.jokerSprites.doublePoints.clone()
                break;
            default:
                break;
        }
    }
}