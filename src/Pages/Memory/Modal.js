
import { useNavigate } from "react-router-dom";

export default function Modal({ game, remain, initGame }) {
    const navigate = useNavigate()

    function formatTime(time) {
        const minute = Math.floor(time / 60)
        const second = time % 60

        return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }

    function goHome() {
        navigate("/")
    }

    return (
        <div className="modal-memory">
            <div className="modal-content">
                <h2 className="modal-title">
                    {game.status === "time_out" ? "Time out" : "You opened all card and became winner"}
                </h2>
                <div className="modal-game-info">
                    <div className="field">Rows</div>
                    <div className="data">{game.rows}</div>
                </div>
                <div className="modal-game-info">
                    <div className="field">Columns</div>
                    <div className="data">{game.cols}</div>
                </div>
                {game.useTime &&
                    <>
                        <div className="modal-game-info">
                            <div className="field">Duration</div>
                            <div className="data">
                                {formatTime(game.duration)}
                            </div>
                        </div>
                        <div className="modal-game-info">
                            <div className="field">Remain</div>
                            <div className="data">{formatTime(Math.floor(remain / 1000))}</div>
                        </div>
                        <div className="modal-game-info">
                            <div className="field">Time used</div>
                            <div className="data">
                                {formatTime(game.duration - Math.floor(remain / 1000))}
                            </div>
                        </div>
                    </>
                }
                <div className="modal-btn-redirect">
                    <button 
                        className="btn-action play-again"
                        onClick={() => {initGame()}}
                    >Play more</button>
                    <button 
                        className="btn-action cancel"
                        onClick={() => {goHome()}}
                    >Go home</button>
                </div>
            </div>
        </div>
    )
}