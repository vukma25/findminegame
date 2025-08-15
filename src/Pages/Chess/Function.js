
import move_sound from '../../assets/sound/move-self.mp3'
import capture_sound from '../../assets/sound/capture.mp3'
// khong export se dung noi bo trong function
const move = new Audio(move_sound)
const capture = new Audio(capture_sound)

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
        'castle': [
            //chieu quan den o duoi
            [
                { 'side': 'q', 'coordinate': [0, 2] },
                { 'side': 'k', 'coordinate': [0, -2] }
            ],

            //chieu quan trang o duoi
            [
                { 'side': 'q', 'coordinate': [0, -2] },
                { 'side': 'k', 'coordinate': [0, 2] }
            ]
        ],
        'alias': ['bk', 'wk']
    },
    {
        'piece': 'pawn',
        'move': [
            [
                { 'scope': 0, 'coordinate': [-1, 0] },
                { 'scope': 0, 'coordinate': [-2, 0] }
            ],
            [
                { 'scope': 0, 'coordinate': [1, 0] },
                { 'scope': 0, 'coordinate': [2, 0] }
            ]
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
            [
                { 'scope': 0, 'coordinate': [1, 0] },
                { 'scope': 0, 'coordinate': [2, 0] }
            ],
            [
                { 'scope': 0, 'coordinate': [-1, 0] },
                { 'scope': 0, 'coordinate': [-2, 0] }
            ]
        ],
        'takeSpecial': [
            { 'scope': 0, 'cor': [-1, -1] },
            { 'scope': 0, 'cor': [-1, 1] }
        ],
        'alias': ['bp']
    },
]

//lay vi tri con tro va kich thuoc cua o co 
export function calculateEssentialSize(e, bounding) {
    const xPointer = e.clientX
    const yPointer = e.clientY

    //bounding bang voi phan margin
    //can tru di de hien thi chinh xac quan co voi con tro
    const boardWidth = bounding.right - bounding.left
    const squareWidth = Math.floor(boardWidth * 12.5 / 100)

    return [xPointer, yPointer, squareWidth]
}

//gioi han bien ma quan co the di chuyen
export function createLimit(init, min, max) {
    if (init < min) return min
    if (init > max) return max
    return init
}

// tinh toan top left can di chuyen de quan co nam chinh giua con tro
export function calculateTopOrLeft(init, tol, sw) {
    return init - tol - sw / 2
}

//xac dinh o co thu bao nhieu
export function identifyRowAndCol(left, top, sw) {
    return [
        Math.ceil(Math.min(8, left / sw)),
        8 - Math.ceil(Math.min(8, top / sw))
    ]
}

//kiem tra o duoc cho la goi y nuoc di
export function matchSquareSuggest(board, row, col, square) {
    const action = board[8 - row - 1][col - 1]?.action
    return action === "suggest" ? square : 0
}

//kiem tra o duoc cho la se bi an
export function matchSquareTaken(board, row, col, square) {
    const action = board[8 - row - 1][col - 1]?.action
    return action === "canBeTaken" || action === "ep" ? square : 0
}

//kiem tra o co ma vua di chuyen den de nhap thanh
export function matchSquareCastle(board, row, col) {
    const action = board[8 - row - 1][col - 1]?.action
    if (action === 'castle') {
        const { curRook, reRook, square, squareKing } =
            board[8 - row - 1][col - 1]

        return [curRook, reRook, square, squareKing]
    }

    return []
}

// chuyen doi board tu mang 2D sang 1D
export function convertToArray(board) {
    let newArray = [];
    board.map(e => {
        newArray = [...newArray, ...e]
        return e
    })

    return newArray
}

function soundEffectMove() {
    move.currentTime = 0
    move.play()
}

function soundEffectCapture() {
    capture.currentTime = 0
    capture.play()
}

function findEPSquare(square, squaresEP) {
    for (let i = 0; i < squaresEP.length; i++) {
        const { sq } = squaresEP[i]
        if (sq === square) return squaresEP[i]
    }
    return null
}

// danh dau cac o goi y nuoc di
function markCanBeTaken(board, namePiece, square, row, col, squaresEP) {
    if (
        (col < 8 && col >= 0) &&
        (row < 8 && row >= 0)
    ) {

        let sq = 8 * (8 - row - 1) + col + 1
        let ep = findEPSquare(sq, squaresEP)

        if (
            board[row][col]?.type?.[0] &&
            namePiece[0] !== board[row][col]?.type?.[0]
        ) {
            board[row][col] = {
                ...board[row][col],
                'action': 'canBeTaken',
                'byPiece': namePiece,
                'takeSquare': square
            }
        }
        else if (
            ['wp', 'bp'].includes(namePiece) &&
            ep?.takeSq?.includes(square) &&
            ep && ep?.color !== namePiece[0]
        ) {
            board[row][col] = {
                'action': 'ep',
                'byPiece': namePiece,
                'takeSquare': square,
                'square': sq
            }
        }

    }
}

//danh dau ca o bi an quan
function markSuggest(board, square, namePiece, row, col) {
    board[row][col] = {
        'action': 'suggest',
        'forPiece': namePiece,
        'square': 8 * (8 - row - 1) + col + 1,
        'moveToSquare': square
    }
}

//danh dau cac o khi vua di chuyen den thi nhap thanh
function markCastle(board, squareKing, side, color, row, col, direction, piece) {
    let currentRook = 0
    let replaceRook = 0
    const square = 8 * (8 - row - 1) + col + 1

    if (direction === 1) {
        if (color === 'w') {
            if (side === 'k') {
                currentRook = 8
                replaceRook = square - 1
            } else {
                currentRook = 1
                replaceRook = square + 1
            }
        }
        else {
            if (side === 'k') {
                currentRook = 64
                replaceRook = square - 1
            } else {
                currentRook = 57
                replaceRook = square + 1
            }
        }
    }
    else {
        if (color === 'w') {
            if (side === 'k') {
                currentRook = 57
                replaceRook = square + 1
            } else {
                currentRook = 64
                replaceRook = square - 1
            }
        }
        else {
            if (side === 'k') {
                currentRook = 1
                replaceRook = square + 1
            } else {
                currentRook = 8
                replaceRook = square - 1
            }
        }
    }

    board[row][col] = {
        'action': 'castle',
        'curRook': currentRook,
        'reRook': replaceRook,
        'square': square,
        'squareKing': squareKing,
        'forPiece': piece
    }
}

