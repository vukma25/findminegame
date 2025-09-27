import { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import { initialState, reducer } from './Reducer';
import {
    setAiDifficulty,
    setAIThinking,
    setBoard,
    setMode,
    setNewGame,
    setStatus,
    setVariant
} from './Action';
import {
    Icon,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    CircularProgress
} from '@mui/material'
import Logger from '../../Components/Logger/Logger'
import './Caro.css'

const Caro = () => {
    const [caro, dispatch] = useReducer(reducer, initialState)
    const [winningLine, setWinningLine] = useState(null)
    const [playerSide, setPlayerSide] = useState(1)
    const [winner, setWinner] = useState(null)
    const [log, setLog] = useState({
        type: "info",
        message: ""
    })
    const refWebWorker = useRef(null)
    const refHandleClickCell = useRef(null)
    const refCheckWin = useRef(null)

    const handleCellClick = useCallback((row, col, side) => {
        if (caro.status !== "playing") return
        if (caro.board[row][col] !== 0) return
        if (caro.currentPlayer !== side) return
        if (winningLine) return

        const latestBoard = caro.board.map(row => [...row])
        latestBoard[row][col] = side
        dispatch(setBoard(latestBoard))

        const line = checkWin(row, col, side)
        if (line) {
            setWinningLine(line)
            setWinner(side === 1 ? "X" : "O")
            setLog(prev => ({
                ...prev,
                "message": `Player ${side === 1 ? "X" : "O"} win`
            }))
            return
        }

        if (caro.currentPlayer === playerSide && caro.mode === "AI") {
            refWebWorker.current.postMessage({
                action: "get_best_move",
                data: {
                    init: {
                        size: caro.size,
                        board: latestBoard,
                        ai: playerSide === 1 ? 2 : 1,
                        level: caro.aiDifficulty

                    },
                    currentBoard: latestBoard
                }
            })
        }
    }, [caro, playerSide, dispatch])

    const handleChangeMode = (e) => {
        dispatch(setMode(e.target.value))
    }

    const handleChangeAiDifficulty = (e) => {
        dispatch(setAiDifficulty(e.target.value))
    }

    const handleChangeCaroVariant = (e) => {
        const variants = {
            "3": {
                "name": "Tic Tac Toe",
                "board": [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
                "size": 3
            },
            "15": {
                "name": "Caro",
                "board": Array.from({ length: 15 }, () => Array.from({ length: 15 }, () => 0)),
                "size": 15
            },
            "25": {
                "name": "Extra Caro",
                "board": Array.from({ length: 25 }, () => Array.from({ length: 25 }, () => 0)),
                "size": 25
            }
        }
        dispatch(setVariant(variants[e.target.value]))
    }

    const handleChangeStatus = (status) => {
        dispatch(setStatus(status))
    }

    const handleChangeSide = (e) => {
        setPlayerSide(parseInt(e.target.value))
    }

    const handleControlBtn = useCallback(() => {
        if (["playing"].includes(caro.status)) {
            dispatch(setNewGame())
            setWinningLine(null)
        } else {
            handleChangeStatus("playing")
            if (playerSide === 2 && caro.mode === "AI") {
                console.log("ok")
                refWebWorker.current.postMessage({
                    action: "get_best_move",
                    data: {
                        init: {
                            size: caro.size,
                            board: caro.board,
                            ai: playerSide === 1 ? 2 : 1,
                            level: caro.aiDifficulty

                        },
                        currentBoard: caro.board
                    }
                })
            }
        }
    }, [caro, playerSide])

    const checkWin = useCallback((row, col, side) => {

        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        const condition = caro.size >= 15 ? 5 : 3

        for (const [dx, dy] of directions) {
            let count = 1; // Đã có ô hiện tại
            const line = [{ r: row, c: col }]

            // Kiểm tra chiều thuận
            for (let i = 1; i < condition; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;

                if (newRow < 0 || newRow >= caro.size || newCol < 0 || newCol >= caro.size) break;
                if (caro.board[newRow][newCol] !== side) break;

                count++;
                line.push({ r: newRow, c: newCol })
            }

            // Kiểm tra chiều nghịch
            for (let i = 1; i < condition; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;

                if (newRow < 0 || newRow >= caro.size || newCol < 0 || newCol >= caro.size) break;
                if (caro.board[newRow][newCol] !== side) break;

                count++;
                line.unshift({ r: newRow, c: newCol })
            }

            if (count >= condition) {
                return line;
            }
        }

        return null;
    }, [caro])

    const getCellClass = (row, col) => {
        let baseClass = "caro-cell";

        if (winningLine) {
            const isWinningCell = winningLine.some(pos => pos.r === row && pos.c === col);
            const [dy, dx] = [
                winningLine[0].r - winningLine[1].r,
                winningLine[0].c - winningLine[1].c,
            ]

            if (isWinningCell) {
                baseClass += " winning-cell winning-line";

                if (dy === dx) {
                    baseClass += " line-cross-not-main"
                } else if (dy === 0) {
                    baseClass += " line-horizontal"
                } else if (dx === 0) {
                    baseClass += " line-vertical"
                } else {
                    baseClass += " line-cross-main"
                }
            }
        }

        return baseClass;
    }

    const getCellContent = (value) => {
        if (value === 1) return <Icon
            className="player-x"
            sx={{ fontSize: `${caro.size >= 15 ? 1.5 : 8}rem` }}
        >close</Icon>;
        if (value === 2) return <Icon
            className="player-o"
            sx={{ fontSize: `${caro.size >= 15 ? 1.5 : 6}rem` }}
        >circle</Icon>;
        return null;
    }

    useEffect(() => {
        refHandleClickCell.current = handleCellClick
        refCheckWin.current = checkWin
    }, [handleCellClick, checkWin])

    useEffect(() => {
        refWebWorker.current = new Worker(new URL("./CaroWebWorker.js", import.meta.url))

        refWebWorker.current.onmessage = (event) => {
            const { type, payload } = event.data

            switch (type) {
                case "loading":
                    dispatch(setAIThinking(payload))
                    break
                case "get_best_move_success":
                    const { r, c } = payload
                    const side = playerSide === 1 ? 2 : 1
                    refHandleClickCell.current(r, c, side)
                    break
                case "get_best_move_failure":
                    break;
                default:
                    throw new Error("Main thread get best move failure")
            }

        }

        return () => {
            if (refWebWorker.current) {
                refWebWorker.current.terminate()
                refWebWorker.current = null
            }
        }
    }, [dispatch, playerSide])

    return (
        <div className="caro-container">
            <div className="caro-card">
                {/* Header */}
                <div className="caro-header">
                    <h1>{caro.name}</h1>
                </div>

                <div className="caro-content">
                    {/* Game Board */}
                    <div className="caro-board-section flex-div">
                        {/* Caro Board */}
                        {/* <div className="evaluate-bar">
                            <div className="evaluate-x"></div>
                            <div className="evaluate-o"></div>
                        </div> */}
                        <div className="board-container">
                            <div
                                className="caro-board"
                                style={{
                                    gridTemplateColumns: `repeat(${caro.size}, 1fr)`
                                }}
                            >
                                {caro.board.map((row, rowIndex) =>
                                    row.map((cell, colIndex) => (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={getCellClass(rowIndex, colIndex)}
                                            onClick={() => handleCellClick(rowIndex, colIndex, playerSide)}
                                        >
                                            {getCellContent(cell)}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="side-panel">

                        <div className="reset-section">
                            <button
                                onClick={handleControlBtn}
                                className="reset-button"
                            >
                                {caro.status !== "waiting" ? "New game" : "Play"}
                            </button>
                        </div>
                        <div className="statistics-match-panel">
                            <h3>Statistics</h3>

                            <div className="statistics-content">
                                <div className="statistics-name">Turn</div>
                                <div className="statistics-data">{caro.currentPlayer === 1 ? 
                                    <Icon className="player-x">close</Icon> : 
                                    <Icon className="player-o">circle</Icon> 
                                }</div>
                            </div>
                            {caro.mode === "AI" && <div className="statistics-content">
                                <div className="statistics-name">AI status</div>
                                <div className="statistics-data">
                                    <div className={`status ${caro.aiThinking ? "waiting" : "success"}`}>
                                        <span>{`${caro.aiThinking ? "Thinking" : "Done"}`}</span>
                                        {caro.aiThinking && <CircularProgress size={"1.5rem"}/>}
                                    </div>
                                </div>
                            </div>}
                            <div className="statistics-content">
                                <div className="statistics-name">Winner</div>
                                <div className="statistics-data">{winner ? `Player ${winner}` : "Undetermined"}</div>
                            </div>
                        </div>

                        {/* Game Settings */}
                        <div className="settings-panel">
                            <h3>Settings</h3>

                            <div className="settings-content">
                                <div className="setting-group">
                                    <FormControl>
                                        <FormLabel
                                            className="group-label" 
                                            id="setting-variants">Variants</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="setting-variants"
                                            value={caro.size}
                                            onChange={handleChangeCaroVariant}
                                            name="variants"
                                        >
                                            <FormControlLabel value={3} control={<Radio disabled={caro.status === "playing"} />} label="3 x 3" />
                                            <FormControlLabel value={15} control={<Radio disabled={caro.status === "playing"} />} label="15 x 15" />
                                            <FormControlLabel value={25} control={<Radio disabled={caro.status === "playing"} />} label="25 x 25" />
                                        </RadioGroup>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel
                                            className="group-label" 
                                            id="setting-modes">Modes</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="setting-modes"
                                            value={caro.mode}
                                            onChange={handleChangeMode}
                                            name="mode"
                                        >
                                            <FormControlLabel value={"AI"} control={<Radio disabled={caro.status === "playing"} />} label="AI" />
                                            <FormControlLabel value={"PLAYER"} control={<Radio disabled={caro.status === "playing"} />} label="Player" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                {caro.mode === 'AI' && <>
                                    <div className="setting-group">
                                        <FormControl>
                                            <FormLabel
                                                className="group-label" 
                                                id="setting-difficulties">Difficulties</FormLabel>
                                            <RadioGroup
                                            row
                                                aria-labelledby="setting-difficulties"
                                                value={caro.aiDifficulty}
                                                onChange={handleChangeAiDifficulty}
                                                name="difficulties"
                                            >
                                                <FormControlLabel value={"easy"} control={<Radio disabled={caro.status === "playing"} />} label="Easy" />
                                                <FormControlLabel value={"medium"} control={<Radio disabled={caro.status === "playing"} />} label="Medium" />
                                                <FormControlLabel value={"hard"} control={<Radio disabled={caro.status === "playing"} />} label="Hard" />
                                            </RadioGroup>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel
                                                className="group-label" 
                                                id="setting-sides">Side</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="setting-sides"
                                                value={playerSide}
                                                onChange={handleChangeSide}
                                                name="sides"
                                            >
                                                <FormControlLabel value={1} control={<Radio disabled={caro.status === "playing"} />} label="X" />
                                                <FormControlLabel value={2} control={<Radio disabled={caro.status === "playing"} />} label="O" />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Logger log={log} setLog={setLog} />
        </div>
    );
};

export default Caro;