import { useRef, useEffect, useState } from 'react'
import Icon from '@mui/material/Icon'
import Piece from './Piece'
import {
    setReplacePiece,
    setPawnPromotion
} from './Action'
import {
    coordinates,
    convertToArray,
    copyBoardChess,
    copyPiecesChess,
    hiddenInvalidMoveAndTake,
    replacePiece,
    capturePiece,
    modifyMaterial,
    fillColor,
    isPawnPromotion,
    pawnPromotionByReplaceOrCapture,
    listPawnCanBecome,
    copyMoves,
    modifyBoard
} from './Function'

function Board({ chess, dispatch, board, setBoard}) {

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

    //console.log(chess.pieces)

    return (
        <div className="chess-board-area" ref={ref}>
            <svg
                className="chess-board"
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
                chess.pieces.map(({ id, piece, square, coordinate }) => {
                    return (
                        <Piece
                            key={`div-${id}`}
                            piece={piece}
                            square={square}
                            coordinate={coordinate}
                            bounding={bounding}
                            dispatch={dispatch}
                            chess={chess}
                            setSquareEffect={setSquareEffect}
                            board={board}
                            setBoard={setBoard}
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
                    const turn = chess.turn

                    if (sq.action === 'suggest') {
                        const { square, moveToSquare, forPiece } = sq

                        return (
                            <div
                                key={`suggest-${index}`}
                                className={`suggest-div square-${square}`}
                                onClick={() => {

                                    const [row, sq, type] = pawnPromotionByReplaceOrCapture(
                                        square,
                                        0,
                                    )
                                    if (isPawnPromotion(
                                        forPiece,
                                        row,
                                        chess.direction
                                    )) {
                                        dispatch(setPawnPromotion(listPawnCanBecome(forPiece, moveToSquare, sq, type.action, row)))
                                        return
                                    }

                                    const newState = replacePiece(
                                        moveToSquare,
                                        square,
                                        hiddenInvalidMoveAndTake(copyBoardChess(chess.board)),
                                        copyPiecesChess(chess.pieces),
                                        forPiece,
                                        turn,
                                        chess.direction,
                                        chess.canCastle,
                                        chess.squaresEP,
                                        copyMoves(chess.moves),
                                        chess.bout
                                    )

                                    setBoard(newState.board)
                                    dispatch(setReplacePiece(newState))
                                }}
                            >
                                <Icon sx={{
                                    'color': 'var(--cl-gray)',
                                    'fontSize': '3rem'
                                }}>mode_standby</Icon>
                            </div>
                        )
                    } else if (sq.action === 'canBeTaken' || sq.action === 'ep') {
                        const { square, takeSquare, byPiece } = sq

                        return (
                            <div
                                key={`taken-${index}`}
                                className={`taken-div square-${square}`}
                                onClick={() => {

                                    const [row, sq, type] = pawnPromotionByReplaceOrCapture(
                                        0,
                                        square,
                                    )
                                    if (isPawnPromotion(
                                        byPiece,
                                        row,
                                        chess.direction
                                    )) {
                                        dispatch(setPawnPromotion(listPawnCanBecome(byPiece, takeSquare, sq, type.action, row)))
                                        return
                                    }

                                    const newState = capturePiece(
                                        takeSquare,
                                        square,
                                        hiddenInvalidMoveAndTake(copyBoardChess(chess.board)),
                                        copyPiecesChess(chess.pieces),
                                        byPiece,
                                        turn,
                                        chess.direction,
                                        chess.canCastle,
                                        chess.squaresEP,
                                        copyMoves(chess.moves),
                                        chess.bout
                                    )

                                    setBoard(newState.board)
                                    dispatch(setReplacePiece(newState))
                                }}
                            >
                                <Icon sx={{
                                    'color': 'var(--cl-red-flag)',
                                    'fontSize': '3rem'
                                }}>location_searching</Icon>
                            </div>
                        )
                    } else if (sq.action === 'castle') {
                        const { curRook, reRook, square, squareKing, forPiece } = sq

                        return (
                            <div
                                key={`castle-${index}`}
                                className={`suggest-div square-${square}`}
                                onClick={() => {
                                    const copyBoard = copyBoardChess(chess.board)
                                    const copyPieces = copyPiecesChess(chess.pieces)

                                    let newChess = replacePiece(
                                        curRook,
                                        reRook,
                                        hiddenInvalidMoveAndTake(copyBoard),
                                        copyPieces,
                                        forPiece[0] + 'r',
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
                                        square,
                                        copyBoard,
                                        copyPieces,
                                        forPiece,
                                        turn,
                                        chess.direction,
                                        newChess.canCastle,
                                        chess.squaresEP,
                                        copyMoves(chess.moves),
                                        chess.bout,
                                        true
                                    )

                                    setBoard(newChess.board)
                                    dispatch(setReplacePiece(newChess))
                                }}
                            >
                                <Icon sx={{
                                    'color': 'var(--cl-primary-yellow)',
                                    'fontSize': '3rem'
                                }}>mode_standby</Icon>
                            </div>
                        )
                    } return null
                })
            }

            {
                chess.listPawnCanBecome.map((p, index) => {
                    const { type, action, curSquare, reSquare, location } = p
                    if (type !== 'cancelPromotion') {
                        return (
                            <div
                                key={index}
                                className={`
                                    piece promotion-div ${type} square-${location} ${fillColor(location)}
                                `}
                                onClick={
                                    () => {
                                        const turn = chess.turn
                                        if (turn !== type[0]) {
                                            dispatch(setReplacePiece({
                                                'effectSquare': {
                                                    'square': 0,
                                                    'display': 'none'
                                                },
                                                'hasPawnPromotion': false,
                                                'listPawnCanBecome': []
                                            }))
                                            return
                                        }

                                        const copyBoard = copyBoardChess(chess.board)
                                        const copyPieces = copyPiecesChess(chess.pieces)
                                        modifyMaterial(copyPieces, curSquare, type)
                                        modifyBoard(copyBoard, curSquare, type)

                                        let state = {
                                            'hasPawnPromotion': false,
                                            'listPawnCanBecome': []
                                        }
                                        let newState

                                        if (action === 'capture') {
                                            newState = capturePiece(
                                                curSquare,
                                                reSquare,
                                                hiddenInvalidMoveAndTake(copyBoard),
                                                copyPieces,
                                                type,
                                                turn,
                                                chess.direction,
                                                chess.canCastle,
                                                chess.squaresEP,
                                                copyMoves(chess.moves),
                                                chess.bout
                                            )

                                        } else {
                                            newState = replacePiece(
                                                curSquare,
                                                reSquare,
                                                hiddenInvalidMoveAndTake(copyBoard),
                                                copyPieces,
                                                type,
                                                turn,
                                                chess.direction,
                                                chess.canCastle,
                                                chess.squaresEP,
                                                copyMoves(chess.moves),
                                                chess.bout
                                            )
                                        }

                                        dispatch(setReplacePiece({
                                            ...state,
                                            ...newState
                                        }))
                                    }
                                }
                            ></div>
                        )
                    } else {
                        return (
                            <div
                                key={index}
                                className={`promotion-div square-${location} ${fillColor(location)}`}
                                onClick={() => dispatch(setReplacePiece({
                                    'effectSquare': {
                                        'square': 0,
                                        'display': 'none'
                                    },
                                    'hasPawnPromotion': false,
                                    'listPawnCanBecome': []
                                }))}
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