//xoa cac o goi y va o an quan
function clearMoveAndTake(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const square = board[row][col]
            if (
                square.action === 'suggest' ||
                square.action === 'castle' ||
                square.action === 'ep'
            ) {
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

//tim quan co dua tren vi tri cua no
function findPiece(square, pieces) {
    return pieces.find(p => p.square === square)
}

//kiem tra o ben trai co la tot cua doi phuong hay khon --> ap dung cho bat tot qua duong
function matchLeftSquareIsPawn(color, square, board) {
    const squareLeftSide = square - 1
    const [r, c] = calRowAndCol(squareLeftSide)
    if (board[r][c]?.type?.[1] === 'p' && color !== board[r][c]?.type?.[0]) {
        return true
    } else return false
}

//tuong tu nhu matchLeftSquareIsPawn
function matchRightSquareIsPawn(color, square, board) {
    const squareRightSide = square + 1
    const [r, c] = calRowAndCol(squareRightSide)
    if (board[r][c]?.type?.[1] === 'p' && color !== board[r][c]?.type?.[0]) {
        return true
    } else return false
}

//kiem tra co the bat tot qua duong
function isEnPassant(color, square, board) {
    const [_, col] = calRowAndCol(square)

    if (col === 0) {
        return matchRightSquareIsPawn(color, square, board)
    }
    else if (col === 7) {
        return matchLeftSquareIsPawn(color, square, board)
    }
    else {
        return (
            matchRightSquareIsPawn(color, square, board) ||
            matchLeftSquareIsPawn(color, square, board)
        )
    }
}

function allowEnPassant(step, reSquare, piece, board) {
    if (step === 2 && isEnPassant(piece[0], reSquare, board)) {
        const squareEP = reSquare > 32 ? reSquare + 8 : reSquare - 8
        const bySquare = []
        const [_, col] = calRowAndCol(reSquare)

        if (col === 0) {
            bySquare.push(reSquare + 1)
        } else if (col === 7) {
            bySquare.push(reSquare - 1)
        } else {
            if (matchLeftSquareIsPawn(piece[0], reSquare, board)) {
                bySquare.push(reSquare - 1)
            }
            if (matchRightSquareIsPawn(piece[0], reSquare, board)) {
                bySquare.push(reSquare + 1)
            }
        }

        return {
            'color': piece[0],
            'sq': squareEP,
            'takeSq': bySquare
        }
    }
    return null
}

//kiem tra nhap thanh canh vua
function canCastleSideKing(color, colorOpp, kingSquare, direction, attacks, board, castle) {
    for (let i = 1; i <= 2; i++) {
        const nextSquare = direction === 1 ? kingSquare + i : kingSquare - i
        const [row, col] = calRowAndCol(nextSquare)
        if ((col >= 8 || col < 0) || (row >= 8 || row < 0)) return false
        if (board[row][col]?.type) return false
        if (attacks[colorOpp].includes(nextSquare) || attacks[colorOpp].includes(kingSquare)) return false
        if (!castle[color].k) return false
    }
    return true
}

//kiem tra nhap thanh canh hau
function canCastleSideQueen(color, colorOpp, kingSquare, direction, attacks, board, castle) {
    for (let i = 1; i <= 3; i++) {
        const nextSquare = direction === 1 ? kingSquare - i : kingSquare + i
        const [row, col] = calRowAndCol(nextSquare)
        if ((col >= 8 || col < 0) || (row >= 8 || row < 0)) return false
        if (board[row][col]?.type) return false
        if (attacks[colorOpp].includes(nextSquare) || attacks[colorOpp].includes(kingSquare)) return false
        if (!castle[color].q) {
            return false
        }
    }
    return true
}

//kiem tra co the nhap thanh
function canCastle(color, side, kingSquare, direction, attacks, board, castle) {

    const colorOpp = color === 'w' ? 'b' : 'w'
    //1 la quan trang nam phia duoi, 0 la quan trang nam phia tren
    if (color === 'w') {
        if (side === 'k') {
            return canCastleSideKing(color, colorOpp, kingSquare, direction, attacks, board, castle)
        } else {
            return canCastleSideQueen(color, colorOpp, kingSquare, direction, attacks, board, castle)
        }
    }
    else {
        if (side === 'k') {
            return canCastleSideKing(color, colorOpp, kingSquare, direction, attacks, board, castle)
        } else {
            return canCastleSideQueen(color, colorOpp, kingSquare, direction, attacks, board, castle)
        }
    }
}

function checkSquareIsPinned(square, pins) {
    return pins.find(sq => sq.square === square)
}

function absolutePinned(move, direction) {
    for (const { coordinate } of move) {
        if (
            JSON.stringify(coordinate) === JSON.stringify(direction)
        ) return true
    }
    return false
}

//direction o day la huong di chuyen cua quan co, khac voi direction la phuong cua ban co
function modifyMethods(piece, direction) {
    const methodOfPiece = methods.find(p => p.alias.includes(piece))
    if (['wp', 'bp'].includes(piece)) {
        if (isDiagonal(direction)) {
            return {
                'piece': methodOfPiece.piece,
                'move': [[], []],
                'takeSpecial': [
                    { 'scope': 0, 'cor': [direction[0], direction[1]] }
                ],
                'alias': methodOfPiece.alias
            }
        } if (isStraight(direction)) {
            return {
                'piece': methodOfPiece.piece,
                'move': methodOfPiece.move,
                'takeSpecial': [],
                'alias': methodOfPiece.alias
            }
        }
    }
    if (['wn', 'bn'].includes(piece)) {
        return {
            'piece': methodOfPiece.piece,
            'move': [],
            'alias': methodOfPiece.alias
        }
    }
    if (absolutePinned(methodOfPiece.move, direction)) {
        return {
            'piece': methodOfPiece.piece,
            'move': [
                { 'scope': 1, 'coordinate': [direction[0], direction[1]] },
                { 'scope': 1, 'coordinate': [-direction[0], -direction[1]] }
            ],
            'alias': methodOfPiece.alias
        }
    }
    return methodOfPiece
}

//hien thi cac nuoc di va cac quan co the an
export function displayInvalidMoveAndTake(namePiece, square, coordinate, board, pieces, attacks, protects, direction, castle, squaresEP, pins) {

    board = clearMoveAndTake(board)
    const pi = findPiece(square, pieces)
    const [rowK, colK] = kingSquare(namePiece[0] + 'k', board)
    if (pi.ban) return board
    if (
        pi.allowMove.move.length !== 0 ||
        pi.allowMove.take.length !== 0
    ) {
        pi.allowMove.move.forEach(sq => {
            const [row, col] = calRowAndCol(sq)
            markSuggest(board, square, namePiece, row, col)
        })
        pi.allowMove.take.forEach(sq => {
            const [row, col] = calRowAndCol(sq)
            markCanBeTaken(board, namePiece, square, row, col, squaresEP)
        })

        return board
    }
    if (
        attacks[namePiece[0] === 'w' ? 'b' : 'w'].includes(8 * (7 - rowK) + colK + 1) &&
        namePiece[1] !== 'k'
    ) {
        return board
    }


    const squarePinned = checkSquareIsPinned(square, pins)
    let piece

    if (squarePinned) {
        piece = modifyMethods(namePiece, squarePinned.direction)
    } else {
        piece = methods.find(p => p.alias.includes(namePiece))
    }

    if (!piece) return board

    const move = Array.isArray(piece.move[0]) ? piece.move[direction] : piece.move

    for (let k = 0; k < move.length; k++) {
        const { coordinate: [dy, dx], scope } = move[k]
        let row = coordinate[0] - dy;
        let col = coordinate[1] + dx;

        if (scope) {

            while (col < 8 && col >= 0 && row < 8 && row >= 0) {

                if (Object.keys(board[row][col]).length === 0 || board[row][col]?.action === 'ep') {
                    markSuggest(board, square, namePiece, row, col)

                    row -= dy
                    col += dx
                } else {
                    markCanBeTaken(board, namePiece, square, row, col, squaresEP);
                    break
                }
            }
        }
        else {
            if ((col < 8 && col >= 0) && (row < 8 && row >= 0)) {

                //ap dung voi quan tot
                if (['wp', 'bp'].includes(namePiece)) {
                    // hien thi cac o co the di
                    if (
                        Object.keys(board[row][col]).length === 0
                    ) {
                        markSuggest(board, square, namePiece, row, col)
                        if (pi.deploy) {
                            break
                        }
                    } else break
                }

                else if (['wk', 'bk'].includes(namePiece)) {
                    const king = namePiece[0] === 'w' ? 'b' : 'w'

                    if (attacks[king].includes(8 * (8 - row - 1) + col + 1) ||
                        protects[king].includes(8 * (8 - row - 1) + col + 1)
                    ) continue

                    else {
                        if (
                            Object.keys(board[row][col]).length === 0
                        ) {
                            markSuggest(board, square, namePiece, row, col)
                        }
                        else {
                            markCanBeTaken(board, namePiece, square, row, col, squaresEP)
                        }
                    }

                    if ((castle[namePiece[0]].k || castle[namePiece[0]].q) && (row === 0 || row === 7)) {
                        piece.castle[direction].forEach(({ side, coordinate: [y, x] }) => {
                            if (canCastle(namePiece[0], side, square, direction, attacks, board, castle)) {
                                markCastle(
                                    board,
                                    square,
                                    side,
                                    namePiece[0],
                                    coordinate[0] - y,
                                    coordinate[1] + x,
                                    direction,
                                    namePiece
                                )
                            }
                        })
                    }
                }

                //quan co con lai nhu ma
                else {
                    if (
                        Object.keys(board[row][col]).length === 0
                    ) {
                        markSuggest(board, square, namePiece, row, col)
                    }
                    else {
                        markCanBeTaken(board, namePiece, square, row, col, squaresEP)
                    }
                }
            }
        }
    }
    if (['wp', 'bp'].includes(namePiece)) {
        piece.takeSpecial.forEach(({ cor: [z, t] }) => {
            markCanBeTaken(board, namePiece, square, coordinate[0] - z, coordinate[1] + t, squaresEP)
        })
    }

    return board
}

//xoa cac o goi y va an quan
export function hiddenInvalidMoveAndTake(board) {
    return clearMoveAndTake(board)
}

//sao chep sau lai board
export function copyBoardChess(board) {
    return board.map(squares => {
        return squares.map(square => ({ ...square }))
    })
}

//sao chep sau lai pieces
export function copyPiecesChess(pieces) {
    return pieces.map(piece => ({
        ...piece,
        'coordinate': piece.coordinate.map(e => e)
    }))
}

//sao chep sau lai square
export function copySquaresChess(squares) {
    return JSON.parse(JSON.stringify(squares));
}

export function copyMoves(moves) {
    return moves.map(move => ({ ...move }))
}
//sao chep lai squareEP
function copySquaresEPChess(squaresEP) {
    return squaresEP.map(p => ({
        ...p,
        'takeSq': [...p.takeSq]
    }))
}

//tinh toan hang, cot dua tren vi tri o
function calRowAndCol(square) {
    return [
        square % 8 === 0 ?
            8 - Math.floor(square / 8) :
            7 - Math.floor(square / 8),
        square % 8 === 0 ? 7 : square % 8 - 1
    ]
}

//hoan doi 2 o
function replace(board, row, col, newRow, newCol, square) {
    board[newRow][newCol] = {
        ...board[row][col],
        'square': square
    }
    board[row][col] = {}
}

//xac dinh cac o tan cong va bao ve cua mot quan co
function pieceAttackOrProtectPieces(piece, coor, board, direction) {
    const methodOfPiece = methods.find(p => p.alias.includes(piece))
    const [y, x] = coor
    const squareBeAttacked = []
    const squareBeProtected = []
    const move = Array.isArray(methodOfPiece.move[0]) ?
        methodOfPiece.move[direction] :
        methodOfPiece.move

    for (const { coordinate: [dy, dx], scope } of move) {
        let row = y - dy;
        let col = x + dx;
        let square = 8 * (8 - row - 1) + col + 1

        if (scope) {
            while (col < 8 && col >= 0 && row < 8 && row >= 0) {
                if (Object.keys(board[row][col]).length === 0 ||
                    (['wk', 'bk'].includes(board[row][col]?.type) && piece[0] !== board[row][col]?.type[0])
                ) {
                    squareBeAttacked.push(JSON.stringify({
                        'type': piece[0],
                        'sp': square
                    }))

                    row -= dy
                    col += dx
                    square = 8 * (8 - row - 1) + col + 1
                } else {
                    if (piece[0] !== board[row][col]?.type[0]) {
                        squareBeAttacked.push(JSON.stringify({
                            'type': piece[0],
                            'sp': square
                        }))

                    } else {
                        squareBeProtected.push(JSON.stringify({
                            'type': piece[0],
                            'sp': square
                        }))
                    }
                    break
                }
            }
        } else {
            if (['wp', 'bp'].includes(piece)) {
                methodOfPiece.takeSpecial.forEach(({ cor: [z, t] }) => {
                    let row = y - z;
                    let col = x + t;
                    const square = 8 * (8 - row - 1) + col + 1
                    if (col < 8 && col >= 0 && row < 8 && row >= 0) {
                        if (Object.keys(board[row][col]).length === 0) {
                            squareBeAttacked.push(JSON.stringify({
                                'type': piece[0],
                                'sp': square
                            }))
                        } else {
                            if (piece[0] !== board[row][col]?.type[0]) {
                                squareBeAttacked.push(JSON.stringify({
                                    'type': piece[0],
                                    'sp': square
                                }))
                            } else {
                                squareBeProtected.push(JSON.stringify({
                                    'type': piece[0],
                                    'sp': square
                                }))
                            }
                        }
                    }
                })
                break
            } else {
                if (col < 8 && col >= 0 && row < 8 && row >= 0) {
                    if (Object.keys(board[row][col]).length === 0) {
                        squareBeAttacked.push(JSON.stringify({
                            'type': piece[0],
                            'sp': square
                        }))
                    } else {
                        if (piece[0] !== board[row][col]?.type[0]) {
                            squareBeAttacked.push(JSON.stringify({
                                'type': piece[0],
                                'sp': square
                            }))
                        } else {
                            squareBeProtected.push(JSON.stringify({
                                'type': piece[0],
                                'sp': square
                            }))
                        }
                    }
                }
            }
        }
    }

    return {
        'attacks': squareBeAttacked,
        'protects': squareBeProtected
    }
}

//xac dinh tat ca cac o bao ve va tan cong cua ca hai ben - den va trang
function matchAllSquareBeAttackedOrBeProtected(board, pieces, direction) {
    let squaresBeAttacked = []
    let squaresBeProtected = []

    pieces.forEach(({ piece, coordinate }) => {
        squaresBeAttacked = [...new Set(squaresBeAttacked.concat(
            pieceAttackOrProtectPieces(piece, coordinate, board, direction).attacks
        ))]
        squaresBeProtected = [...new Set(squaresBeProtected.concat(
            pieceAttackOrProtectPieces(piece, coordinate, board, direction).protects
        ))]
    })

    const attacks = {
        'w': squaresBeAttacked.map((e) => {
            const { type, sp } = JSON.parse(e)
            if (type === 'w') return sp
            return null
        }).filter(p => p),
        'b': squaresBeAttacked.map((e) => {
            const { type, sp } = JSON.parse(e)
            if (type === 'b') return sp
            return null
        }).filter(p => p)
    }
    const protects = {
        'w': squaresBeProtected.map((e) => {
            const { type, sp } = JSON.parse(e)
            if (type === 'w') return sp
            return null
        }).filter(p => p),
        'b': squaresBeProtected.map((e) => {
            const { type, sp } = JSON.parse(e)
            if (type === 'b') return sp
            return null
        }).filter(p => p)
    }

    return {
        'attacks': attacks,
        'protects': protects
    }
}

//mat nhap thanh canh vua
function disableCastleSideKing(square, direction, canCastle) {
    if (direction === 1) {
        if (square === 8) { //white
            return {
                ...canCastle,
                'w': {
                    'k': false,
                    'q': canCastle.w.q
                }
            }
        } return { // square 64
            ...canCastle,
            'b': {
                'k': false,
                'q': canCastle.b.q
            }
        }
    } else {
        if (square === 1) { // black
            return {
                ...canCastle,
                'b': {
                    'k': false,
                    'q': canCastle.b.q
                }
            }
        } return {
            ...canCastle,
            'w': {
                'k': false,
                'q': canCastle.w.q
            }
        }
    }
}

//mat nhap thanh canh hau
function disableCastleSideQueen(square, direction, canCastle) {
    if (direction === 1) {
        if (square === 1) {
            return {
                ...canCastle,
                'w': {
                    'k': canCastle.w.k,
                    'q': false
                }
            }
        } return { // square 57
            ...canCastle,
            'b': {
                'k': canCastle.b.k,
                'q': false
            }
        }
    } else {
        if (square === 64) {
            return {
                ...canCastle,
                'w': {
                    'k': canCastle.w.k,
                    'q': false
                }
            }
        } return { // square 8
            ...canCastle,
            'b': {
                'k': canCastle.b.k,
                'q': false
            }
        }
    }
}

//mat nhap thanh
function disableCastle(piece, square, takenSquare, direction, canCastle) {
    let castle = canCastle

    if (['wk', 'bk'].includes(piece)) {
        if (piece[0] === 'w') {
            return {
                ...canCastle,
                'w': {
                    'k': false,
                    'q': false
                }
            }
        }
        return {
            ...canCastle,
            'b': {
                'k': false,
                'q': false
            }
        }
    } else if (['wr', 'br'].includes(piece)) {
        const color = piece[0]
        if (color === 'w') {
            if (takenSquare === 57 || takenSquare === 8) castle = disableCastleSideQueen(takenSquare, direction, castle)
            if (takenSquare === 1 || takenSquare === 64) castle = disableCastleSideKing(takenSquare, direction, castle)
            if (
                (square === 8 && direction === 1) ||
                (square === 57 && direction === 0)
            ) {
                castle = disableCastleSideKing(square, direction, castle)
            }
            if (
                (square === 1 && direction === 1) ||
                (square === 64 && direction === 0)
            ) {
                castle = disableCastleSideQueen(square, direction, castle)
            }
        } else {
            if (takenSquare === 1 || takenSquare === 64) castle = disableCastleSideQueen(takenSquare, direction, castle)
            if (takenSquare === 8 || takenSquare === 57) castle = disableCastleSideKing(takenSquare, direction, castle)
            if (
                (square === 8 && direction === 0) ||
                (square === 57 && direction === 1)
            ) {
                castle = disableCastleSideQueen(square, direction, castle)
            }
            if (
                (square === 1 && direction === 0) ||
                (square === 64 && direction === 1)
            ) {
                castle = disableCastleSideKing(square, direction, castle)
            }
        }
    } else {
        const color = piece[0]
        if (color === 'w') {
            if (takenSquare === 57 || takenSquare === 8) castle = disableCastleSideQueen(takenSquare, direction, canCastle)
            else if (takenSquare === 1 || takenSquare === 64) castle = disableCastleSideKing(takenSquare, direction, canCastle)
        } else {
            if (takenSquare === 1 || takenSquare === 64) castle = disableCastleSideQueen(takenSquare, direction, canCastle)
            else if (takenSquare === 8 || takenSquare === 57) castle = disableCastleSideKing(takenSquare, direction, canCastle)
        }
    }

    return castle
}

function matchAllSquareEP(step, relocatedSquare, piece, squaresEP, board) {
    let copySquaresEP = copySquaresEPChess(squaresEP)
    if (['wp', 'bp'].includes(piece)) {
        const newSquareEP = allowEnPassant(
            step,
            relocatedSquare,
            piece,
            board
        )

        if (newSquareEP) {
            return [newSquareEP]
        }
    }

    if (copySquaresEP.length === 0) {
        return copySquaresEP
    } else return []
}

function kingSquare(type, board) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j]?.type === type) {
                return [i, j]
            }
        }
    }
}

