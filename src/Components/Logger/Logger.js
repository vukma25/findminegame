import { useEffect, useState } from "react";
import './Logger.css'

function Logger({ log, setLog }) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage(log);

        const timeout = setTimeout(() => {
            setMessage('');
            setLog('')
        }, 3000);

        return () => clearTimeout(timeout);
    }, [log]);

    return (
        <div
            className={`logger ${message === "" ?
                "" : "logger-display"
                }`}>
            {message}
        </div>
    )
}

export default Logger