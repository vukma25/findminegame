
import { useState, useEffect, useRef } from 'react'
import {
    setDisplayEffect,
    setDisplayMove,
    setHiddenMove,
    setReplacePiece
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
    matchSquareTaken
} from './Function'

function Piece({ piece, square, coordinate, bounding, dispatch, chess }) {

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
    const isClicked = useRef(false)

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
        const el = ref.current
        if (!el) return

        const copyBoard = copyBoardChess(chess.board)
        const copyPieces = copyPiecesChess(chess.pieces)
        let hoveringSquare = square

        function onMouseDown(e) {

            if (e.button === 0) {
                const [x, y, squareWidth] = calculateEssentialSize(e, bounding)
                dispatch(setDisplayMove(displayInvalidMoveAndTake(piece, square, coordinate, copyBoard)))
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

            dispatch(setDisplayEffect({
                'square': hoveringSquare,
                'display': 'block'
            }))
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)

            let newBoard = copyBoard
            if (isClicked.current && !(hoveringSquare !== square)) {
                newBoard = hiddenInvalidMoveAndTake(copyBoard)
                isClicked.current = false
            } else {
                isClicked.current = true
            }

            if (squareSuggest.current !== 0) {

                const newChess = replacePiece(
                    square,
                    squareSuggest.current,
                    hiddenInvalidMoveAndTake(copyBoard),
                    copyPieces
                )

                squareSuggest.current = 0
                dispatch(setReplacePiece(newChess))
            }
            else if (squareTaken.current !== 0) {
                const newChess = capturePiece(
                    square,
                    squareTaken.current,
                    hiddenInvalidMoveAndTake(copyBoard),
                    copyPieces
                )

                squareTaken.current = 0
                dispatch(setReplacePiece(newChess))
            }
            else {
                dispatch(setHiddenMove(newBoard))
            }

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
        }

        el.addEventListener('mousedown', onMouseDown)

        return () => {
            el.removeEventListener('mousedown', onMouseDown)
        }
    }, [bounding, chess])

    return (
        <div
            className={`
                piece 
                ${piece} 
                ${square}
                ${prop.isMove ? "dragging" : ""}
            `}
            ref={ref}
            style={prop.style}
        ></div>
    )
}

export default Piece