function isDiagonal(coordinate) {
    return Math.abs(coordinate[0]) === Math.abs(coordinate[1])
}

function isStraight(coordinate) {
    return coordinate[0] === 0 || coordinate[1] === 0
}

function matchAllSquaresBePinned(board) {
    const king = methods.find(k => k.piece === 'king')
    const pins = []

    for (const typeOfKing of king.alias) {
        const [rowKing, colKing] = kingSquare(typeOfKing, board)

        for (const { coordinate: [dy, dx] } of king.move) {
            let squarePinned = null
            let newRow = rowKing
            let newCol = colKing

            for (let step = 1; step < 8; step++) {
                newRow -= dy
                newCol += dx

                if (newCol >= 8 || newCol < 0 || newRow >= 8 || newRow < 0) break

                if (!board[newRow][newCol]?.type) continue

                if (board[newRow][newCol].type[0] === typeOfKing[0]) {
                    if (squarePinned === null) {
                        squarePinned = {
                            'square': 8 * (8 - newRow - 1) + newCol + 1,
                            'direction': [dy, dx]
                        }
                    } else {
                        break
                    }
                } else {
                    if (squarePinned) {
                        if (
                            board[newRow][newCol].type[1] === 'q' ||
                            (board[newRow][newCol].type[1] === 'r' && isStraight(squarePinned.direction)) ||
                            (board[newRow][newCol].type[1] === 'b' && isDiagonal(squarePinned.direction))
                        ) {
                            pins.push(squarePinned)
                        } else break
                    }
                }
            }
        }
    }
    return pins
}

