
import { useState, useReducer } from 'react'
import Board from './Board'
import MoveList from './MoveList'
import ChessModeSelector from './ChessModeSelector'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import Logger from '../../Components/Logger/Logger'
import ChessBot from './chessBot'
import { initialState, reducer } from './Reducer'
import './Chess.css'

function Chess() {

    const [chess, dispatch] = useReducer(reducer, initialState)
    const [inGame, setInGame] = useState(false)
    const [log, setLog] = useState('')
    //ui không quan đến logic
    const [board, setBoard] = useState(chess.board)
    

    return (
        <>
            <div className="chess">
                <Board chess={chess} dispatch={dispatch} board={board} setBoard={setBoard} />
                {inGame && <MoveList moves={chess.moves} setInGame={setInGame} />}
                {!inGame && <ChessModeSelector setInGame={setInGame} setLog ={setLog}/>}
                {/* <ChessBot chess={chess} dispatch={dispatch} setBoard={setBoard} /> */}
                <Logger log={log} setLog={setLog}/>
            </div>
            <GoTopBtn />
        </>
    )
}

export default Chess