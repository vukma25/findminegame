
import { useReducer } from 'react'
import Board from './Board'
import { initialState, reducer } from './Reducer'
import './Chess.css'

function Chess() {

    const [chess, dispatch] = useReducer(reducer, initialState)

    return (
        <div className="chess">
            <Board chess={chess} dispatch={dispatch} />
        </div>
    )
}

export default Chess