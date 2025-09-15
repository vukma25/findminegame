
import { useEffect, useContext } from "react";
import { UseClock } from "../../Components/ClockBase/ClockBase";
import { runOutOfTime } from "./Action"

function Clock({ level, dispatch }) {

    const clock = useContext(UseClock)

    function formatTime(clock) {
        if(!clock) return
        return `${clock.minute.toString().padStart(2, '0')}:${clock.second.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        if (clock.remain === 0 && level !== 0) {
            dispatch(runOutOfTime("Time out"))
        }
    }, [clock.remain])

    return (
        <div className="minesweeper-settings-clock">
            <div className="stat-value time">{formatTime(clock)}</div>
            <div className="stat-label">Thời gian</div>
        </div>
    )
}

export default Clock