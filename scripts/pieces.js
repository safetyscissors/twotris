define(function() {
    let activePiece = {};
    let queue = [1];

    const ticksPerMove = 4;
    const tileSize = 40;
    let moveCooldown = ticksPerMove;

    const pieces = [
        { // I
            id: 0,
            positions: [
                [
                    [],
                    [1,1,1,1],
                    [],
                    [],
                ],
                [
                    [,,1],
                    [,,1],
                    [,,1],
                    [,,1],
                ],
                [
                    [],
                    [1,1,1,1],
                    [],
                    [],
                ],
                [
                    [,1],
                    [,1],
                    [,1],
                    [,1],
                ],
            ],
            color: '#B5479B',
        },
        { // L
            id: 1,
            positions: [
                [
                    [],
                    [1,1,1],
                    [1],
                    [],
                ],
                [
                    [1,1],
                    [,1,],
                    [,1],
                    [],
                ],
                [
                    [],
                    [,,1],
                    [1,1,1],
                    [],
                ],
                [
                    [1],
                    [1],
                    [1,1],
                    [],
                ],
            ],
            color: '#BB4AA0',
        },
        { // J
            id: 2,
            color: '#C0A24E',
            positions: [
                [
                    [],
                    [1,1,1],
                    [,,1],
                    [],
                ],
                [
                    [,1],
                    [,1,],
                    [1,1],
                    [],
                ],
                [
                    [],
                    [1],
                    [1,1,1],
                    [],
                ],
                [
                    [1,1],
                    [1],
                    [1],
                    [],
                ],
            ],
        },
        { // S
            id: 3,
            color: '#53C46E',
            positions: [
                [
                    [],
                    [,1,1],
                    [1,1,],
                    [],
                ],
                [
                    [,1],
                    [,1,1],
                    [,,1],
                    [],
                ],
            ],
        },
        { // Z
            id: 4,
            color: '#5875C9',
            positions: [
                [
                    [],
                    [1,1],
                    [,1,1],
                    [],
                ],
                [
                    [,,1],
                    [,1,1],
                    [,1],
                    [],
                ],
            ],
        },
        { // O
            id: 5,
            color: '#5D7ACD',
            positions: [
                [
                    [],
                    [,1,1],
                    [,1,1],
                    [],
                ],
            ],
        },
        { // T
            id: 6,
            color: '#627FD1',
            positions: [
                [
                    [],
                    [1,1,1],
                    [,1],
                    [],
                ],
                [
                    [,,1],
                    [,1,1],
                    [,,1],
                    [],
                ],
                [
                    [],
                    [,1],
                    [1,1,1],
                    [],
                ],
                [
                    [1,],
                    [1,1],
                    [1],
                    [],
                ],
            ],
        }];

    function render(ctx) {
        if (!activePiece.data) return;
        const position = activePiece.data.positions[activePiece.rotation];
        for(let i = 0; i < position.length; i++) {
            for (let j = 0; j < position[i].length; j++) {
                if (!position[i][j]) continue;
                ctx.fillStyle = activePiece.data.color;
                ctx.fillRect((j + activePiece.col) * tileSize, (i + activePiece.row) * tileSize, tileSize, tileSize);
            }
        }
    }

    function newActivePiece(id) {
        return {
            id: id,
            data: pieces[id],
            rotation: 0,
            row: 0,
            col: 3,
        };
    }

    function update(grid) {
        if (!activePiece.data) {
            activePiece = newActivePiece(queue.pop());
            queue.unshift(Math.floor(Math.random() * 7));
        }
        // rotate piece
        // drop piece
        if (--moveCooldown <= 0) {
            moveCooldown = ticksPerMove;
            if (grid.insertPiece(activePiece)) {
                activePiece = {};
            } else {
                activePiece.row += 1;
            }
        }
    }

    return {
        update: update,
        render: render,
    }
});