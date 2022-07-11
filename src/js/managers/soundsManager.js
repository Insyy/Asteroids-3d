class SoundsManager {

    soundsFolder = './src/medias/sounds/'

    missileLaunchSound = new Howl({
        src: [this.soundsFolder + 'missileLaunch.wav']
    });

    plasmaGrenadeLaunchSound = new Howl({
        src: [this.soundsFolder + 'plasmaGrenadeLaunch.flac']
    });

    impactSound = new Howl({
        src: [this.soundsFolder + 'impact.wav']
    });

    destructionSound = new Howl({
        src: [this.soundsFolder + 'destruction.flac']
    });

    menuMusic = new Howl({
        src: [this.soundsFolder + 'menuMusic.mp3'],
        loop: true,
    });

    level1 = new Howl({
        src: [this.soundsFolder + 'level1.wav'],
        loop: true,
    });

    level2 = new Howl({
        src: [this.soundsFolder + 'level2.mp3'],
        loop: true,
    });

    level3 = new Howl({
        src: [this.soundsFolder + 'level3.mp3'],
        loop: true,
    });

    levelCompleted = new Howl({
        src: [this.soundsFolder + 'levelCompleted.wav']
    });

    gameOver = new Howl({
        src: [this.soundsFolder + 'gameOver.wav']
    });

    jokerPickup = new Howl({
        src: [this.soundsFolder + 'jokerPickup.flac']
    });

    levelsMusic = [this.level1, this.level2, this.level3];

    clearAllMusic() {

        this.level1.stop();
        this.level2.stop();
        this.level3.stop();
        this.menuMusic.stop();

    }

    toggleLevelMusic() {

        if (game.paused) {
            this.levelsMusic[game.currentLevelIndex].pause();
            return;
        }

        this.levelsMusic[game.currentLevelIndex].play();

    }
}