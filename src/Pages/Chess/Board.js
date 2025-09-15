import { useRef, useEffect, useState } from 'react'
import Icon from '@mui/material/Icon'
import Piece from './Piece'
import { convertToArray } from './Function'

function Board({ chess, setChess, aiThinking, settings }) {

    const [board, setBoard] = useState(chess.getBoard())
    const [bounding, setBounding] = useState({
        'top': 0,
        'left': 0,
        'bottom': 0,
        'right': 0
    })

    const [squareEffect, setSquareEffect] = useState({
        'square': 0,
        'display': 'none'
    })

    const [pieceActive, setPieceActive] = useState(0)

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

    }, [chess.status])

    useEffect(() => {
        setBoard(chess.getBoard())
    }, [chess])

    useEffect(() => {
        if (pieceActive === 0) {
            setBoard(chess.clearMoveAndTake(board))
        }
    }, [pieceActive])

    return (
        <div className="chess-board-area" ref={ref}>
            <svg
                className={`
                    chess-board ${settings.showBorder ? "" :
                        "chess-board__without-border"
                    }
                `}
                viewBox="0 0 100 100"
            >
                {
                    convertToArray(board).map((_, index) => {
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
                                        settings.darkSquareColor :
                                        settings.lightSquareColor
                                }
                            ></rect>
                        )
                    }).concat(settings.showCoordinates ?
                        chess.getCoordinates().map(([x, y, value], index) => {
                            return (
                                <text
                                    key={`text-${index}`}
                                    className="chess-board-coordinate"
                                    x={x}
                                    y={y}
                                    fill={
                                        chess.direction === 1 ?
                                            value % 2 === 0 ||
                                                ['b', 'd', 'f', 'h'].includes(value) ?
                                                settings.darkSquareColor :
                                                settings.lightSquareColor :
                                            value % 2 === 0 ||
                                                ['b', 'd', 'f', 'h'].includes(value) ?
                                                settings.lightSquareColor :
                                                settings.darkSquareColor
                                    }
                                >
                                    {value}
                                </text>
                            )
                        }) : [])
                }
            </svg>
            {
                chess.getPieces().map(({ id, piece, square, coordinate }) => {
                    return (
                        <Piece
                            key={`div-${id}`}
                            piece={piece}
                            square={square}
                            coordinate={coordinate}
                            bounding={bounding}
                            chess={chess}
                            setChess={setChess}
                            board={board}
                            setBoard={setBoard}
                            setSquareEffect={setSquareEffect}
                            pieceActive={pieceActive}
                            setPieceActive={setPieceActive}
                            aiThinking={aiThinking}
                            animation={`transform ${settings.animation ? .5 : .05}s`}
                        >
                        </Piece>
                    )
                })
            }

            {/* Effect div */}
            <div
                className={`chess-effect square-${squareEffect.square}`}
                style={{ 'display': squareEffect.display }}
            ></div>


            {
                convertToArray(board).map((sq, index) => {
                    if (!sq?.action) return null

                    if (sq.action === 'suggest') {
                        const { square, moveToSquare, forPiece } = sq
                        const chessClone = chess.getState()
                        return (
                            <div
                                key={`suggest-${index}`}
                                className={`suggest-div square-${square}`}
                                onClick={() => {

                                    const [row, sq, type] = chessClone.pawnPromotionByReplaceOrCapture(
                                        square,
                                        0,
                                    )
                                    if (chessClone.isPawnPromotion(
                                        forPiece,
                                        row
                                    )) {
                                        chessClone.listPawnAbleToTransform(forPiece, moveToSquare, sq, type.action, row)
                                        setChess(chessClone.getState())
                                        return
                                    }

                                    const newState = chessClone.replacePiece(
                                        moveToSquare,
                                        square,
                                        forPiece,
                                    )
                                    setChess(newState)
                                }}
                            >
                                {settings.showHints && <Icon sx={{
                                    'color': 'var(--cl-gray)',
                                    'fontSize': '3rem'
                                }}>mode_standby</Icon>}
                            </div>
                        )
                    } else if (sq.action === 'canBeTaken' || sq.action === 'ep') {
                        const { square, takeSquare, byPiece } = sq
                        const chessClone = chess.getState()
                        return (
                            <div
                                key={`taken-${index}`}
                                className={`taken-div square-${square}`}
                                onClick={() => {

                                    const [row, sq, type] = chessClone.pawnPromotionByReplaceOrCapture(
                                        0,
                                        square,
                                    )
                                    if (chessClone.isPawnPromotion(
                                        byPiece,
                                        row
                                    )) {
                                        chessClone.listPawnAbleToTransform(byPiece, takeSquare, sq, type.action, row)
                                        setChess(chessClone.getState())
                                        return
                                    }

                                    const newState = chessClone.capturePiece(
                                        takeSquare,
                                        square,
                                        byPiece
                                    )

                                    setChess(newState)
                                }}
                            >
                                {settings.showHints && <Icon sx={{
                                    'color': 'var(--cl-red-flag)',
                                    'fontSize': '3rem'
                                }}>location_searching</Icon>}
                            </div>
                        )
                    } else if (sq.action === 'castle') {
                        const { curRook, reRook, square, squareKing, forPiece } = sq
                        const chessClone = chess.getState()

                        return (
                            <div
                                key={`castle-${index}`}
                                className={`suggest-div square-${square}`}
                                onClick={() => {

                                    let newChess = chessClone.replacePiece(
                                        curRook,
                                        reRook,
                                        forPiece[0] + 'r',
                                        true
                                    )
                                    newChess = newChess.replacePiece(
                                        squareKing,
                                        square,
                                        forPiece,
                                        true
                                    )

                                    setChess(newChess)
                                }}
                            >
                                {settings.showHints && <Icon sx={{
                                    'color': 'var(--cl-primary-yellow)',
                                    'fontSize': '3rem'
                                }}>mode_standby</Icon>}
                            </div>
                        )
                    }
                })
            }

            {
                chess.listPawnCanBecome.map((p, index) => {
                    const { type, action, curSquare, reSquare, location } = p
                    const chessClone = chess.getState()

                    if (type !== 'cancelPromotion') {
                        return (
                            <div
                                key={index}
                                className={`
                                    piece promotion-div ${type} square-${location} ${chessClone.fillColor(location)}
                                `}
                                onClick={
                                    () => {
                                        const turn = chessClone.turn
                                        if (turn !== type[0]) {
                                            chessClone.setListPawnCanBecome([])
                                            setChess(chessClone.getState())
                                            return
                                        }
                                        chessClone.modifyMaterial(curSquare, type)
                                        chessClone.modifyBoard(curSquare, type)

                                        let newState
                                        if (action === 'capture') {
                                            chessClone.setListPawnCanBecome([])
                                            newState = chessClone.capturePiece(
                                                curSquare,
                                                reSquare,
                                                type
                                            )

                                        } else {
                                            chessClone.setListPawnCanBecome([])
                                            newState = chessClone.replacePiece(
                                                curSquare,
                                                reSquare,
                                                type
                                            )
                                        }

                                        setChess(newState)
                                    }
                                }
                            ></div>
                        )
                    } else {
                        return (
                            <div
                                key={index}
                                className={`promotion-div square-${location} ${chessClone.fillColor(location)}`}
                                onClick={() => {
                                    chess.setListPawnCanBecome([])
                                    setChess(chess.getState())
                                }}
                            >
                                <Icon
                                    sx={{
                                        'color': 'var(--cl-red-flag)',
                                        'fontSize': '5rem'
                                    }}
                                >close</Icon>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}

export default Board