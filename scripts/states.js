define(function() {
    const states = ['IDLE', 'INIT', 'RUNNING', 'PAUSED', 'END'];
    let state = 0;
    let previousTickState = -1;

    function updateState(newStateIndex) {
        state = newStateIndex;
    }

    function togglePause() {
        if (state === 1 || state === 2){
            state = 3;
        } else {
            state = 1;
        }
    }

    return {
        getState: function() {return state},
        getPreviousTickState: function() {return previousTickState},
        init: function() {updateState(1)},
        start: function() {updateState(2)},
        pause: function() {updateState(3)},
        end: function() {updateState(4)},
        togglePause: togglePause,
        setPreviousTickState: function(i){previousTickState = i},
        isRunning: function() {return state === 2},
        isInit: function() {return state === 1},
        isIdle: function() {return state === 0},
        isPaused: function() {return state === 3},
        isEnd: function() {return state === 4},
    }
});