function replaceAction(rowReSquare, colReSquare, currentSquare, relocatedSquare, pieces) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].square === currentSquare && ['wp', 'bp'].includes(pieces[i].piece)) {
            pieces[i] = {
                'id': pieces[i].id,
                'piece': pieces[i].piece,
                'square': relocatedSquare,
                'coordinate': [rowReSquare, colReSquare],
                'allowMove': {
                    'move': pieces[i].allowMove.move.map(p => p),
                    'take': pieces[i].allowMove.take.map(p => p)
                },
                'ban': pieces[i].ban,
                'deploy': true
            }
        } else if (pieces[i].square === currentSquare) {
            pieces[i] = {
                'id': pieces[i].id,
                'piece': pieces[i].piece,
                'square': relocatedSquare,
                'coordinate': [rowReSquare, colReSquare],
                'allowMove': {
                    'move': pieces[i].allowMove.move.map(p => p),
                    'take': pieces[i].allowMove.take.map(p => p)
                },
                'ban': pieces[i].ban,
            }
        }
    }
}

function captureAction(takenSquare, pieces) {
    return pieces.filter(p => {
        if (p.square === takenSquare) {
            return false
        } return true
    })
}

//di chuyen quan co den vi tri moi
export function replacePiece(
    currentSquare,
    relocatedSquare,
    board,
    pieces,
    piece,
    turn,
    direction,
    canCastle,
    squaresEP,
    moves,
    bout,
    isCastle = false
) {
    if (piece[0] === turn) {
        soundEffectMove()

        const [rowCurSquare, colCurSquare] = calRowAndCol(currentSquare)
        const [rowReSquare, colReSquare] = calRowAndCol(relocatedSquare)

        //cap nhat lai luot
        turn = piece[0] === 'w' ? 'b' : 'w'
        //============================================================================================

        //cap nhat ca vi tri co the bat tot qua duong
        const copySquaresEP = matchAllSquareEP(Math.abs(rowReSquare - rowCurSquare), relocatedSquare, piece, squaresEP, board)
        //============================================================================================

        //co the nhap thanh hay da mat nhap thanh
        const copyCanCastle = {
            'w': {
                'k': canCastle.w.k,
                'q': canCastle.w.q
            },
            'b': {
                'k': canCastle.b.k,
                'q': canCastle.b.q
            }
        }
        const castle = disableCastle(piece, currentSquare, 0, direction, copyCanCastle)
        //============================================================================================

        //Cap nhat o co tren ban co
        replace(
            board,
            rowCurSquare,
            colCurSquare,
            rowReSquare,
            colReSquare,
            relocatedSquare
        )
        //============================================================================================

        //Cap nhat trang thai, vi tri quan co
        //template piece 
        // {
        //     'id': 23,
        //     'piece': 'wp',
        //     'square': 15,
        //     'coordinate': [6, 6],
        //     'deploy': false
        // }
        replaceAction(rowReSquare, colReSquare, currentSquare, relocatedSquare, pieces)
        const { attacks, protects } = matchAllSquareBeAttackedOrBeProtected(board, pieces, direction)
        const pins = matchAllSquaresBePinned(board)
        justAllowMove(turn, direction, pieces, board)
        const hasCheckmate = checkmate(turn, attacks, protects, pieces, board)

        //vi nhap thanh va 2 lan di chuyen quan phai gioi han de chi xuat ra 1 nuoc di
        if (isCastle && piece[1] === 'r') {
            return {
                'board': board,
                'pieces': pieces,
                'turn': turn,
                'attacks': attacks,
                'protects': protects,
                'canCastle': castle,
                'squaresEP': copySquaresEP,
                'pins': pins,
                'hasCheckmate': hasCheckmate
            }
        }
        //============================================================================

        //show ra nuoc di tren movelist
        let typeMove = 'replace'
        if (!copyCanCastle[piece[0]].k && isCastle) {
            typeMove = 'castleSideKing'
        } else if (!copyCanCastle[piece[0]].q && isCastle) {
            typeMove = 'castleSideQueen'
        }

        let newBout = bout
        const move = generateMove(
            typeMove,
            direction,
            kingDanger(turn, attacks, board),
            hasCheckmate.checkmate,
            relocatedSquare
        )

        if (moves?.[bout - 1]) {
            moves[bout - 1] = {
                ...moves[bout - 1],
                'black': {
                    move,
                    piece
                }
            }
            newBout += 1
        } else {
            moves.push({
                'turn': bout,
                'white': {
                    move,
                    piece
                }
            })
        }
        //==============================================================================

        const FEN = generateFENString(
            direction,
            calculateFiftyRule(moves),
            newBout,
            turn,
            copySquaresEP,
            castle,
            board
        )

        return {
            'board': board,
            'pieces': pieces,
            'turn': turn,
            'sound': 'm',
            'attacks': attacks,
            'protects': protects,
            'canCastle': castle,
            'squaresEP': copySquaresEP,
            'pins': pins,
            'hasCheckmate': hasCheckmate,
            'moves': moves,
            'bout': newBout,
            'fen': FEN
        }

        //============================================================================================
    }

    return {
        'board': board,
        'pieces': pieces,
        'turn': turn
    }
}

