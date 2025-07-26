import { clear } from "@testing-library/user-event/dist/clear"

export const coordinates = [
    [0.5, 3.5, 8],
    [0.5, 16, 7],
    [0.5, 28.5, 6],
    [0.5, 41, 5],
    [0.5, 53.5, 4],
    [0.5, 66, 3],
    [0.5, 78.5, 2],
    [0.5, 91, 1],
    [10, 99, "a"],
    [22.25, 99, "b"],
    [34.75, 99, "c"],
    [47.25, 99, "d"],
    [59.75, 99, "e"],
    [72.25, 99, "f"],
    [84.75, 99, "g"],
    [97.25, 99, "h"]
]

//scope cho biet duong di co keo dai khong
const methods = [
    {
        'piece': 'bishop',
        'move': [
            { 'scope': 1, 'coordinate': [1, -1] },
            { 'scope': 1, 'coordinate': [1, 1] },
            { 'scope': 1, 'coordinate': [-1, -1] },
            { 'scope': 1, 'coordinate': [-1, 1] }
        ],
        'alias': ['bb', 'wb']
    },
    {
        'piece': 'rook',
        'move': [
            { 'scope': 1, 'coordinate': [1, 0] },
            { 'scope': 1, 'coordinate': [-1, 0] },
            { 'scope': 1, 'coordinate': [0, -1] },
            { 'scope': 1, 'coordinate': [0, 1] }
        ],
        'alias': ['br', 'wr']
    },
    {
        'piece': 'queen',
        'move': [
            { 'scope': 1, 'coordinate': [1, -1] },
            { 'scope': 1, 'coordinate': [1, 1] },
            { 'scope': 1, 'coordinate': [-1, -1] },
            { 'scope': 1, 'coordinate': [-1, 1] },
            { 'scope': 1, 'coordinate': [1, 0] },
            { 'scope': 1, 'coordinate': [-1, 0] },
            { 'scope': 1, 'coordinate': [0, -1] },
            { 'scope': 1, 'coordinate': [0, 1] }
        ],
        'alias': ['bq', 'wq']
    },
    {
        'piece': 'knight',
        'move': [
            { 'scope': 0, 'coordinate': [2, 1] },
            { 'scope': 0, 'coordinate': [2, -1] },
            { 'scope': 0, 'coordinate': [1, -2] },
            { 'scope': 0, 'coordinate': [1, 2] },
            { 'scope': 0, 'coordinate': [-1, -2] },
            { 'scope': 0, 'coordinate': [-1, 2] },
            { 'scope': 0, 'coordinate': [-2, -1] },
            { 'scope': 0, 'coordinate': [-2, 1] }
        ],
        'alias': ['bn', 'wn']
    },
    {
        'piece': 'king',
        'move': [
            { 'scope': 0, 'coordinate': [1, 1] },
            { 'scope': 0, 'coordinate': [1, 0] },
            { 'scope': 0, 'coordinate': [1, -1] },
            { 'scope': 0, 'coordinate': [0, -1] },
            { 'scope': 0, 'coordinate': [0, 1] },
            { 'scope': 0, 'coordinate': [-1, -1] },
            { 'scope': 0, 'coordinate': [-1, 0] },
            { 'scope': 0, 'coordinate': [-1, 1] }
        ],
        'alias': ['bk', 'wk']
    },
    {
        'piece': 'pawn',
        'move': [
            { 'scope': 0, 'coordinate': [1, 0] },
            { 'scope': 0, 'coordinate': [2, 0] }
        ],
        'takeSpecial': [
            { 'scope': 0, 'cor': [1, -1] },
            { 'scope': 0, 'cor': [1, 1] }
        ],
        'alias': ['wp']
    },
    {
        'piece': 'pawn',
        'move': [
            { 'scope': 0, 'coordinate': [-1, 0] },
            { 'scope': 0, 'coordinate': [-2, 0] }
        ],
        'takeSpecial': [
            { 'scope': 0, 'cor': [-1, -1] },
            { 'scope': 0, 'cor': [-1, 1] }
        ],
        'alias': ['bp']
    },
]

export function calculateEssentialSize(e, bounding) {
    const xPointer = e.clientX
    const yPointer = e.clientY

    //bounding bang voi phan margin
    //can tru di de hien thi chinh xac quan co voi con tro
    const boardWidth = bounding.right - bounding.left
    const squareWidth = Math.floor(boardWidth * 12.5 / 100)

    return [xPointer, yPointer, squareWidth]
}

export function createLimit(init, min, max) {
    if (init < min) return min
    if (init > max) return max
    return init
}

export function calculateTopOrLeft(init, tol, sw) {
    return init - tol - sw / 2
}

export function identifyRowAndCol(left, top, sw) {
    return [
        Math.ceil(Math.min(8, left / sw)),
        8 - Math.ceil(Math.min(8, top / sw))
    ]
}

export function matchSquareSuggest(board, row, col, square) {
    const action = board[8 - row - 1][col - 1]?.action
    return action === "suggest" ? square : 0 
} 

export function matchSquareTaken(board, row, col, square) {
    const action = board[8 - row - 1][col - 1]?.action
    return action === "canBeTaken" ? square : 0
}

export function convertToArray(board) {
    let newArray = [];
    board.map(e => {
        newArray = [...newArray, ...e]
        return e
    })

    return newArray
}

