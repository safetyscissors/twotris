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
        'scripts/controls.js',
    ], function(logger, configs, states, timeline, render, grid, pieces, controls) {
        const canvasDom = document.querySelector("canvas");
        const ctx = canvasDom.getContext("2d");
        logger.log('configs:', configs);
        controls.setupListeners(configs);
        render.setupCtx(ctx, configs, grid, pieces);

        // init grids
        // init controls
        // init frames
        // init draw

        setInterval(function() {
            tick(logger, configs, states, timeline, grid, pieces, controls);
            draw(states, timeline, render);
        }, 1000/configs.fps);
    });
}

function tick(logger, configs, states, timeline, grid, pieces, controls) {
    updateTimeline(timeline, states);
    // pause game
    if (controls.requestPause()) {
        states.togglePause();
    }

    if (states.isRunning()) {
        pieces.update(grid, controls.getQueue());
        grid.update();
        if (grid.isGameOver()) {
            states.end();
        }
    }

    // On state change
    if (states.getState() !== states.getPreviousTickState()) {
        // if just started.
        if (states.isInit() && states.getPreviousTickState() !== 3) {
            grid.setupGrid(configs);
        }

        logger.log('state change:', states.getPreviousTickState(), '->', states.getState());
        states.setPreviousTickState(states.getState());
    }
    controls.resetQueue();
}

function draw(states, timeline, render) {
    render.clear();
    if (states.isIdle()) {
        render.animateStart();
    }
    if (states.isRunning() || states.isInit() || states.isPaused() || states.isEnd()) {
        render.drawBoard();
        if (states.isInit()) {
            render.animateInit(timeline);
        }
        if (states.isPaused()) {
            render.animatePause()
        }
        if (states.isEnd()) {
            render.animateEnd()
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