//gam giong voi replacePiece, cung di chuyen quan co den vi tri moi, nhung quan co cu o vi tri moi do se bien mat --> an quan
export function capturePiece(
    currentSquare,
    takenSquare,
    board,
    pieces,
    piece,
    turn,
    direction,
    canCastle,
    squaresEP,
    moves,
    bout) {

    if (piece[0] === turn) {
        soundEffectCapture()

        turn = piece[0] === 'w' ? 'b' : 'w'

        const [rowCurSquare, colCurSquare] = calRowAndCol(currentSquare)
        const [rowTaSquare, colTaSquare] = calRowAndCol(takenSquare)

        const copyCanCastle = {
            'w': {
                'k': canCastle.w.k,
                'q': canCastle.w.q
            },
            'b': {
                'k': canCastle.b.k,
                'q': canCastle.b.q
            }
        }
        const castle = disableCastle(piece, currentSquare, takenSquare, direction, copyCanCastle)

        let newPieces = pieces
        //nuoc an quan bat tot qua duong
        if (
            ['wp', 'bp'].includes(piece) &&
            squaresEP.length !== 0
        ) {
            if (
                squaresEP[0].takeSq.includes(currentSquare) &&
                squaresEP[0].sq === takenSquare
            ) {
                const newTakenSquare = takenSquare > 32 ? takenSquare - 8 : takenSquare + 8
                const [row, col] = calRowAndCol(newTakenSquare)
                board[row][col] = {}

                newPieces = captureAction(newTakenSquare, pieces)
                replaceAction(rowTaSquare, colTaSquare, currentSquare, takenSquare, newPieces)
            } else {
                newPieces = captureAction(takenSquare, pieces)
                replaceAction(rowTaSquare, colTaSquare, currentSquare, takenSquare, newPieces)
            }
        } else {
            //nuoc an quan binh thuong
            newPieces = captureAction(takenSquare, pieces)
            replaceAction(rowTaSquare, colTaSquare, currentSquare, takenSquare, newPieces)
        }

        replace(
            board,
            rowCurSquare,
            colCurSquare,
            rowTaSquare,
            colTaSquare,
            takenSquare
        )

        const { attacks, protects } = matchAllSquareBeAttackedOrBeProtected(board, newPieces, direction)
        const pins = matchAllSquaresBePinned(board)
        justAllowMove(turn, direction, newPieces, board)
        const hasCheckmate = checkmate(turn, attacks, protects, newPieces, board)

        let newBout = bout
        const move = generateMove(
            'capture',
            direction,
            kingDanger(turn, attacks, board),
            hasCheckmate.checkmate,
            takenSquare,
            currentSquare
        )

        if (moves?.[bout - 1]) {
            moves[bout - 1] = {
                ...moves[bout - 1],
                'black': {
                    move,
                    piece
                }
            }
            newBout += 1
        } else {
            moves.push({
                'turn': bout,
                'white': {
                    move,
                    piece
                }
            })
        }

        const FEN = generateFENString(
            direction,
            calculateFiftyRule(moves),
            newBout,
            turn,
            squaresEP,
            castle,
            board
        )


        return {
            'board': board,
            'pieces': newPieces,
            'turn': turn,
            'sound': 'c',
            'attacks': attacks,
            'protects': protects,
            'canCastle': castle,
            'squaresEP': squaresEP,
            'pins': pins,
            'hasCheckmate': hasCheckmate,
            'moves': moves,
            'bout': newBout,
            'fen': FEN
        }
    }

    return {
        'board': board,
        'pieces': pieces,
        'turn': turn
    }
}

