define(function() {
    let grid = [];
    let tileSize = 20;
    let newPiece = false;

    const colors = [
        '#b54542',
        '#BB4AA0',
        '#C0A24E',
        '#53C46E',
        '#5875C9',
        '#5D7ACD',
        '#6c59d1'];

    function setupGrid(configs) {
        grid = [];
        tileSize = configs.tileWidth;
        for(let i = 0; i < configs.rows; i++) {
            grid[i] = new Array(configs.cols);
        }
    }

    function render(ctx) {
        for(let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === undefined || grid[i][j] === null) continue;
                ctx.fillStyle = colors[grid[i][j]];
                ctx.fillRect(j*tileSize, i*tileSize, tileSize, tileSize);
            }
        }
    }

    function insertPiece(position, row, col, id) {
        if (collisionCheck(position, row + 1, col)) {
            for (let i = 0; i < position.length; i++) {
                for (let j = 0; j < position[i].length; j++) {
                    if (position[i][j] !== 1) continue;
                    grid[row + i][col + j] = id;
                }
            }
            newPiece = true;
            return true;
        }
        return false;
    }

    function collisionCheck(position, row, col) {
        for (let i = 0; i < position.length; i++) {
            // if no tiles on this position row, skip.
            if (position[i].length === 0) continue;
            // collision if row is outside the grid.
            if (row + i > 20 - 1) return true;
            // check every tile does not overlap
            for (let j = 0; j < position.length; j++) {
                if (position[i][j] !== 1) continue;
                // check if col is outside the grid.
                if (col + j < 0 || col + j > 10 - 1) return true;
                const cell = grid[row + i][col + j];
                if (cell !== undefined && cell !== null) return true;
            }
        }
        return false;
    }

    function update() {
        if (newPiece) {
            // check for cleared lines
        }
        newPiece = false;
    }

    return {
        setupGrid: setupGrid,
        getGrid: function() {return grid},
        getCols: function() {return grid[0].length},
        log: function(logger) {logger.log(grid)},
        update: update,
        collisionCheck: collisionCheck,
        insertPiece: insertPiece,
        render: render,
    }
});