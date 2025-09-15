
import { useState, useEffect, useRef } from 'react'
import {
    calculateEssentialSize,
    createLimit,
    calculateTopOrLeft,
    identifyRowAndCol,
    matchSquareSuggest,
    matchSquareTaken,
    matchSquareCastle,
} from './Function'

function Piece({ 
    piece, 
    square, 
    coordinate, 
    bounding, 
    chess, 
    setChess,
    board,
    setBoard, 
    setSquareEffect,  
    pieceActive, 
    setPieceActive,
    aiThinking,
    animation
}) {

    const [prop, setProp] = useState({
        'isMove': false,
        'style': {
            'backgroundColor': 'transparent',
            'transform': `translate(${chess.squares[square][0]}%, ${chess.squares[square][1]}%)`,
            'transition': animation
        }
    })

    const ref = useRef(null)
    const refBoard = useRef(board)
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
        refBoard.current = board
    }, [board])

    useEffect(() => {

        if (aiThinking) return
        if (chess.status === 'preparing') return 
        if (chess.hasCheckmate.checkmate) return

        const el = ref.current
        if (!el) return

        let hoveringSquare = square
        const chessClone = chess.getState()

        function onMouseDown(e) {
            //e.preventDefault()

            if (e.button === 0) {
                const [x, y, squareWidth] = calculateEssentialSize(e, bounding)
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
                setPieceActive(prev => {
                    if (prev === square) return prev
                    return square
                })
                setBoard(chessClone.displayInvalidMoveAndTake(
                    piece, square, coordinate, chessClone.getBoard()
                ))
                

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
            squareSuggest.current = matchSquareSuggest(refBoard.current, row, col, hoveringSquare)
            squareTaken.current = matchSquareTaken(refBoard.current, row, col, hoveringSquare)
            squareCastle.current = matchSquareCastle(refBoard.current, row, col)

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
                        'transform': `translate(${chess.squares[square][0]}%, ${chess.squares[square][1]}%)`,
                    }
                }
            })
            setSquareEffect({
                'square': 0,
                'display': 'none'
            })

            console.log(hoveringSquare)

            //an hien nuoc goi y cua quan duoc click vao
            if (pieceActive === square && 
                !(hoveringSquare !== square)
            ) {
                 setPieceActive(0)
            }
            //=======================================================

            const [row, sq, type] = chessClone.pawnPromotionByReplaceOrCapture(
                squareSuggest.current,
                squareTaken.current,
            )
            if (chessClone.isPawnPromotion(
                piece,
                row
            )) {
                squareSuggest.current = 0
                squareTaken.current = 0
                chessClone.listPawnAbleToTransform(piece, square, sq, type.action, row)
                setChess(chessClone)
                return
            }
            //=======================================================

            if (squareSuggest.current !== 0) {

                const newChess = chessClone.replacePiece(
                    square,
                    squareSuggest.current,
                    piece
                )
                squareSuggest.current = 0
                setChess(newChess)
                return
            }
            else if (squareTaken.current !== 0) {
                const newChess = chessClone.capturePiece(
                    square,
                    squareTaken.current,
                    piece
                )

                squareTaken.current = 0
                setChess(newChess)
                return
            } else if (['wk', 'bk'].includes(piece) && squareCastle.current.length !== 0) {
                const [curRook, reRook, sq, squareKing] = squareCastle.current
                let newChess = chessClone.replacePiece(
                    curRook,
                    reRook,
                    piece[0] + 'r',
                    true
                )

                newChess = newChess.replacePiece(
                    squareKing,
                    sq,
                    piece,
                    true
                )

                squareCastle.current = []
                setChess(newChess)
                return
            }
        }

        el.addEventListener('mousedown', onMouseDown)

        return () => {
            el.removeEventListener('mousedown', onMouseDown)
        }
    }, [bounding, chess, chess.status, aiThinking, pieceActive])

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
