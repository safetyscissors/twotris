define(function() {
    const logLevel = 0;
    return {
        log(...msg) {
            if (logLevel > 1) return;
            console.log(...msg);
        }
    }
});