define(function() {
    let ctx;
    let grid;
    let piece;
    return {
        setupCtx: function(newCtx, configs, gridObj, pieceObj){
            ctx = newCtx;
            grid = gridObj;
            pieces = pieceObj;
            ctx.canvas.width = configs.canvasWidth;
            ctx.canvas.height = configs.canvasHeight;
        },
        clear: function() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        },
        animateInit: function(timeline) {
            ctx.font = "20px Arial";
            ctx.fillText(`Starting In: ${timeline.initAnimation.length - timeline.getFrame()}`,
                10, 50);
        },
        animateStart: function() {
            ctx.font = "20px Arial";
            ctx.fillText(`hi. press esc to start`,
                10, 50);
        },
        animatePause: function() {
            ctx.font = "20px Arial";
            ctx.fillText(`paused. press esc to resume`,
                10, 50);
        },
        animateEnd: function() {
            ctx.font = "20px Arial";
            ctx.fillText(`game over. press esc to restart.`,
                10, 50);

        },
        drawBoard: function() {
            grid.render(ctx);
            pieces.render(ctx);
        },
    }
});