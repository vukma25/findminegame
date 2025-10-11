
import { useState, useEffect, useCallback } from 'react'
import { ChessGame } from './Function'
import Board from './Board'
import MoveList from './MoveList'
import ChessModeSelector from './ChessModeSelector'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import Logger from '../../Components/Logger/Logger'
import ChessBot from './chessBot'
import '../../assets/styles/Chess.css'
import ChessSettings from './ChessSettings'
import PlayerInfoPanel from './PlayerInfoPanel'

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
                    <PlayerInfoPanel 
                        chess={chess}
                        mode={mode}
                        aiThinking={aiThinking}
                        setDisplaySettingBoard={setDisplaySettingBoard}
                        swap={swap}
                    />
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