import { Link } from 'react-router-dom'
import Home from '../HomePage/Home'
import { setRestartGame } from './Action';
import lose_gif from '../../assets/image/lose.gif'
import win_gif from '../../assets/image/win.gif'

function GameOver({ dispatch, message, isWin }) {
    return (
        <div className="wrapper-game-over">
            <div className="game-over flex-div">
                <div className="game-over-state">{message}</div>
                <img 
                    className="game-over-gif"
                    src={`${isWin ? win_gif : lose_gif}`}
                    alt={`This is a ${isWin ? win_gif : lose_gif}`}
                /> 
                <div className="game-over-option flex-div">
                    <button 
                        className="game-over-option-restart"
                        onClick={() => dispatch(setRestartGame())}
                    >Restart</button>
                    <Link
                        to="/"
                        element={<Home />}
                        className="game-over-option-home"
                    >Home</Link>
                </div>
            </div>
        </div>
    );
}

export default GameOver