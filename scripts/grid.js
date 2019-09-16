define(function() {
    let grid = [];
    let tileSize = 20;

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

    function insertPiece(piece) {
        if (checkPieceCollision(piece)) {
            let position = piece.data.positions[piece.rotation];
            for (i = 0; i < position.length; i++) {
                for (j = 0; j < position[i].length; j++) {
                    if (position[i][j] !== 1) continue;
                    grid[piece.row + i][piece.col + j] = piece.data.id;
                }
            }
            return true;
        }
        return false;
    }

    function checkPieceCollision(piece) {
        // if any piece is about to collide, insert, return true.
        let position = piece.data.positions[piece.rotation];
        for (i = 0; i < position.length; i++) {
            // no collision if there are no piece tiles
            if (position.length === 0) continue;
            // collision if the row below is end of grid.
            let rowBelow = grid[piece.row + i + 1];
            if (!rowBelow) {
                if (position[i].length > 0) return true;
                continue;
            }
            // collision if row below has an existing piece.
            for (j = 0; j < position[i].length; j++) {
                if (position[i][j] !== 1) continue;
                if (rowBelow[piece.col + j] !== undefined && rowBelow[piece.col + j] !== null) return true;
            }
        }
        return false;
    }
    return {
        setupGrid: setupGrid,
        getGrid: function() {return grid},
        log: function(logger) {logger.log(grid)},
        update: function() {

        },
        insertPiece: insertPiece,
        render: render,
    }
});