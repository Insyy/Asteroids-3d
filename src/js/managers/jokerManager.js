class JokerManager {

    constructor(interval){

        game.scene.add(new Joker(0));

        this.jokerTimer = new IntervalTimer(() => {

            game.scene.add(new Joker(0));

        }, interval);
    }

    startGeneration(){
        this.jokerTimer.start()
    }

    pauseGeneration(){
        this.jokerTimer.pause();
    }

    resumeGeneration(){
        this.jokerTimer.resume();
    }

    clearTimer(){
        this.jokerTimer.clear();
    }
}