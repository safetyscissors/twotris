(function() {
    // document.addEventListener("DOMContentLoaded", init);
    // window.addEventListener('load', init, false);
    init();
})();

function init() {
    require([
        'scripts/logger.js',
        'scripts/configs.js',
        'scripts/states.js',
        'scripts/timeline.js',
        'scripts/render.js',
    ], function(logger, configs, states, timeline, render) {
        const canvasDom = document.querySelector("canvas");
        const ctx = canvasDom.getContext("2d");
        logger.log('configs:', configs);
        render.setupCtx(ctx, configs);

        // init grids
        // init controls
        // init frames
        // init draw

        setInterval(function() {
            tick(logger, configs, states, timeline);
            draw(states, timeline, render);
        }, 1000/configs.fps);
    });
}

function tick(logger, configs, states, timeline) {
    updateTimeline(timeline, states);
    // On state change
    if (states.getState() !== states.getPreviousTickState()) {
        logger.log('state change:', states.getPreviousTickState(), '->', states.getState());
        updateButton(logger, states);
        states.setPreviousTickState(states.getState());
    }
}

function draw(states, timeline, render) {
    render.clear();
    if (states.isRunning()) {
        render.drawBoard();
        if (states.isInit()) {
            render.animateInit(timeline);
        }
    }

}
/**
 * HELPER FUNCTIONS
 */
function updateTimeline(timeline, states) {
    if (states.isRunning()) timeline.tick();
    if (states.isInit() && timeline.getFrame() > timeline.initAnimation.length) {
        states.start();
        timeline.reset();
    }
    if (states.isPaused()) {
        timeline.reset(0);
    }
}

function updateButton(logger, states) {
    const startBtn = document.querySelector("button");

    if (states.isIdle()) {
        startBtn.innerHTML = 'start';
        startBtn.addEventListener('click', states.init);
    }
    if (states.isRunning()) {
        startBtn.innerHTML = 'pause';
        startBtn.removeEventListener('click', states.init);
        startBtn.addEventListener('click', states.pause);
    }
    if (states.isPaused()) {
        startBtn.innerHTML = 'resume';
        startBtn.removeEventListener('click', states.pause);
        startBtn.addEventListener('click', states.init);
    }
}