export function isPawnPromotion(piece, row, direction) {
    return (
        (piece === 'wp' && row === 0 && direction === 1) ||
        (piece === 'wp' && row === 7 && direction === 0) ||
        (piece === 'bp' && row === 0 && direction === 0) ||
        (piece === 'bp' && row === 7 && direction === 1)
    )
}

export function pawnPromotionByReplaceOrCapture(replace, capture) {
    if (replace !== 0) {
        const [row, _] = calRowAndCol(replace)
        return [row, replace, { 'action': 'replace' }]
    } else if (capture !== 0) {
        const [row, _] = calRowAndCol(capture)
        return [row, capture, { 'action': 'capture' }]
    } return [-1, -1, {}]
}

export function listPawnCanBecome(piece, square, reSquare, action, row) {
    const color = piece[0]
    const queen = color + 'q'
    const rook = color + 'r'
    const bishop = color + 'b'
    const knight = color + 'n'

    if (row === 0) {
        return [
            {
                'type': queen,
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare
            },
            {
                'type': rook,
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare - 8
            },
            {
                'type': bishop,
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare - 16
            },
            {
                'type': knight,
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare - 24
            },
            {
                'type': 'cancelPromotion',
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare - 32
            }
        ]
    } else if (row === 7) {
        return [
            {
                'type': queen,
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare
            },
            {
                'type': rook,
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare + 8
            },
            {
                'type': bishop,
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare + 16
            },
            {
                'type': knight,
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare + 24
            },
            {
                'type': 'cancelPromotion',
                'action': action,
                'curSquare': square,
                'reSquare': reSquare,
                'location': reSquare + 32
            }
        ]
    } else return []
}

export function fillColor(square) {
    const [i, j] = calRowAndCol(square)
    if (
        (i % 2 === 0 && j % 2 === 0) ||
        (i % 2 === 1 && j % 2 === 1)
    ) return 'bg-purple'
    return 'bg-white'
}

export function modifyMaterial(pieces, square, type) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].square === square) {
            pieces[i].piece = type
            break
        }
    }
}

export function modifyBoard(board, square, type) {
    const [row, col] = calRowAndCol(square)
    board[row][col] = {
        ...board[row][col],
        'type': type
    }
}

function getAllAttackSquareOfPiece(piece, square, board) {
    const methodOfPiece = methods.find(p => p.alias.includes(piece))
    const squares = []
    const [row, col] = calRowAndCol(square)

    if (['wp', 'bp'].includes(piece)) {
        methodOfPiece.takeSpecial.forEach(({ cor: [dy, dx] }) => {
            const newRow = row - dy
            const newCol = col + dx
            if ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {
                if (
                    board[newRow][newCol]?.type &&
                    piece[0] !== board[newRow][newCol]?.type?.[0]
                ) {
                    squares.push(8 * (8 - newRow - 1) + newCol + 1)
                }
            }
        })
    } else {
        methodOfPiece.move.forEach(({ scope, coordinate: [dy, dx] }) => {
            let newRow = row - dy
            let newCol = col + dx

            // hau, tuong, xe
            if (scope) {
                let sq = null
                while ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {

                    if (board[newRow][newCol]?.type) {
                        if (piece[0] === board[newRow][newCol].type[0]) break

                        if (
                            piece[0] !== board[newRow][newCol].type[0] &&
                            !sq
                        ) {
                            sq = 8 * (8 - newRow - 1) + newCol + 1
                            squares.push(sq)
                        } else break
                    } else {
                        newRow -= dy
                        newCol += dx
                    }
                }
            }
            // ma
            else {
                if ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {

                    if (
                        board[newRow][newCol]?.type &&
                        piece[0] !== board[newRow][newCol]?.type?.[0]
                    ) {
                        squares.push(8 * (8 - newRow - 1) + newCol + 1)
                    }
                }
            }
        })
    }

    return squares
}

function getAllMoveSquareOfPiece(piece, square, direction, board) {
    const methodOfPiece = methods.find(p => p.alias.includes(piece))
    const squares = []
    const [row, col] = calRowAndCol(square)

    if (['wp', 'bp'].includes(piece)) {
        for (const { coordinate: [dy, dx] } of methodOfPiece.move[direction]) {
            const newRow = row - dy
            const newCol = col + dx
            if ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {
                if (
                    Object.keys(board[newRow][newCol]).length === 0
                ) {
                    squares.push(8 * (8 - newRow - 1) + newCol + 1)
                }
            } else break
        }
    } else {
        for (const { scope, coordinate: [dy, dx] } of methodOfPiece.move) {
            let newRow = row - dy
            let newCol = col + dx

            // hau, tuong, xe
            if (scope) {
                while ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {
                    if (
                        Object.keys(board[newRow][newCol]).length === 0
                    ) {
                        squares.push(8 * (8 - newRow - 1) + newCol + 1)
                        newRow -= dy
                        newCol += dx
                    } else break
                }
            }
            // ma
            else {
                if ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {

                    if (
                        Object.keys(board[newRow][newCol]).length === 0
                    ) {
                        squares.push(8 * (8 - newRow - 1) + newCol + 1)
                    }
                }
            }
        }
    }

    return squares
}