function markCanBeTaken(board, namePiece, square, row, col) {
    if ((col < 8 && col >= 0) && 
        (row < 8 && row >= 0) &&
        board[row][col]?.type?.[0] &&
        namePiece[0] !== board[row][col]?.type?.[0]
    ) {
        board[row][col] = {
            ...board[row][col],
            'action': 'canBeTaken',
            'byObj': namePiece,
            'takeSquare': square
        }
    }
}

function markSuggest(board, square, row, col) {
    board[row][col] = {
        'action': 'suggest',
        'square': 8 * (8 - row - 1) + col + 1,
        'moveToSquare': square
    }
}

function clearMoveAndTake(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const square = board[row][col]
            if (square.action === 'suggest') {
                board[row][col] = {}
            } else if (square.action === 'canBeTaken') {
                board[row][col] = {
                    'square': square.square,
                    'type': square.type,
                    'value': square.value
                }
            }
        }
    }

    return board
}

export function displayInvalidMoveAndTake(namePiece, square, coordinate, board) {
    
    board = clearMoveAndTake(board)

    const piece = methods.find(p => p.alias.includes(namePiece))
    if (!piece) return board

    for (let k = 0; k < piece.move.length; k++) {
        const { coordinate: [dy, dx], scope } = piece.move[k]

        if (scope) {
            let row = coordinate[0] - dy;
            let col = coordinate[1] + dx;

            while (col < 8 && col >= 0 && row < 8 && row >= 0) {

                if (Object.keys(board[row][col]).length === 0) {
                    markSuggest(board, square, row, col)

                    row -= dy
                    col += dx
                } else {
                    markCanBeTaken(board, namePiece, square, row, col);
                    break
                }
            }
        }
        else {

            const row = coordinate[0] - dy;
            const col = coordinate[1] + dx;
            if ((col < 8 && col >= 0) && (row < 8 && row >= 0)) {
                if (['wp', 'bp'].includes(namePiece)) {
                    if (Object.keys(board[row][col]).length === 0) {
                        markSuggest(board,square, row, col)
                    }
                    else {
                        piece?.takeSpecial?.forEach(({ cor: [z, t] }) => {
                            markCanBeTaken(board, namePiece, square, coordinate[0] - z, coordinate[1] + t)
                        })
                        break
                    }

                    if (k < piece.move.length - 1) {
                        piece?.takeSpecial?.forEach(({ cor: [z, t] }) => {
                            markCanBeTaken(board, namePiece, square, coordinate[0] - z, coordinate[1] + t)
                        })
                    }
                }
                else {
                    if (
                        Object.keys(board[row][col]).length === 0
                    ) {
                        markSuggest(board,square, row, col)
                    }
                    else {
                        markCanBeTaken(board, namePiece, square, row, col)
                    }

                }
            }
        }
    }

    //console.log(board)

    return board
}

export function hiddenInvalidMoveAndTake(board) {
    return clearMoveAndTake(board)
}

export function copyBoardChess(board) {
    return board.map(squares => {
        return squares.map(square => ({ ...square }))
    })
}

export function copyPiecesChess(pieces) {
    return pieces.map(piece => ({
        ...piece,
        'coordinate': piece.coordinate.map(e => e)
    }))
}

export function copySquaresChess(squares) {
    return JSON.parse(JSON.stringify(squares));
}

function calRowAndCol(square) {
    return [
        square % 8 === 0 ? 
        8 - Math.floor(square / 8) :
        7 - Math.floor(square / 8),
        square % 8 === 0 ? 7 : square % 8 - 1
    ]
}

function replace(board, row, col, newRow, newCol, square) {
    board[newRow][newCol] = {
        ...board[row][col],
        'square': square
    }
    board[row][col] = {}
}

export function replacePiece(currentSquare, relocatedSquare, board, pieces) {
    const [rowCurSquare, colCurSquare] = calRowAndCol(currentSquare)
    const [rowReSquare, colReSquare] = calRowAndCol(relocatedSquare)

    //Cap nhat o co tren ban co
    replace(
        board, 
        rowCurSquare,
        colCurSquare, 
        rowReSquare, 
        colReSquare, 
        relocatedSquare
    )

    //Cap nhat trang thai, vi tri quan co
    pieces = pieces.map(piece => {
        if (piece.square === currentSquare) {
            return {
                ...piece,
                'square': relocatedSquare,
                'coordinate': [rowReSquare, colReSquare]
            }
        }
        return piece
    })

    return {
        'board': board,
        'pieces': pieces,
        'effectSquare': {
            'square': 0,
            'display': 'none'
        }
    }
}

export function capturePiece(currentSquare, takenSquare, board, pieces) {
    const [rowCurSquare, colCurSquare] = calRowAndCol(currentSquare)
    const [rowTaSquare, colTaSquare] = calRowAndCol(takenSquare)

    //Luu tru o bi an
    let tempSquare = {}
    pieces = pieces.filter(p => {
        if (p.square === takenSquare){
            tempSquare = p
            return false
        } return true
    }).map(p => {
        if (p.square === currentSquare){
            return {
                ...p,
                'square': takenSquare,
                'coordinate': tempSquare.coordinate
            }
        } return p
    })

    replace(
        board,
        rowCurSquare,
        colCurSquare,
        rowTaSquare,
        colTaSquare,
        takenSquare
    )

    return {
        'board': board,
        'pieces': pieces,
        'effectSquare': {
            'square': 0,
            'display': 'none'
        }
    }
}

