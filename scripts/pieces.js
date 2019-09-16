define(function() {
    let activePiece = {};
    let queue = [1];

    const ticksPerDrop = 4;
    const ticksPerRotate = 1;
    const ticksPerMove = 1;
    const tileSize = 40;

    let moveCooldown = ticksPerMove;
    let rotateCooldown = ticksPerRotate;
    let dropCooldown = ticksPerDrop;

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
                    [,1],
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
                    [,1],
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

    function update(grid, controlsQueue) {
        if (!activePiece.data) {
            activePiece = newActivePiece(queue.pop());
            queue.unshift(Math.floor(Math.random() * 7));
        }
        // move piece
        let move = getFirst(controlsQueue, ['LEFT', 'RIGHT', 'DROP', 'FASTDROP']);
        if (move) {
            switch(move) {
                case 'LEFT':
                    // col can be less than 0 if template is offset.
                    let minLeft = 4;
                    if (activePiece.col <= 0) {
                        let position = activePiece.data.positions[activePiece.rotation];
                        for (row in position) {
                            if (row.indexOf(1) > -1 && row.indexOf(1) < minLeft) minLeft = row.indexOf(1);

                        }
                    }
                    if (minLeft + activePiece.col > 0) {
                        activePiece.col--;
                    }
                    break;
                case 'RIGHT':
                    // col can be less than 0 if template is offset.
                    let maxRight = -4;
                    if (activePiece.col + 4 >= grid.getCols() - 1) {
                        let position = activePiece.data.positions[activePiece.rotation];
                        for (rows in position) {
                            for (cells in rows) {
                                if (cells.lastIndexOf(1) > maxRight) maxRight = cells.lastIndexOf(1) - 1;
                            }
                        }
                    }
                    console.log(activePiece.col, maxRight, grid.getCols());
                    if (maxRight + activePiece.col + 4 < grid.getCols() - 1) {
                        activePiece.col++;
                    }
                    break;
            }
        }
        // rotate piece
        let rotate = getFirst(controlsQueue, ['ROTATECW']);
        if (rotate) {
            activePiece.rotation = (activePiece.rotation + 1) % activePiece.data.positions.length;
        }
        // drop piece
        if (--dropCooldown <= 0) {
            dropCooldown = ticksPerMove;
            if (grid.insertPiece(activePiece)) {
                activePiece = {};
            } else {
                activePiece.row += 1;
            }
        }
    }

    function getFirst(queue, types) {
        if (!queue || !queue.length) return;
        return queue.find(function(action) {return types.indexOf(action) > -1})
    }

    return {
        update: update,
        render: render,
    }
});