function findAllPieceAttackKing(color, board) {
    const [rowK, colK] = kingSquare(color + 'k', board)
    const king = 8 * (7 - rowK) + colK + 1
    const moveOfKing = methods.find(k => k.piece === 'king')?.move
    const moveOfKnight = methods.find(k => k.piece === 'knight')?.move
    const moves = [...moveOfKing, ...moveOfKnight]
    const attackers = []

    moves.forEach(({ coordinate: [dy, dx] }) => {
        let newRow = rowK - dy
        let newCol = colK + dx

        while ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {
            if (
                board[newRow][newCol]?.type &&
                board[newRow][newCol]?.type?.[0] !== color
            ) {
                if (getAllAttackSquareOfPiece(
                    board[newRow][newCol].type,
                    board[newRow][newCol].square,
                    board
                ).includes(king)) {
                    attackers.push({
                        'piece': board[newRow][newCol].type,
                        'square': 8 * (7 - newRow) + newCol + 1
                    })
                }
                break
            }
            else if (
                board[newRow][newCol]?.type &&
                board[newRow][newCol]?.type?.[0] === color
            ) { break }
            else {
                newRow -= dy
                newCol += dx
            }
        }
    })

    return attackers
}

function findAllSquareFromKingToCheck(color, attacker, board) {
    let squares = [];
    const [rowK, colK] = kingSquare(color + 'k', board)
    const [rowA, colA] = calRowAndCol(attacker.square)

    if (attacker.piece[1] !== 'n') {

        const dy = Math.sign(rowA - rowK)
        const dx = Math.sign(colA - colK)

        let newRow = rowK + dy
        let newCol = colK + dx

        while (newRow !== rowA || newCol !== colA) {
            squares.push(8 * (7 - newRow) + newCol + 1)
            newRow += dy
            newCol += dx
        }
    }

    return squares;
}

function justAllowMove(color, direction, pieces, board) {
    const attackers = findAllPieceAttackKing(color, board)

    if (attackers.length > 2) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].piece[0] === color && pieces[i].piece[1] !== 'k') pieces[i].ban = true
        }
    }
    else if (attackers.length === 1) {
        const path = findAllSquareFromKingToCheck(color, attackers[0], board)
        for (let i = 0; i < pieces.length; i++) {
            const { piece, square } = pieces[i]
            if (piece[0] === color && piece[1] !== 'k') {
                let moves = getAllMoveSquareOfPiece(piece, square, direction, board)
                let takes = getAllAttackSquareOfPiece(piece, square, board)

                moves = moves.filter(move => path.includes(move))
                takes = takes.filter(take => take === attackers[0].square)

                pieces[i].allowMove = {
                    'move': moves,
                    'take': takes
                }
            }
        }
    }
    else {
        for (let i = 0; i < pieces.length; i++) {
            pieces[i].ban = false
            pieces[i].allowMove = {
                'move': [],
                'take': []
            }
        }
    }
}

function checkmate(color, attacks, protects, pieces, board) {
    const colorOpp = color === 'w' ? 'b' : 'w'
    const [rowK, colK] = kingSquare(color + 'k', board)
    const squareKing = 8 * (7 - rowK) + colK + 1
    const king = methods.find(k => k.piece === 'king')
    const invalidMoveOfKing = king.move.map(({ coordinate: [dy, dx] }) => {
        const newRow = rowK - dy
        const newCol = colK + dx
        const newSquare = 8 * (7 - newRow) + newCol + 1

        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) return 0

        if (
            board[newRow][newCol]?.type?.[0] === color ||
            (board[newRow][newCol]?.type?.[0] !== color &&
                protects[colorOpp].includes(newSquare))
        ) return 0
        if (attacks[colorOpp].includes(newSquare)) return 0
        return newSquare
    }).filter(sq => sq)

    const noAnyInvalidMove = invalidMoveOfKing.length === 0
    const kingDanger = attacks[colorOpp].includes(squareKing)
    const noPreventCheckByPiece = pieces.filter(piece => {
        return (
            piece.piece[0] === color &&
            (piece.allowMove.move.length !== 0 ||
                piece.allowMove.take.length !== 0)
        )
    })

    if (noAnyInvalidMove && kingDanger && noPreventCheckByPiece.length === 0) return {
        'checkmate': true,
        'by': colorOpp
    }
    return {
        'checkmate': false,
        'by': ''
    }

}

function kingDanger(color, attacks, board) {
    const [r, c] = kingSquare(color + 'k', board)
    return attacks[color === 'w' ? 'b' : 'w'].includes(8 * (7 - r) + c + 1)
}

function generateMove(typeMove, direction, kingthreat, checkmate, reSquare, curSquare = 0) {
    let strMove = ''

    const coordinate = [
        {
            'col': ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
            'row': ['1', '2', '3', '4', '5', '6', '7', '8']
        },
        {
            'col': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            'row': ['8', '7', '6', '5', '4', '3', '2', '1']
        }
    ]
    const [_, cc] = calRowAndCol(curSquare)
    const [rr, rc] = calRowAndCol(reSquare)

    if (typeMove === 'castleSideKing') {
        strMove += 'O-O'
    } else if (typeMove === 'castleSideQueen') {
        strMove += 'O-O-O'
    } else if (typeMove === 'replace') {
        strMove += coordinate[direction].col[rc] + coordinate[direction].row[rr]
    } else {
        strMove += (
            coordinate[direction].col[cc] +
            'x' +
            coordinate[direction].col[rc] +
            coordinate[direction].row[rr]
        )
    }

    if (checkmate) {
        strMove += '#'
        return strMove
    }
    if (kingthreat) {
        strMove += '+'
    }
    return strMove
}

function identifyCoordinate(square, direction) {
    if (!square?.[0]?.sq) return '-'

    const coordinate = [
        {
            'col': ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
            'row': ['1', '2', '3', '4', '5', '6', '7', '8']
        },
        {
            'col': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            'row': ['8', '7', '6', '5', '4', '3', '2', '1']
        }
    ]
    const [row, col] = calRowAndCol(square[0].sq)
    return (
        coordinate[direction].col[col] + coordinate[direction].row[row]
    )
}

function generateCastleString(castle) {
    let res = ''

    if (castle.w.k) {
        res += 'K'
    }
    if (castle.w.q) {
        res += 'Q'
    }
    if (castle.b.k) {
        res += 'k'
    }
    if (castle.b.q) {
        res += 'q'
    }

    if (res.length === 0) {
        return '-'
    } else return res
}

