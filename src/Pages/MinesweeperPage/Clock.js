
import { useEffect, useContext } from "react";
import { UseClock } from "../../Components/ClockBase/ClockBase";
import { ClockContext } from "./OptionBar";
import { runOutOfTime } from "./Action"

function Clock({ useTime }) {

    const clock = useContext(UseClock)
    const { settings, dispatch } = useContext(ClockContext)

    function formatTime(clock) {
        if (!clock) return
        return `${clock.minute.toString().padStart(2, '0')}:${clock.second.toString().padStart(2, '0')}`;
    }

    useEffect(() => {

        if (clock.remain === 0 && settings.level !== 0 && settings.setTime.isTime) {
            dispatch(runOutOfTime("Time out"))
        }
    }, [clock.remain])
    
    return (
        <>
            {useTime && <div className="minesweeper-settings-clock">
                <div className="stat-value time">{formatTime(clock)}</div>
                <div className="stat-label">Thời gian</div>
            </div>}
        </>
    )
}

export default Clock