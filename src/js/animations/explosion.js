const explosionTypes = {
    hit: 0,
    destruction: 1,
}

class Explosion extends THREE.Object3D {

    userData = {
        initialScale: 0,
        finalScale: 0
    }

    constructor(type, position) {

        super();

        this.add(modelManager.getExplosionClone());

        this.position.copy(position);

        this.userData.finalScale = type === explosionTypes.hit ? .03 : .1

        this.scale.set(this.userData.initialScale,
            this.userData.initialScale,
            this.userData.initialScale);

        this.rotateX(- Math.PI / 2)
        this.rotateY(Math.random()*Math.PI*2);
        
        this.traverse(o => {
            if (o.isMesh) {
                o.material.transparent = true;
                o.material.opacity = 1.0;
            }
        })

        this.scaleUp();

    }

    scaleUp() {

        let scalingInterval = setInterval(() => {

            if (this.userData.initialScale < this.userData.finalScale) {

                this.userData.initialScale += this.userData.finalScale / 20;
                this.scale.set(this.userData.initialScale, 
                    this.userData.initialScale, 
                    this.userData.initialScale);

            } else {

                window.clearInterval(scalingInterval);
                this.fadeOut()

            }
        }, 5);
    }

    fadeOut() {

        let opacity = 1;
        let fadeOutInterval = setInterval(() => {

            if (opacity <= 0.0) {

                window.clearInterval(fadeOutInterval);
                removeObject3D(this);

            } else this.traverse(o => {

                if (o.isMesh) {

                    opacity -= .0005;
                    o.material.opacity = opacity;

                }
            })
        }, 5)

    }
}