function generateFENString(direction, fiftyRule, moves, turn, squareEP, castle, board) {
    let FEN = ''

    const EPString = identifyCoordinate(squareEP, direction)
    const castleString = generateCastleString(castle)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (Object.keys(board[i][j]).length === 0) {
                let interator = j
                let count = 1

                while (
                    interator + 1 < 8 &&
                    Object.keys(board[i]?.[interator + 1]).length === 0
                ) {
                    count += 1
                    interator += 1
                }

                FEN += `${count}`
                j = interator
            } else {
                if (board[i][j].type[0] === 'w') {
                    FEN += board[i][j].type[1].toUpperCase()
                } else {
                    FEN += board[i][j].type[1]
                }
            }
        }
        if (i !== 7) {
            FEN += '/'
        }
    }

    FEN = `${FEN} ${turn} ${castleString} ${EPString} ${fiftyRule} ${moves}`
    return FEN
}

function isCaptureOrPawnMove(move, piece) {
    return /^.?x./.test(move) || piece[1] === 'p'
}

function lastCaptureOrPawnMove(turn, color) {
    const { move, piece } = color
    if (isCaptureOrPawnMove(move, piece)) {
        return {
            'turn': turn,
            'color': piece[0]
        }
    } return {}
}

function calculateNumberMoves(turn, moves) {
    let allMove = 0
    for (let i = turn; i < moves.length; i++) {
        allMove += Object.keys(moves[i]).length - 1
    }

    return allMove
}

function calculateFiftyRule(moves) {
    let last = {}

    for (const { turn, white, black } of moves) {
        let res = lastCaptureOrPawnMove(turn, white)
        last = {
            ...last,
            ...res
        }

        if (black) {
            res = lastCaptureOrPawnMove(turn, black)
            last = {
                ...last,
                ...res
            }
        }
    }


    if (last?.turn && last?.turn === moves.length) {
        if (
            last.color === 'w' &&
            moves[last.turn - 1].hasOwnProperty('black')
        ) {
            return 1
        }
        return 0
    } else if (last?.turn && last?.turn !== moves.length) {
        const allMove = calculateNumberMoves(last.turn, moves)
        if (
            last.color === 'w'
        ) {
            return allMove + 1
        }
        return allMove
    } else {
        return calculateNumberMoves(0, moves)
    }
}


// function danh cho chess bot =================================================================
// =============================================================================================

function convertCorToSquare(cor, direction) {
    const coordinate = [
        { 'h': 0, 'g': 1, 'f': 2, 'e': 3, 'd': 4, 'c': 5, 'b': 6, 'a': 7 },
        { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 }
    ]

    const col = coordinate[direction][cor[0]]
    const row = direction === 1 ? 8 - parseInt(cor[1]) : parseInt(cor[1]) - 1
    const square = 8 * (7 - row) + col + 1

    return square
}

function typeAction(currentSquare, relocatedSquare, pieces) {
    const piece = findPiece(currentSquare, pieces)
    const canBePiece = findPiece(relocatedSquare, pieces) // ô di chuyển tới có thể là quân cờ hoặc có thể là trống

    if (!piece) return { 'piece': piece, 'action': 'none' }

    // 9 là độ lệch của ô hiện tại với ô di chuyển đến, và 2 này cùng nằm trên đường chéo /
    // 7 là độ lệch của ô hiện tại với ô di chuyển đến, và 2 này cùng nằm trên đường chéo \
    // 8 là độ lệch của ô hiện tại với ô di chuyển đến, và 2 này cùng nằm trên cùng cột |
    // 1 là độ lệch của ô hiện tại với ô di chuyển đến, và 2 này nằm ngay cạnh nhau trên hàng --
    // và đây cũng là các nước di chuyển bth của quân vua, còn nhập thành thì độ lệch sẽ thường là 2 hoặc 3
    // or maybe có thể viết là [2, 3].includes(different)
    const different = Math.abs(relocatedSquare - currentSquare)
    if (piece.piece[1] === 'k' && ![9, 8, 7, 1].includes(different)) {
        if (different === 2) return { 'piece': piece, 'action': 'castle', 'side': 'k' }
        return { 'piece': piece, 'action': 'castle', 'side': 'q' }
    }

    if (!canBePiece) {
        return { 'piece': piece, 'action': 'move' }
    }

    return { 'piece': piece, 'action': 'take' }
}

function validateMove(res, relocatedSquare, kingDanger, canCastle) {
    const { piece: pie, action } = res
    const { piece, allowMove, ban } = pie

    if (action === 'none') return false
    if (action === 'castle') {
        return canCastle[piece[0]][res.side]
    }

    if (piece[1] === 'k') return true

    if (
        (
            (allowMove[action].length > 0 && allowMove[action].includes(relocatedSquare)) ||
            (allowMove[action].length === 0 && !kingDanger)
        ) &&
        !ban

    ) {
        return true
    }

    return false
}

function identifyRookSquare(color, side, direction) {
    if (color === 'w') {
        if (side === 'k' && direction === 1) return 8
        if (side === 'k' && direction === 0) return 57
        if (side === 'q' && direction === 1) return 1
        if (side === 'q' && direction === 0) return 64
    }
    else {
        if (side === 'k' && direction === 1) return 64
        if (side === 'k' && direction === 0) return 1
        if (side === 'q' && direction === 1) return 57
        if (side === 'q' && direction === 0) return 8
    }
}

export function chessBotMove(
    move,
    attacks,
    board,
    pieces,
    turn,
    direction,
    canCastle,
    squaresEP,
    moves,
    bout,
    replacePiece,
    capturePiece,
) {
    const currentSquare = convertCorToSquare(move.substring(0, 2), direction)
    const relocatedSquare = convertCorToSquare(move.substring(2, 4), direction)
    const res = typeAction(currentSquare, relocatedSquare, pieces)
    const { piece: pie, action } = res
    const { piece } = pie
    const kingBeThreated = kingDanger(piece[0], attacks, board)

    if (!validateMove(res, relocatedSquare, kingBeThreated, canCastle)) return null

    if (action === 'castle') {
        const rookSquare =  identifyRookSquare(piece[0], res.side, direction)
        const reRookSquare = 
        (relocatedSquare === 1 || relocatedSquare === 57) ? 
            relocatedSquare + 1 : 
            relocatedSquare - 1

        let state = replacePiece(
            rookSquare,
            reRookSquare,
            board,
            pieces,
            piece[0] + 'r',
            turn,
            direction,
            canCastle,
            squaresEP,
            moves,
            bout,
            true
        )

        state = replacePiece(
            currentSquare,
            relocatedSquare,
            board,
            pieces,
            piece,
            turn,
            direction,
            state.canCastle,
            squaresEP,
            moves,
            bout,
            true
        )

        return state
    }

    if (action === 'move') {
        let state = replacePiece(
            currentSquare,
            relocatedSquare,
            board,
            pieces,
            piece,
            turn,
            direction,
            canCastle,
            squaresEP,
            moves,
            bout
        )

        return state
    }

    if (action === 'take') {
        let state = capturePiece(
            currentSquare,
            relocatedSquare,
            board,
            pieces,
            piece,
            turn,
            direction,
            canCastle,
            squaresEP,
            moves,
            bout
        )

        return state
    } 

    return null
}