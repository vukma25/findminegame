import React, { useState, useReducer, useEffect } from 'react';
import { defaultState, reducer } from './Reducer';
import { SETTER } from './Actions';
import { EMOJI_POOL, shuffle } from './Function';
import Modal from './Modal';
import ClockBase from '../../Components/ClockBase/ClockBase'
import Clock from './Clock'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    Slider
} from '@mui/material'
import './Memory.css'

const Memory = () => {
    const [game, dispatch] = useReducer(reducer, defaultState)
    const [firstClick, setFirstClick] = useState(null)
    const [busy, setBusy] = useState(false)
    const [semaphore, setSemaphore] = useState(true)
    const [timeFinish, setTimeFinish] = useState(null)
    const gridStyle = {
        gridTemplateColumns: `repeat(${Math.max(game.cols, game.rows)}, minmax(0, 1fr))`
    }

    const initGame = () => {
        const pairs = game.pairs
        const cards = Array.from({ length: pairs * 2 }, () => 0).map((v, i) => {
            return {
                id: `card-${i}`,
                value: v,
                matched: false,
                flipped: false
            }
        })

        setFirstClick(null)
        setBusy(false)
        setSemaphore(true)
        dispatch(SETTER.handleResetGame(cards))
    }

    const handleChangeCol = (e) => {
        dispatch(SETTER.handleChangeCol(Number(e.target.value)))
    }

    const handleChangeRow = (e) => {
        dispatch(SETTER.handleChangeRow(Number(e.target.value)))
    }

    const handleChangeDuration = (e) => {
        dispatch(SETTER.handleChangeDuration(Number(e.target.value)))
    }

    const handleUseTime = () => {
        dispatch(SETTER.handleUseTime())
    }

    const handleFlipCard = (id, value, isOpen) => {
        if (isOpen) return
        if (busy || game.status !== "playing") return

        let cards = game.cards.map((card) => {
            if (card.id === id) {
                return {
                    ...card,
                    flipped: true
                }
            }
            return { ...card }
        })

        dispatch(SETTER.handleSetCard(cards))

        if (!firstClick) {
            setFirstClick({ id, value })
            return
        }

        setBusy(true)
        let moves = game.moves + 1
        let matches = game.matches

        if (firstClick.value === value) {
            matches += 1
            cards = cards.map((card) => {
                if ([id, firstClick.id].includes(card.id)) {
                    return {
                        ...card,
                        matched: true
                    }
                }
                return { ...card }
            })
        } else {
            cards = cards.map((card) => {
                if ([id, firstClick.id].includes(card.id)) {
                    return {
                        ...card,
                        flipped: false
                    }
                }
                return { ...card }
            })
        }

        setTimeout(function () {
            setFirstClick(null)
            setBusy(false)
            dispatch(SETTER.handleMatchCard({ moves, matches, cards }))
        }, 700)

    }

    const startGame = () => {
        const chosen = shuffle(EMOJI_POOL).slice(0, game.pairs)
        const value = shuffle([...chosen, ...chosen])
        const cards = game.cards.map((card, i) => {
            return {
                ...card,
                value: value[i]
            }
        })

        dispatch(SETTER.handleSetCard(cards))
        dispatch(SETTER.handleListenStatus("playing"))
        setSemaphore(false)
    }

    const resetGame = () => initGame()

    useEffect(() => {
        initGame()
    }, [game.rows, game.cols])

    useEffect(() => {
        if (timeFinish?.remain <= 0) {
            dispatch(SETTER.handleListenStatus("time_out"))
            setSemaphore(true)
        }
    }, [timeFinish])

    useEffect(() => {
        if (game.matches === game.pairs && game.status !== "winning") {
            dispatch(SETTER.handleListenStatus("winning"))
            setSemaphore(true)
        }
    }, [game])

    useEffect(() => {
        initGame()
    }, [])

    return (
        <React.Fragment>
            <div className="memory-game">
                <div className="game-container">
                    {/* Header */}
                    <div className="game-header">
                        <h1>Memory Game</h1>
                    </div>

                    <div className="game-layout">
                        {/* Board */}
                        <div className="game-board">
                            <div className="board-card">
                                {/* Stats */}
                                <div className="stats-container">
                                    <div className="stats-group">
                                        <div className="stat moves">
                                            Turn: {game.moves}
                                        </div>
                                        <div className="stat matches">
                                            Pairs: {game.matches}/{game.pairs}
                                        </div>
                                        <ClockBase
                                            type={"countdown"}
                                            duration={game.duration}
                                            semaphore={semaphore}
                                            setTimeFinish={setTimeFinish}
                                        >
                                            <Clock display={game.useTime} />
                                        </ClockBase>
                                    </div>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => { resetGame() }}
                                            className="btn reset"
                                            disabled={game.status !== "playing"}
                                        >
                                            New game
                                        </button>
                                    </div>
                                </div>

                                {/* Grid */}
                                <div className="cards-grid" style={gridStyle}>
                                    {game.cards.map((card) => {
                                        const stateClass = card.matched ? 'matched' : card.flipped ? 'flipped' : '';
                                        return (
                                            <button
                                                key={card.id}
                                                className={`memory-card ${stateClass}`}
                                                onClick={() => { handleFlipCard(card.id, card.value, (card.flipped || card.matched)) }}
                                                aria-label={card.flipped || card.matched ? `Thẻ ${card.value}` : 'Lật thẻ'}
                                            >
                                                <div className="card-inner">
                                                    <div className="card-face front">?</div>
                                                    <div className="card-face back">{card.value}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Side panel */}
                        <div className="side-panel">
                            <button
                                onClick={() => { startGame() }}
                                disabled={game.status === "playing"}
                                className="start-btn"
                            >
                                Play
                            </button>
                            <div className="settings-panel">
                                <div className="panel-title">Settings</div>
                                <div className="settings-content">
                                    <div className="setting-group">
                                        <FormControl fullWidth>
                                            <InputLabel id="settings-row" className="label">Rows</InputLabel>
                                            <Select
                                                labelId='settings-row'
                                                label="Rows"
                                                className="select"
                                                value={game.rows}
                                                onChange={handleChangeRow}
                                                disabled={game.status !== "waiting"}
                                            >
                                                {[2, 3, 4, 5, 6].map(r => {
                                                    if (game.cols % 2 === 1) {
                                                        if (r % 2 === 1) return null
                                                        else return <MenuItem key={r} value={r} sx={{ fontSize: "1.4rem" }}>{r}</MenuItem>
                                                    }

                                                    return <MenuItem key={r} value={r} sx={{ fontSize: "1.4rem" }}>{r}</MenuItem>
                                                }).filter(r => r)}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="setting-group">
                                        <FormControl fullWidth>
                                            <InputLabel id="settings-col" className="label">Columns</InputLabel>
                                            <Select
                                                labelId='settings-col'
                                                label="Columns"
                                                className="select"
                                                value={game.cols}
                                                onChange={handleChangeCol}
                                                disabled={game.status !== "waiting"}
                                            >
                                                {[2, 3, 4, 5, 6].map(c => {
                                                    if (game.rows % 2 === 1) {
                                                        if (c % 2 === 1) return null
                                                        else return <MenuItem key={c} value={c} sx={{ fontSize: "1.4rem" }}>{c}</MenuItem>
                                                    }

                                                    return <MenuItem key={c} value={c} sx={{ fontSize: "1.4rem" }}>{c}</MenuItem>
                                                }).filter(c => c)}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="setting-group toggle">
                                        <div>
                                            <div className="label">Use time</div>
                                            <div className="description">countdown</div>
                                        </div>
                                        <Switch
                                            size={"small"}
                                            checked={game.useTime}
                                            onChange={handleUseTime}
                                            disabled={game.status !== "waiting"}
                                        />
                                    </div>
                                    {game.useTime && (
                                        <div className="setting-group">
                                            <Slider
                                                aria-label="set time"
                                                step={30}
                                                marks
                                                min={60}
                                                max={180}
                                                value={game.duration}
                                                onChange={handleChangeDuration}
                                                disabled={game.status !== "waiting"}

                                            />
                                            <div className="time-display">Limit: {game.duration}s</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {
                ["time_out", "winning"].includes(game.status) &&
                <Modal game={game} remain={timeFinish?.remain || 0} initGame={initGame} />
            }
        </React.Fragment>
    );
};

export default Memory;