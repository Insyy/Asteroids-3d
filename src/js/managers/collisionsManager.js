class CollisionsManager {

    checkForCollisions(objects) {

        objects.forEach((a, i) =>
            objects.slice(i).forEach(
                b => this.checkCollisionOutcome(a, b))
        )

    }

    checkCollisionOutcome(a, b) {
        if (!(a.userData.updatable && a.userData.updatable) ||
            !areInertialAndDifferent(a, b) ||
            !boxesCollide(a, b)) return;
        /* Check for Collisions between objects*/
        if (a instanceof SpaceCraft) {

            if (!a.userData.player.invincibleModeOn) {

                if (b instanceof Asteroid) {

                    this.damageSpaceCraft(a);

                    b.destroySelfAndSpawnChildren();

                } else if (b instanceof EnemySpacecraft) {

                    this.damageSpaceCraft(a);

                    b.removeSelfFromScene();

                } else if (b instanceof Missile) {

                    if (!a.userData.player.invincibleModeOn &&
                        b.isEnemy())

                        this.damageSpaceCraft(a);

                }
            }

            if (b instanceof Joker) {

                b.addAndApplyJoker(a);
                b.removeSelfFromScene();
            }

        } else if (a instanceof Asteroid) {

            if (b instanceof Missile ||
                b instanceof PlasmaGrenade) {

                b.damageAsteroid(a);

            } else if (b instanceof Asteroid) {

                this.treatAsteroidsCollision(a, b);

            }

        } else if (a instanceof EnemySpacecraft) {

            if (b instanceof Missile ||
                b instanceof PlasmaGrenade) {

                if (!b.isEnemy()) {

                    b.damageEnemySpacecraft(a);

                }
            }

        } else if (a instanceof Missile) {

            if (b instanceof Missile) {

                a.removeSelfFromScene();
                b.removeSelfFromScene();

            } else if (b instanceof PlasmaGrenade){
                a.removeSelfFromScene();
            }
        } 
    }

    treatAsteroidsCollision(a, b) {
        const obj1_direction = a.userData.speed.clone().normalize();
        const obj1_magnitude_speed = a.userData.speed.length();
        const obj2_direction = b.userData.speed.clone().normalize();
        const obj2_magnitude_speed = b.userData.speed.length();
        const collision_normal = new THREE.Vector3(a.position.x - b.position.x, a.position.y - b.position.y, 0).normalize();
        obj1_direction.add(collision_normal);
        obj1_direction.setLength(obj1_magnitude_speed);
        a.userData.speed.copy(obj1_direction);
        collision_normal.multiplyScalar(-1);
        obj2_direction.add(collision_normal);
        obj2_direction.setLength(obj2_magnitude_speed);
        b.userData.speed.copy(obj2_direction);
    }

    damageSpaceCraft(spacecraft) {

        spacecraft.userData.player.currentLifes--;
        game.scene.add(new Explosion(explosionTypes.destruction, spacecraft.position));

        if (!spacecraft.userData.player.invincibleModeOn &&
            spacecraft.userData.player.currentLifes >= 0) {
            spacecraft.setInvincibleAndBlink(TIMERS.INVINCIBILITY.ON_HIT);

        }
    }
}

function areInertialAndDifferent(a, b) {
    return (a instanceof InertialObject &&
        b instanceof InertialObject &&
        a.uuid != b.uuid)
}

function boxesCollide(obj1, obj2) {

    return obj1.userData.box3.intersectsBox(obj2.userData.box3);

}