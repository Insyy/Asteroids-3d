class UImanager {

    gameNameContainer;

    menuButtonSetContainer;
    menuButtonSetContainerSettings;

    keysHelperContainer;

    scoreContainer;

    lifesContainer;

    jokersContainer;

    jokersPath = './src/medias/images/Jokers/'

    constructor(gameContainer) {

        this.menuButtonSetHtml = `
            <li><button class="menu-button" id="play-btn">Play</button></li>
            <li><button class="menu-button" id="settings-btn">Settings</button></li>
            <li><button class="menu-button" id="credits-btn">Credits</button></li>
        `

        this.menuButtonSetSettingsHtml = `
        <li><div class="menu-text">Sound</div><button class="menu-button" id="sound-on"></button></li>
        <li><div class="menu-text">Debug mode</div><button class="menu-button" id="debug-on"></button></li>
        <li><div class="menu-text">Bloom</div><button class="menu-button" id="bloom-on"></button></li>
        <li><div class="menu-text">Keyboard mode</div><button class="menu-button" id="input-type"></button></li>
        <li><button class="menu-button back-btn" id="back-btn-set">Back</button></li>
        `

        this.creditsHtml = `
        <li><div class="menu-text">Created by Ivan Alonso @UPPA 2022</div></li>
        <li><button class="menu-button back-btn" id="back-btn-cred">Back</button></li>
        `

        this.keysHelperHtml = `
        <li><div class="key" id="forward"></div>Thrusts forward</li>
        <li><div class="key">S</div>Thrusts backward</li>
        <li><div class="key" id="left"></div>Turn left</li>
        <li><div class="key">D</div>Turn right</li>
        <li><div class="key">SPACE</div>Shoots</li>
        <li><div class="key">P</div>Screen capture</li>
        <li><div class="key">I</div>Invincibility mode</li>
        <li><div class="key">J</div>Pick next joker</li>
        <li><div class="key">F</div>Toggle fullscreen</li>
        <li><div class="key">K</div>Destroy all objects</li>
        <li><div class="key">0</div>Camera 0</li>
        <li><div class="key">1</div>Camera 1</li>
        <li><div class="key">2</div>Camera 2</li>
        <li><div class="key">Escape</div>Pause/resume and open/close settings</li>
        <li class="last"><div class="key">H</div>Toggle this help</li>
        `

        this.menuButtonSetContainer = document.createElement('ul');
        this.menuButtonSetContainer.className = 'menu-button-set';
        this.menuButtonSetContainer.id = 'menu';
        this.menuButtonSetContainer.innerHTML = this.menuButtonSetHtml;

        this.gameNameContainer = document.createElement('div');
        this.gameNameContainer.id = 'gameName';
        this.gameNameContainer.className = 'pulsate';
        this.gameNameContainer.innerHTML = `<div>ASTEROID</div>
                                        <div class="threeD">3D</div>`;

        this.menuButtonSetContainerSettings = document.createElement('ul');
        this.menuButtonSetContainerSettings.className = 'menu-button-set';
        this.menuButtonSetContainerSettings.id = 'settingsMenu';
        this.menuButtonSetContainerSettings.innerHTML = this.menuButtonSetSettingsHtml;

        this.creditsContainer = document.createElement('ul');
        this.creditsContainer.className = 'menu-button-set';
        this.creditsContainer.id = 'credits';
        this.creditsContainer.innerHTML = this.creditsHtml;

        this.keysHelperContainer = document.createElement('ul');
        this.keysHelperContainer.className = 'help-list';
        this.keysHelperContainer.id = 'help';
        this.keysHelperContainer.innerHTML = this.keysHelperHtml;

        this.scoreContainer = document.createElement('div');
        this.scoreContainer.id = 'score';

        this.lifesContainer = document.createElement('div');
        this.lifesContainer.id = 'lifes';

        this.jokersContainer = document.createElement('div');
        this.jokersContainer.id = 'jokers';

        gameContainer.appendChild(this.menuButtonSetContainer);
        gameContainer.appendChild(this.menuButtonSetContainerSettings);
        gameContainer.appendChild(this.gameNameContainer);
        gameContainer.appendChild(this.creditsContainer);
        gameContainer.appendChild(this.keysHelperContainer);
        gameContainer.appendChild(this.scoreContainer);
        gameContainer.appendChild(this.lifesContainer);
        gameContainer.appendChild(this.jokersContainer);




        this.toggleCreditsDisplay();
        this.toggleSettingsDisplay();
        this.toggleFullMenuDisplay();
        this.toggleKeysHelpDisplay();

        document.getElementById("play-btn").addEventListener("click", this.handlePlayClick.bind(this));
        document.getElementById("settings-btn").addEventListener("click", this.handleSettingsClick.bind(this));
        document.getElementById("credits-btn").addEventListener("click", this.handleCreditsClick.bind(this));

        document.getElementById("sound-on").addEventListener("click", this.handleSoundClick.bind(this));
        document.getElementById("debug-on").addEventListener("click", this.handleDebugClick.bind(this));
        document.getElementById("bloom-on").addEventListener("click", this.handleBloomClick.bind(this));
        document.getElementById("input-type").addEventListener("click", this.handleInputTypeClick.bind(this));
        document.getElementById("back-btn-set").addEventListener("click", this.handleBackBtnSettingsClick.bind(this));
        document.getElementById("back-btn-cred").addEventListener("click", this.handleBackBtnCreditsClick.bind(this));
    }


    toggleFullMenuDisplay() {

        this.toggleMainMenuDisplay();
        this.toggleGameNameDisplay();

    }

    toggleMainMenuDisplay() {
        var display = document.getElementById("menu").style.display;

        display == "none" ?
            document.getElementById("menu").style.display = "" :
            document.getElementById("menu").style.display = "none";
    }

    togglePlayBtnDisplay() {
        var display = document.getElementById("play-btn").style.display;

        display == "none" ?
            document.getElementById("play-btn").style.display = "" :
            document.getElementById("play-btn").style.display = "none";
    }

    toggleGameNameDisplay() {
        var display = document.getElementById("gameName").style.display;

        display == "none" ?
            document.getElementById("gameName").style.display = "" :
            document.getElementById("gameName").style.display = "none";
    }

    toggleCreditsDisplay() {
        var display = document.getElementById("credits").style.display;

        display == "none" ?
            document.getElementById("credits").style.display = "" :
            document.getElementById("credits").style.display = "none";
    }

    toggleSettingsDisplay() {
        var display = document.getElementById("settingsMenu").style.display;

        display == "none" ?
            document.getElementById("settingsMenu").style.display = "" :
            document.getElementById("settingsMenu").style.display = "none";
    }

    toggleKeysHelpDisplay() {

        var display = document.getElementById("help").style.display;

        display == "none" ?
            document.getElementById("help").style.display = "" :
            document.getElementById("help").style.display = "none";

    }

    handlePlayClick() {

        this.toggleFullMenuDisplay();
        game.startGame();

    }

    handleSettingsClick() {

        this.toggleMainMenuDisplay();
        this.toggleSettingsDisplay();

    }

    handleCreditsClick() {

        this.toggleMainMenuDisplay();
        this.toggleCreditsDisplay();

    }

    handleSoundClick(e) {

        game.switchMute();

        this.updateVariables();

    }

    handleDebugClick(e) {

        game.settings.debugModeOn = !game.settings.debugModeOn;

        this.updateVariables();

    }

    handleBloomClick(e) {

        game.settings.bloomOn = !game.settings.bloomOn;

        this.updateVariables();

    }

    handleInputTypeClick(e) {

        if (game.settings.selectedMode == 'qwerty')
            game.settings.selectedMode = 'azerty';
        else
            game.settings.selectedMode = 'qwerty';


        this.updateVariables();
    }

    handleBackBtnSettingsClick() {

        this.toggleSettingsDisplay();
        this.toggleMainMenuDisplay();

    }

    handleBackBtnCreditsClick() {

        this.toggleCreditsDisplay();
        this.toggleMainMenuDisplay();

    }

    handleEscPress() {

        var settingsNotDisplayed = document.getElementById("settingsMenu").style.display == 'none';
        var menuNotDisplayed = document.getElementById("menu").style.display == 'none';
        var creditsNotDisplayed = document.getElementById("credits").style.display == 'none';

        var nothingDisplayed = settingsNotDisplayed &&
            menuNotDisplayed &&
            creditsNotDisplayed;

        if (nothingDisplayed) {
            this.toggleMainMenuDisplay();
            return
        };

        if (!settingsNotDisplayed) {
            this.toggleSettingsDisplay()
            return;
        }
        if (!creditsNotDisplayed) {
            this.toggleCreditsDisplay()
            return;
        }

        this.toggleMainMenuDisplay();

    }

    updateVariables() {

        let soundStr = game.settings.soundOn ? 'ON' : 'OFF';
        let debugStr = game.settings.debugModeOn ? 'ON' : 'OFF';
        let bloomStr = game.settings.bloomOn ? 'ON' : 'OFF';
        let selectedModeStr = game.settings.selectedMode == 'qwerty' ? 'QWERTY' : 'AZERTY'

        let forwardStr, leftStr;
        if (selectedModeStr == 'QWERTY') {
            forwardStr = 'W'
            leftStr = 'A'
        } else {
            forwardStr = 'Z'
            leftStr = 'Q'
        }

        document.getElementById('sound-on').innerHTML = soundStr;
        document.getElementById('debug-on').innerHTML = debugStr;
        document.getElementById('bloom-on').innerHTML = bloomStr;
        document.getElementById('input-type').innerHTML = selectedModeStr;
        document.getElementById('forward').innerHTML = forwardStr;
        document.getElementById('left').innerHTML = leftStr;

    }

    updateScore() {

        if (game.over) {
            document.getElementById('score').style.display = 'none';
            return
        }

        document.getElementById('score').style.display = '';
        document.getElementById('score').innerHTML = game.spacecraft.userData.player.score;

    }

    updateLifes() {

        if (game.over)
            document.getElementById('lifes').style.display = 'none';

        else {
            let lifesHtml = '';

            for (let n = 0; n < game.spacecraft.userData.player.currentLifes; n++) {
                lifesHtml += `<img src=${this.jokersPath + 'health.png'} class="lifeImg">`
            }
            document.getElementById('lifes').style.display = '';
            document.getElementById('lifes').innerHTML = lifesHtml;
        }
    }

    updateJokers() {

        if (game.over)
            document.getElementById('jokers').style.display = 'none';

        else {
            let lifesHtml = '';

            const jokerSet = game.spacecraft.userData.player.activeJokers.getUniqueJokers();

            jokerSet.forEach(
                joker => {
                    const j = joker.userData.selectedJoker;
                    lifesHtml += `
                    <div class="joker">
                        <div class="jokerDesc">${j.description}</div>
                        <img src=${this.jokersPath + j.fileName} 
                            class="jokerImg">
                        </img>
                    </div>`;
                })

            document.getElementById('jokers').style.display = '';
            document.getElementById('jokers').innerHTML = lifesHtml;
        }
    }

    updateLayout() {

        this.updateScore();
        this.updateLifes();
        this.updateJokers();
        this.updateVariables();

        if (game.over) {
            document.getElementById('play-btn').style.display = '';
            document.getElementById('settingsMenu').style.top = '45%';
            document.getElementById('settingsMenu').style.bottom = 'auto';
            document.getElementById('settingsMenu').style.left = '0';
            document.getElementById('settingsMenu').style.right = '0';
            return;
        }
        document.getElementById('menu').style.top = '0';
        document.getElementById('menu').style.bottom = '0';
        document.getElementById('menu').style.left = '0';
        document.getElementById('menu').style.right = '0';

        document.getElementById('settingsMenu').style.top = '0';
        document.getElementById('settingsMenu').style.bottom = '0';
        document.getElementById('settingsMenu').style.left = '0';
        document.getElementById('settingsMenu').style.right = '0';

        document.getElementById('play-btn').style.display = 'none';
    }

    showNextLevelText(nextLevel) {

        var el = document.createElement('div');
        el.className = 'nxt';
        el.id = 'nxtlvl';
        el.innerHTML = `LEVEL ${nextLevel}`;

        document.body.appendChild(el);

        setTimeout(() => {
            document.body.removeChild(el);
        }, 3000);

    }

    showGameOver() {

        var el = document.createElement('div');
        el.className = 'game-over';

        let congratulations = game.currentLevelIndex == game.availableLevels.length ?
            'Congratulations, y' : 'Y'

        el.innerHTML = `<div class="game-over-message">GAME OVER</div>
                        <div class="game-over-score-container">
                            <div>${congratulations}ou obtained a score of</div> 
                            <div class="game-over-score">${game.spacecraft.userData.player.score}</div>
                        </div>
                        <div class="touch-key-message">Touch any key or click to go back to main menu</div>`

        document.body.appendChild(el);

        setTimeout(() => {
            waitingKeypress().then(() => {

                document.body.removeChild(el);

                game = new Game(modelManager);

            })
        }, 1000)


    }

    toggleFullScreen() {

        game.settings.fullScreenOn = !game.settings.fullScreenOn;

        game.settings.fullScreenOn ?
            this.openFullscreen() :
            this.closeFullscreen();

    }

    openFullscreen() {

        var elem = document.body;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE11 */
            elem.msRequestFullscreen();
        }
    }

    closeFullscreen() {
        var elem = document.body;

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE11 */
            document.msExitFullscreen();
        }
    }
}