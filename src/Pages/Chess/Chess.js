
import { useState, useEffect, useRef, useCallback } from 'react'
import { ChessGame } from './Function'
import { Icon, CircularProgress } from '@mui/material'
import Board from './Board'
import MoveList from './MoveList'
import ChessModeSelector from './ChessModeSelector'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import Logger from '../../Components/Logger/Logger'
import ChessBot from './chessBot'
import './Chess.css'
import ChessSettings from './ChessSettings'

function Chess() {

    const [chess, setChess] = useState(new ChessGame())
    const [mode, setMode] = useState({})
    const [settings, setSettings] = useState(JSON.parse(localStorage.getItem("chess-theme")) ?? {
        showHints: true,
        autoRotate: false,
        sound: true,
        animation: true,
        showCoordinates: false,
        showBorder: true,
        lightSquareColor: '#FFFFFF',
        darkSquareColor: '#5309B3'
    })
    const [displaySettingBoard, setDisplaySettingBoard] = useState(false)
    const [aiThinking, setAIThinking] = useState(false)
    const [log, setLog] = useState({
        "message": "",
        "type": "info"
    })

    const swap = useCallback(() => {
        let newChess = chess.getState()
        newChess.modifyDirection()
        setChess(newChess)
    }, [chess])

    useEffect(() => {
        if (chess.status === "preparing") return

        if (settings.autoRotate) {
            swap()
        }
    }, [chess.turn])

    return (
        <>
            <div className="chess">
                <div className="chess-left-area flex-div">
                    {chess.status === 'playing' &&
                    <div className="chess-info-player-area">
                        <div className="chess-info-player left">
                            <img src="https://robohash.org/1" className="left-avatar"/>
                            <div className="left-name-and-elo flex-div">
                                <div className="name">Player1</div> 
                                <div className="elo">(1500)</div>
                            </div>
                            {mode?.type === 'player' && <div className="left-time">10:00</div>}
                        </div>
                        <div className="chess-info-player right">
                            <img 
                                src={`${mode?.type === 'bot' ? mode.opposite.avatar : "https://robohash.org/1"}`}
                                className="right-avatar"
                            />
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
                            {mode?.type === 'player' && <div className="right-time">10:00</div>}
                        </div>
                        <div className="chess-options flex-div">
                            <Icon 
                                className="chess-options-icon"
                                onClick={() => { 
                                    console.log('ok')
                                    setDisplaySettingBoard(true) 
                                }}
                            >settings</Icon>
                            <Icon 
                                className="chess-options-icon"
                                onClick={() => { swap() }}
                            >cached</Icon>
                        </div>
                    </div>}
                    <Board 
                        chess={chess} 
                        setChess={setChess} 
                        aiThinking={aiThinking} 
                        settings={settings} 
                    />
                </div>
                {chess.status === 'playing' && <MoveList chess={chess} setChess={setChess}/>}
                {chess.status === 'preparing' && 
                    <ChessModeSelector 
                        chess={chess} 
                        setChess={setChess} 
                        setMode={setMode} 
                        setLog ={setLog}
                    />}
                {mode?.type === 'bot' && 
                    <ChessBot 
                        chess={chess} 
                        chessBot={mode?.opposite} 
                        setChess={setChess}
                        setAIThinking={setAIThinking}  
                    />}
                {displaySettingBoard && <ChessSettings 
                    settings={settings} 
                    setSettings={setSettings}
                    setDisplaySettingBoard={setDisplaySettingBoard}
                />}
                <Logger log={log} setLog={setLog} />
            </div>
            <GoTopBtn />
        </>
    )
}

export default Chess