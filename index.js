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
        'scripts/ajax.js',
        'scripts/pusher.js',
    ], function(logger, configs, states, timeline, render, grid, pieces, controls, ajax, pusher) {
        const canvasDom = document.querySelector("canvas");
        const ctx = canvasDom.getContext("2d");
        logger.log('configs:', configs);
        controls.setupListeners(configs);
        render.setupCtx(ctx, configs, grid, pieces);
        pusher.connect(grid.setPartnerGrid, pieces.setPartnerQueue, states.setOpponentReady, states.setOpponentPaused, states.p2End);

        setInterval(function() {
            tick(logger, configs, states, timeline, grid, pieces, controls, pusher);
            draw(states, timeline, render, pusher, grid, pieces);
        }, 1000/configs.fps);
    });
}

function tick(logger, configs, states, timeline, grid, pieces, controls, pusher) {
    updateTimeline(timeline, states);
    // pause game
    if (controls.requestPause()) {
        if (states.togglePause()) {
            pusher.sendPause(states.isPaused());
        }
        // is also bound to esc
        if (states.startGame()) {
            pusher.sendReady();
        }
    }

    if (states.isRunning()) {
        pieces.update(grid, controls.getQueue());
        grid.update();
        if (grid.isGameOver()) {
            states.end();
            pusher.sendEnd();
        }
    }

    // On state change
    if (states.getState() !== states.getPreviousTickState()) {
        // if just started.
        if (states.isInit() && states.getPreviousTickState() !== 3 && states.getPreviousTickState() !== 6) {
            states.setOpponentReady(false);
            grid.setupGrid(configs);
            pieces.setupActivePiece();
        }

        logger.log('state change:', states.getPreviousTickState(), '->', states.getState());
        states.setPreviousTickState(states.getState());
    }
    controls.resetQueue();
}

function draw(states, timeline, render, pusher, grid, pieces) {
    render.clear();
    if (states.isIdle()) {
        render.animateStart();
    }
    if (states.isReady()) {
        render.animateReady();
    }
    if (states.isRunning() || states.isInit() || states.isPaused() || states.isEnd() || states.isP2Paused()) {
        render.drawBoard();
        grid.getExportGrid(pusher, pieces.getActivePiece());
        pieces.exportQueue(pusher);
        if (states.isInit()) {
            render.animateInit(timeline);
        }
        if (states.isPaused()) {
            render.animatePause()
        }
        if (states.isEnd()) {
            render.animateEnd(states.getState());
        }
        if (states.isP2Paused()) {
            render.animateP2Pause();
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
    if (states.isPaused() || states.isP2Paused()) {
        timeline.reset(0);
    }
}

