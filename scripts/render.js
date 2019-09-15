define(function() {
    let ctx;

    return {
        setupCtx: function(newCtx, configs){
            ctx = newCtx;
            ctx.canvas.width = configs.canvasWidth;
            ctx.canvas.height = configs.canvasHeight;
        },
        clear: function() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        },
        animateInit: function(timeline) {
            ctx.fillText(`Starting In: ${timeline.initAnimation.length - timeline.getFrame()}`,
                10, 50);
        },
        drawBoard: function() {

        },
    }
});