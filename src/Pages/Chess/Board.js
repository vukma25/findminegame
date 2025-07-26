import { useRef, useEffect, useState } from 'react'
import Icon from '@mui/material/Icon'
import Piece from './Piece'
import {
    setReplacePiece
} from './Action'
import {
    coordinates,
    convertToArray,
    copyBoardChess,
    copyPiecesChess,
    hiddenInvalidMoveAndTake,
    replacePiece,
    capturePiece
} from './Function'

function Board({ chess, dispatch }) {

    const [bounding, setBounding] = useState({
        'top': 0,
        'left': 0,
        'bottom': 0,
        'right': 0
    })
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        function getBounding() {
            setBounding({
                'top': el.getBoundingClientRect().top,
                'left': el.getBoundingClientRect().left,
                'right': el.getBoundingClientRect().right,
                'bottom': el.getBoundingClientRect().bottom
            })
        }

        getBounding()
        window.addEventListener('resize', getBounding)
        window.addEventListener('scroll', getBounding)

        return () => {
            window.removeEventListener('resize', getBounding)
            window.removeEventListener('scroll', getBounding)
        }

    }, [])

    return (
        <div className="chess-board-area" ref={ref}>
            <svg
                className="chess-board"
                viewBox="0 0 100 100"
            >
                {
                    convertToArray(chess.board).map((_, index) => {
                        const [i, j] = [
                            Math.floor(index / 8),
                            index % 8
                        ]

                        return (
                            <rect
                                key={`rect-${index}`}
                                className="chess-board-square"
                                x={j * 12.5}
                                y={i * 12.5}
                                width={12.5}
                                height={12.5}
                                fill={
                                    (i % 2 === 0 && j % 2 !== 0) ||
                                        (i % 2 !== 0 && j % 2 === 0) ?
                                        "var(--cl-white-pure)" : "var(--cl-primary-purple)"
                                }
                            ></rect>
                        )
                    }).concat(coordinates.map(([x, y, value], index) => {
                        return (
                            <text
                                key={`text-${index}`}
                                className="chess-board-coordinate"
                                x={x}
                                y={y}
                                fill={
                                    value % 2 === 0 ||
                                        ['b', 'd', 'f', 'h'].includes(value) ?
                                        "var(--cl-white-pure)" : "var(--cl-primary-purple)"
                                }
                            >
                                {value}
                            </text>
                        )
                    }))
                }
            </svg>
            {
                chess.pieces.map(({ piece, square, coordinate }, index) => {
                    return (
                        <Piece
                            key={`div-${index}`}
                            piece={piece}
                            square={square}
                            coordinate={coordinate}
                            bounding={bounding}
                            dispatch={dispatch}
                            chess={chess}
                        >
                        </Piece>
                    )
                })
            }

            {/* Effect div */}
            <div
                className={`chess-effect square-${chess.effectSquare.square}`}
                style={{ 'display': chess.effectSquare.display }}
            ></div>


            {
                convertToArray(chess.board).map((square, index) => {
                    if (square.action === 'suggest') {
                        return (
                            <div
                                key={`suggest-${index}`}
                                className={`suggest-div square-${square.square}`}
                                onClick={() => {dispatch(setReplacePiece(replacePiece(
                                    square.moveToSquare,
                                    square.square,
                                    hiddenInvalidMoveAndTake(copyBoardChess(chess.board)),
                                    copyPiecesChess(chess.pieces)
                                )))}}
                            >
                                <Icon sx={{
                                    'color': 'var(--cl-gray)',
                                    'fontSize': '3rem'
                                }}>mode_standby</Icon>
                            </div>
                        )
                    } else if (square.action === 'canBeTaken'){
                        return (
                            <div
                                key={`taken-${index}`}
                                className={`taken-div square-${square.square}`}
                                onClick={() => {
                                    dispatch(setReplacePiece(capturePiece(
                                        square.takeSquare,
                                        square.square,
                                        hiddenInvalidMoveAndTake(copyBoardChess(chess.board)),
                                        copyPiecesChess(chess.pieces)
                                    )))
                                }}
                            >
                                <Icon sx={{
                                    'color': 'var(--cl-red-flag)',
                                    'fontSize': '3rem'
                                }}>location_searching</Icon>
                            </div>
                        )
                    } return null
                })
            }
        </div>
    )
}

export default Board