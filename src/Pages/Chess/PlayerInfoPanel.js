import { useRef, useMemo } from 'react'
import { Icon, CircularProgress } from '@mui/material'
import wp from '../../assets/image/wp.png'
import wq from '../../assets/image/wq.png'
import wn from '../../assets/image/wn.png'
import wr from '../../assets/image/wr.png'
import wb from '../../assets/image/wb.png'
import bp from '../../assets/image/bp.png'
import bq from '../../assets/image/bq.png'
import bn from '../../assets/image/bn.png'
import br from '../../assets/image/br.png'
import bb from '../../assets/image/bb.png'

const images = { wp, wq, wn, wr, wb, bp, bq, bn, br, bb }

export default function PlayerInfoPanel({
    chess,
    mode,
    aiThinking,
    setDisplaySettingBoard,
    swap }) {

    const pieces = useRef(null);
    pieces.current = chess.pieces;

    const capturePiece = useMemo(() => {
        const fullForce = {
            'wr': [5, 5],
            'wb': [3, 3],
            'wn': [3, 3],
            'wp': [1, 1, 1, 1, 1, 1, 1, 1],
            'wq': [9],
            'br': [5, 5],
            'bb': [3, 3],
            'bn': [3, 3],
            'bp': [1, 1, 1, 1, 1, 1, 1, 1],
            'bq': [9]
        }

        let capturedForce = fullForce

        pieces.current.forEach(({ piece }) => {
            if (piece[1] !== 'k') {
                const capture = capturedForce[piece]
                capture.shift()

                capturedForce = {
                    ...capturedForce,
                    [piece]: capture
                }
            }
        });

        let whiteForceCaptured = []
        let blackForceCaptured = []

        Object.keys(capturedForce).forEach((key) => {
            if (key[0] === 'w') {
                whiteForceCaptured = [...whiteForceCaptured, ...capturedForce[key].map(e => ({ type: key[1], val: e }))]
            } else {
                blackForceCaptured = [...blackForceCaptured, ...capturedForce[key].map(e => ({ type: key[1], val: e }))]
            }
        })

        return {
            'w': whiteForceCaptured.sort((a, b) => a.val - b.val),
            'b': blackForceCaptured.sort((a, b) => a.val - b.val)
        }

    }, [chess.turn])

    const point = useMemo(() => {
        console.log(capturePiece)
        const white = capturePiece.w.map(({ val }) => val).reduce((total, val) => total + val, 0)
        const black = capturePiece.b.map(({ val }) => val).reduce((total, val) => total + val, 0)
        console.log(white, black)

        if (white > black) {
            return { type: "w", difference: white - black }
        } else if (white < black) {
            return { type: "b", difference: black - white }
        } else {
            return { type: "", difference: 0 }
        }
    }, [capturePiece])

    return (
        <>
            {
                chess.status === 'playing' &&
                <div className="chess-info-player-area">
                    <div className="chess-info-player left">
                        <div className="left-avatar" >
                            <img src="https://robohash.org/1" />
                        </div>
                        <div className="left-name-and-elo flex-div">
                            <div className="name">Player1</div>
                            <div className="elo">(1500)</div>
                        </div>
                        {mode?.type === 'player' && <div className="left-time flex-div">10:00</div>}
                        <div className="capture-pieces">
                            <div className="pieces">
                                {capturePiece.b.map(({ type }, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="piece-pool"
                                            style={{
                                                backgroundImage: `url(${images["b" + type]})`,
                                                left: `${index * 1.5}rem`
                                            }}
                                        ></div>
                                    )
                                })}
                            </div>
                            <div className="total-value">
                                {point.type === "b" ? `+${point.difference}` : ""}
                            </div>
                        </div>
                    </div>
                    <div className="chess-info-player right">
                        <div className="right-avatar">
                            <img
                                src={`${mode?.type === 'bot' ? mode.opposite.avatar : "https://robohash.org/1"}`}
                            />
                        </div>
                        <div className="right-name-and-elo flex-div">
                            <div className="elo">({mode?.opposite.elo})</div>
                            <div className="name">{mode?.opposite.name}</div>
                        </div>
                        {(mode?.type === 'bot' && aiThinking) && <div className='bot-thinking flex-div'>
                            <p>AI is thinking</p>
                            <CircularProgress
                                sx={{
                                    color: "var(--cl-primary-purple)",
                                }}
                                size="2rem"
                            />
                        </div>}
                        {mode?.type === 'player' && <div className="right-time flex-div">10:00</div>}
                        <div className="capture-pieces">
                            <div className="pieces">
                                {capturePiece.w.map(({ type }, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="piece-pool"
                                            style={{
                                                backgroundImage: `url(${images["w" + type]})`,
                                                right: `${index * 1.5}rem`
                                            }}
                                        ></div>
                                    )
                                })}
                            </div>
                            <div className="total-value">
                                {point.type === "w" ? `+${point.difference}` : ""}
                            </div>
                        </div>
                    </div>
                    <div className="chess-options flex-div">
                        <Icon
                            className="chess-options-icon"
                            onClick={() => {
                                setDisplaySettingBoard(true)
                            }}
                        >settings</Icon>
                        <Icon
                            className="chess-options-icon"
                            onClick={() => { swap() }}
                        >cached</Icon>
                    </div>
                </div>
            }
        </>
    )
}