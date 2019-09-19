define(function() {
    const states = ['IDLE', 'INIT', 'RUNNING', 'PAUSED', 'END', 'READY', 'OPPONENTPAUSED', 'OPPONENTEND'];
    let state = 0;
    let previousTickState = -1;
    let opponentReady = false;

    function updateState(newStateIndex) {
        state = newStateIndex;
    }

    function togglePause() {
        if (state === 1 || state === 2){
            state = 3;
            return true;
        }
        if (state === 3) {
            state = 1;
            return true;
        }
        return false;
    }

    function startGame() {
        if (state === 0 || state === 4 || state === 7){
            if (opponentReady) {
                state = 1;
                return true;
            }
            state = 5;
            return true;
        }
        return false;
    }

    return {
        getState: function() {return state},
        getPreviousTickState: function() {return previousTickState},
        ready: function() {updateState(5)},
        init: function() {updateState(1)},
        start: function() {updateState(2)},
        pause: function() {updateState(3)},
        end: function() {updateState(4)},
        togglePause: togglePause,
        startGame: startGame,
        setPreviousTickState: function(i){previousTickState = i},
        isReady: function() {return state === 5},
        isRunning: function() {return state === 2},
        isInit: function() {return state === 1},
        isIdle: function() {return state === 0},
        isPaused: function() {return state === 3},
        isEnd: function() {return state === 4 || state === 7},
        isP2Paused: function() {return state === 6},
        setOpponentPaused: function() {
            if (state === 6) {
                updateState(1);
                return;
            }
            updateState(6);
        },
        setOpponentReady: function(data) {
            if (data && state === 5) {
                updateState(1);
            }

            opponentReady = data;
        },
        p2End: function() {
            updateState(7);
        }
    }
});