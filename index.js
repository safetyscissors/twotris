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
        'scripts/grid.js',
        'scripts/pieces.js',
    ], function(logger, configs, states, timeline, render, grid, pieces) {
        const canvasDom = document.querySelector("canvas");
        const ctx = canvasDom.getContext("2d");
        logger.log('configs:', configs);
        grid.setupGrid(configs);
        render.setupCtx(ctx, configs, grid, pieces);

        // init grids
        // init controls
        // init frames
        // init draw

        setInterval(function() {
            tick(logger, configs, states, timeline, grid, pieces);
            draw(states, timeline, render);
        }, 1000/configs.fps);
    });
}

function tick(logger, configs, states, timeline, grid, pieces) {
    updateTimeline(timeline, states);
    if (states.isRunning()) {
        pieces.update(grid);
        grid.update();
    }
    // On state change
    if (states.getState() !== states.getPreviousTickState()) {
        logger.log('state change:', states.getPreviousTickState(), '->', states.getState());
        updateButton(logger, states);
        states.setPreviousTickState(states.getState());
    }
}

function draw(states, timeline, render) {
    render.clear();
    if (states.isRunning() || states.isInit()) {
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
    if (states.isRunning() || states.isInit()) timeline.tick();
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
    if (states.isRunning() || states.isInit()) {
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

