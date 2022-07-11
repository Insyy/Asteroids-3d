function resize() {
    game.w = game.container.clientWidth;
    game.h = game.container.clientHeight;
    game.camera.aspect = game.w / game.h;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(game.w, game.h);

    game.updateWorldSize()
}

function onWindowKeyDown(event) {
    if (game.paused || game.over) return;
    var key = event.key.toLowerCase();
    if (game.settings.selectedMode === 'qwerty') {
        switch (key) {
            case 'w':
                if (game.paused || game.over) return;
                game.spacecraft.userData.player.controls.isForwardUp = true;
                break;
            case 'a':
                if (game.paused || game.over) return;
                game.spacecraft.userData.player.controls.isRotateLeftUp = true;
                break;
            default:
                break;
        }
    } else {
        switch (key) {
            case 'z':
                if (game.paused || game.over) return;
                game.spacecraft.userData.player.controls.isForwardUp = true;
                break;
            case 'q':
                if (game.paused || game.over) return;
                game.spacecraft.userData.player.controls.isRotateLeftUp = true;
                break;
            default:
                break;
        }
    }
    switch (key) {
        case 's':
            if (game.paused || game.over) return;
            game.spacecraft.userData.player.controls.isBackwardUp = true;
            break;
        case 'd':
            if (game.paused || game.over) return;
            game.spacecraft.userData.player.controls.isRotateRightUp = true;
            break;
        case ' ':
            if (game.paused || game.over) return;
            game.spacecraft.userData.player.controls.isShooting = true;
        default:
            break;
    }
}

function onWindowKeyUp(event) {
    var key = event.key.toLowerCase();
    if (game.settings.selectedMode === 'qwerty') {
        switch (key) {
            case 'w':
                if (game.paused || game.over) return;
                game.spacecraft.userData.player.controls.isForwardUp = false;
                break;
            case 'a':
                if (game.paused || game.over) return;
                game.spacecraft.userData.player.controls.isRotateLeftUp = false;
                break;
            default:
                break;
        }
    } else {
        switch (key) {
            case 'z':
                if (game.paused || game.over) return;
                game.spacecraft.userData.player.controls.isForwardUp = false;
                break;
            case 'q':
                if (game.paused || game.over) return;
                game.spacecraft.userData.player.controls.isRotateLeftUp = false;
                break;
            default:
                break;
        }
    }
    switch (key) {
        case 's':
            if (game.paused || game.over) return;
            game.spacecraft.userData.player.controls.isBackwardUp = false;
            break;
        case 'd':
            if (game.paused || game.over) return;
            game.spacecraft.userData.player.controls.isRotateRightUp = false;
            break;
        case 'p':
            //screen capture
            game.capture();
            break;
        case ' ':
            if (game.paused || game.over) return;
            game.spacecraft.userData.player.controls.isShooting = false;
            break;
        case 'i':
            if (game.paused || game.over) return;
            if (game.spacecraft.userData.timer != null) {
                window.clearTimeout(game.spacecraft.userData.timer.timerID);
                game.spacecraft.userData.timer = null;
                game.spacecraft.userData.blinking.clear();
                game.spacecraft.userData.player.invincibleModeOn = true;
                game.spacecraft.userData.shieldModel.visible = true;
            } else {
                game.spacecraft.userData.player.invincibleModeOn = !game.spacecraft.userData.player.invincibleModeOn;
                game.spacecraft.userData.shieldModel.visible = !game.spacecraft.userData.shieldModel.visible;
            }
            break;
        case 'j':
            if (game.paused || game.over) return;

            const jokerName = jokerTypes[game.currentJokerIndex].name;
            const joker = new Joker(jokerName);

            joker.addAndApplyJoker(game.spacecraft);

            game.currentJokerIndex = (game.currentJokerIndex + 1) % jokerTypes.length;

            break;
        case 'h':
            uiManager.toggleKeysHelpDisplay()
            game.settings.helpToggledOn = !game.settings.helpToggledOn;
            break;
        case 'f':
            uiManager.toggleFullScreen();
            break;
        case 'k':
            if (game.paused || game.over || game.frozen) return;

            game.destroyAllObjects();
            //cheats, DESTROY ASTEROIDS
            break;
        case '0':
            if (game.paused || game.over) return;
            game.setCameraMode(0);
            break;
        case '1':
            if (game.paused || game.over) return;
            game.setCameraMode(1);
            break;
        case '2':
            if (game.paused || game.over) return;
            game.setCameraMode(2);
            break;
        case 'escape':
            if (game.over) return;
            //pause and settings window
            game.handlePause();
            break;
        default:
            break;
    }
}