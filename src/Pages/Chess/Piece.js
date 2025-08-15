
import { useState, useEffect, useRef } from 'react'
import {
    setReplacePiece,
    setPawnPromotion
} from './Action'
import {
    copyBoardChess,
    copyPiecesChess,
    calculateEssentialSize,
    createLimit,
    calculateTopOrLeft,
    hiddenInvalidMoveAndTake,
    identifyRowAndCol,
    replacePiece,
    displayInvalidMoveAndTake,
    capturePiece,
    matchSquareSuggest,
    matchSquareTaken,
    matchSquareCastle,
    isPawnPromotion,
    pawnPromotionByReplaceOrCapture,
    listPawnCanBecome,
    copyMoves
} from './Function'

function Piece({ piece, square, coordinate, bounding, dispatch, chess, setSquareEffect, board, setBoard }) {

    const [prop, setProp] = useState({
        'isMove': false,
        'style': {
            'backgroundColor': 'transparent',
            'transform': `translate(${chess.squares[square][0]}%, ${chess.squares[square][1]}%)`
        }
    })

    const ref = useRef(null)
    const squareSuggest = useRef(0)
    const squareTaken = useRef(0)
    const squareCastle = useRef([])

    useEffect(() => {
        setProp(prevState => {
            return {
                ...prevState,
                'style': {
                    ...prevState.style,
                    'transform': `translate(${chess.squares[square][0]}%, ${chess.squares[square][1]}%)`
                }
            }
        })
    }, [square])


    useEffect(() => {

        if (chess.hasCheckmate.checkmate) return

        const el = ref.current
        if (!el) return

        const copyBoard = copyBoardChess(chess.board)
        const copyPieces = copyPiecesChess(chess.pieces)
        let turn = chess.turn
        let hoveringSquare = square
        let isClicked = false

        function onMouseDown(e) {
            //e.preventDefault()

            if (e.button === 0) {
                const [x, y, squareWidth] = calculateEssentialSize(e, bounding)
                setBoard(displayInvalidMoveAndTake(
                        piece,
                        square, 
                        coordinate, 
                        copyBoard, 
                        copyPieces,
                        chess.attacks,
                        chess.protects,
                        chess.direction,
                        chess.canCastle,
                        chess.squaresEP,
                        chess.pins
                ))
                setProp(prevState => {
                    return {
                        ...prevState,
                        'isMove': true,
                        'style': {
                            ...prevState.style,
                            'backgroundColor': 'transparent',
                            'transform': `translate(
                                ${calculateTopOrLeft(x, bounding.left, squareWidth)}px, 
                                ${calculateTopOrLeft(y, bounding.top, squareWidth)}px
                            )`
                        }
                    }
                })

                document.addEventListener('mousemove', onMouseMove)
                document.addEventListener('mouseup', onMouseUp)
            }
        }

        function onMouseMove(e) {
            let [xPointer, yPointer, squareWidth] = calculateEssentialSize(e, bounding)

            //gioi han phamj vi dich chuyen
            xPointer = createLimit(xPointer, bounding.left, bounding.right)
            yPointer = createLimit(yPointer, bounding.top, bounding.bottom)

            //vi tri cua quan co
            const xPiece = calculateTopOrLeft(xPointer, bounding.left, squareWidth);
            const yPiece = calculateTopOrLeft(yPointer, bounding.top, squareWidth);

            //set vi tri cho effect div
            const posFromLeftToPointer = Math.max(1, xPointer - bounding.left)
            const posFromTopToPointer = Math.max(1, yPointer - bounding.top)
            const [col, row] = identifyRowAndCol(posFromLeftToPointer, posFromTopToPointer, squareWidth)
            hoveringSquare = 8 * row + col
            squareSuggest.current = matchSquareSuggest(copyBoard, row, col, hoveringSquare)
            squareTaken.current = matchSquareTaken(copyBoard, row, col, hoveringSquare)
            squareCastle.current = matchSquareCastle(copyBoard, row, col)

            //====================================================
            setProp(prevState => {
                return {
                    ...prevState,
                    'isMove': true,
                    'style': {
                        ...prevState.style,
                        'backgroundColor': 'transparent',
                        'transform': `translate(
                                ${xPiece}px, 
                                ${yPiece}px
                        )`
                    }
                }
            })

            setSquareEffect({
                'square': hoveringSquare,
                'display': 'block'
            })
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
            setProp(prevState => {
                return {
                    ...prevState,
                    'isMove': false,
                    'style': {
                        ...prevState.style,
                        'transform': `translate(${chess.squares[square][0]}%, ${chess.squares[square][1]}%)`
                    }
                }
            })
            setSquareEffect({
                'square': 0,
                'display': 'none'
            })

            if (turn === 'b') return

            //an hien nuoc goi y cua quan duoc click vao
            let freshBoard = copyBoard
            let freshPieces = copyPieces
            if (isClicked && !(hoveringSquare !== square)) {
                console.log('ok', chess.board)
                freshBoard = copyBoardChess(chess.board)
                freshPieces = copyPiecesChess(chess.pieces)
                isClicked = false
            } else {
                isClicked = true
            }
            //=======================================================

            setBoard(freshBoard)

            const [row, sq, type] = pawnPromotionByReplaceOrCapture(
                squareSuggest.current,
                squareTaken.current,
            )
            if (isPawnPromotion(
                piece,
                row,
                chess.direction
            )) {
                squareSuggest.current = 0
                squareTaken.current = 0
                dispatch(setPawnPromotion(listPawnCanBecome(piece, square, sq, type.action, row)))
                return
            }
            //=======================================================

            if (squareSuggest.current !== 0) {

                const newChess = replacePiece(
                    square,
                    squareSuggest.current,
                    hiddenInvalidMoveAndTake(freshBoard),
                    freshPieces,
                    piece,
                    turn,
                    chess.direction,
                    chess.canCastle,
                    chess.squaresEP,
                    copyMoves(chess.moves),
                    chess.bout
                )

                squareSuggest.current = 0
                dispatch(setReplacePiece(newChess))
            }
            else if (squareTaken.current !== 0) {
                const newChess = capturePiece(
                    square,
                    squareTaken.current,
                    hiddenInvalidMoveAndTake(freshBoard),
                    freshPieces,
                    piece,
                    turn,
                    chess.direction,
                    chess.canCastle,
                    chess.squaresEP,
                    copyMoves(chess.moves),
                    chess.bout
                )

                squareTaken.current = 0
                dispatch(setReplacePiece(newChess))
            } else if (['wk', 'bk'].includes(piece) && squareCastle.current.length !== 0) {
                const [curRook, reRook, sq, squareKing] = squareCastle.current
                let newChess = replacePiece(
                    curRook,
                    reRook,
                    hiddenInvalidMoveAndTake(freshBoard),
                    freshPieces,
                    piece[0] + 'r',
                    turn,
                    chess.direction,
                    chess.canCastle,
                    chess.squaresEP,
                    copyMoves(chess.moves),
                    chess.bout,
                    true
                )

                newChess = replacePiece(
                    squareKing,
                    sq,
                    freshBoard,
                    freshPieces,
                    piece,
                    turn,
                    chess.direction,
                    newChess.canCastle,
                    chess.squaresEP,
                    copyMoves(chess.moves),
                    chess.bout,
                    true
                )

                squareCastle.current = []
                dispatch(setReplacePiece(newChess))
            }
        }

        el.addEventListener('mousedown', onMouseDown)

        return () => {
            el.removeEventListener('mousedown', onMouseDown)
        }
    }, [bounding, board, chess])

    return (
        <div
            className={`
                piece 
                ${piece} 
                square-${square}
                ${prop.isMove ? "dragging" : ""}
            `}
            ref={ref}
            style={prop.style}
        ></div>
    )
}

export default Piece
