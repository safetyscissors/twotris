define(function() {
    let controlQueue = [];

    function setupListeners(configs, rootDom) {
        document.onkeydown = readControls;
        // document.onkeyup = readControls;
    }

    function readControls(e) {
        let action = '';
        switch(e.code) {
            case 'KeyA':
            case 'ArrowLeft':
                action = 'LEFT';
                break;
            case 'KeyD':
            case 'ArrowRight':
                action = 'RIGHT';
                break;
            case 'KeyW':
            case 'ArrowUp':
                action = 'ROTATECW';
                break;
            case 'KeyS':
            case 'ArrowDown':
                action = 'DROP';
                break;
            case 'SPACE':
                action = 'FASTDROP';
                break;
        }
        if (controlQueue.indexOf(action) > -1) return;
        controlQueue.push(action);
        console.log(controlQueue);
    }

    return {
        setupListeners: setupListeners,
        getQueue: function() {return controlQueue},
        resetQueue: function() {controlQueue = []}
    }
});