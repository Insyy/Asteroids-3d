class SpacecraftTrail extends THREE.Object3D {

    system;
    renderer;

    spacecraft

    constructor(spacecraft) {
        super();

        this.spacecraft = spacecraft;

        this.renderer = new Nebula.SpriteRenderer(game.scene, THREE);


        Nebula.System.fromJSONAsync(particles, THREE).then(loaded => {
            this.system = loaded.addRenderer(this.renderer);
        })
    }

    update(position, rotation, active) {

        if (this.system == undefined)
            return;

        this.system.update();

        if (active){
            this.system.emitters[0].setPosition({
                x: position.x,
                y: position.y,
                z: position.z
            })
    
            let trailDirection = new THREE.Vector3(2 * Math.sin(rotation.z), -2 * Math.cos(rotation.z), 0).setLength(20);

            this.system.emitters[0].setRotation({
                x: trailDirection.x,
                y: trailDirection.y,
                z: trailDirection.z
            })
    
            this.system.emitters[0].behaviours.forEach(b => {
                if (b instanceof Nebula.Force) {
                    b.reset(trailDirection.x, trailDirection.y, trailDirection.z);
                }
            })
        }

        else {
            this.system.emitters[0].setPosition({
                x: 10000,
                y: 10000,
                z: 10000
            })
        }
    }
}