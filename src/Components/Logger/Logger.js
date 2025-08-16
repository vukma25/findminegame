import { useEffect, useState } from "react";
import './Logger.css'

function Logger({ log, setLog, type }) {
    const [message, setMessage] = useState('');

    function clearLog() {
        setMessage('');
        setLog('')
    }

    useEffect(() => {
        setMessage(log);

        const timeout = setTimeout(() => {
            clearLog()
        }, 5000);

        return () => clearTimeout(timeout);
    }, [log]);

    return (
        <div className={`logger logger--${type} ${message === "" ? "" : "logger-display"}`}>
                <div className="logger__inner">
                    <span className="logger__icon" style={{ background: "#e03131" }}></span>
                    <span className="logger__message">{message}</span>
                    <button 
                        className="logger__close" aria-label="Đóng"
                        onClick={() => {clearLog()}}
                    >✕</button>
                </div>
        </div>
    )
}

export default Logger