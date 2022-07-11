class Timer {

    constructor(callback, delay) {

            /********************* PROPERTIES *********************/
            this.delay = delay;
            this.callback = callback;
            this.starttime = new Date().getTime();
            this.timerID = window.setTimeout(this.callback, this.delay);

        }
        /********************* METHODS *********************/
        /**
         * Pause
         */
    pause() {
        /** If the timer has already been paused, return **/
        if (this.timerID == null) {
            //console.log('Timer has been paused already.');
            return;
        }

        /** Pause the timer **/
        window.clearTimeout(this.timerID);
        this.timerID = null; // this is how we keep track of the timer having beem cleared


        /** Calculate the new delay for when we'll resume **/
        this.delay = this.starttime + this.delay - new Date().getTime();
        //console.log('Paused the timer. Time left:', this.delay);
    }



    /**
     * Resume
     */
    resume() {
        this.starttime = new Date().getTime();
        this.timerID = window.setTimeout(this.callback, this.delay);
        //console.log('Resuming the timer. Time left:', this.delay);
    }

} /* END Timer */