import { useState } from "react";
import { Link } from 'react-router'
import { staticURL, bots, timeOptions } from "./ChessBotData";

export default function ChessModeSelector({ chess, setChess, setMode, setLog }) {
    const [type, setType] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedBot, setSelectedBot] = useState(null);
    const [selectedOneDevice, setSelectedOneDevice] = useState(null);


    return (
        <div className="game-mode-selector">
            <h2>Select mode</h2>

            {/* Chọn chế độ */}
            <div className="mode-buttons flex-div">
                <button
                    className={type === "player" ? "active" : ""}
                    onClick={() => {
                        setType("player");
                        setSelectedBot(null);
                        setSelectedOneDevice(null)
                    }}
                >
                    Play with person
                </button>
                <button
                    className={type === "bot" ? "active" : ""}
                    onClick={() => {
                        setType("bot");
                        setSelectedTime(null);
                        setSelectedOneDevice(null)
                    }}
                >
                    Play with bot
                </button>
                <button
                    className={type === "one-device" ? "active" : ""}
                    onClick={() => {
                        setType("one-device");
                        setSelectedOneDevice({
                            "name": "Player 2",
                            "elo": "???"
                        })
                        setSelectedTime(null);
                        setSelectedBot(null)
                    }}
                >
                    2 player 1 device
                </button>
            </div>

            {/* Nếu chọn người */}
            {type === "player" && (
                <>
                    <h3>Select time</h3>
                    <div className="time-groups flex-div">
                        {Object.entries(timeOptions).map(([type, times]) => (
                            <div key={type} className="time-group">
                                <h4>{type}</h4>
                                <div className="options-container">
                                    {times.map((time) => (
                                        <div
                                            key={time}
                                            className={`time flex-div ${selectedTime === time ? "active" : ""}`}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {`${time} ${/\|/.test(time) ? "" : "min"}`}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Nếu chọn máy */}
            {type === "bot" && (
                <>
                    <h3>Select bot</h3>
                    <div className="bot-groups flex-div">
                        {Object.entries(bots).map(([level, botList]) => (
                            <div key={level} className="bot-group">
                                <h4>{level}</h4>
                                <div className="options-container">
                                    {botList.map(({ name, elo }) => (
                                        <div
                                            key={name}
                                            className={`bot-chess ${selectedBot?.name === name ? "active" : ""}`}
                                            onClick={() => setSelectedBot({
                                                'name': name,
                                                'elo': elo,
                                                'level': level,
                                                'avatar': `${staticURL}/${name}`
                                            })}
                                        >
                                            <img
                                                className="avatar-bot"
                                                src={`${staticURL}/${name}`}
                                                loading="lazy"
                                                draggable={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Khối thông tin bot + nút Play */}

                </>
            )}

            {/* Nút Play */}
            <div className="play-container">
                {selectedBot && (
                    <div className="bot-info-container">
                        <img
                            className="avatar-bot-large"
                            src={`${staticURL}/${selectedBot.name}`}
                            alt={selectedBot.name}
                        />
                        <div className="bot-details">
                            <h4>{selectedBot.name}</h4>
                            <h4>{`Elo: ${selectedBot.elo}`}</h4>
                            <p className="bot-des flex-div">Difficulty:
                                <span className={`${selectedBot.level.toLowerCase()}`}>{`${selectedBot.level}`}</span>
                            </p>
                        </div>
                    </div>
                )}
                <button
                    className="play-btn"
                    onClick={() => { 
                        if (selectedBot) {
                            const newChess = chess.getState()

                            setMode({
                                type, 
                                'opposite': selectedBot
                            })
                            newChess.setStatus('playing')
                            setChess(newChess)
                        }
                        else if (selectedOneDevice) {
                            const newChess = chess.getState()

                            setMode({
                                type,
                                'opposite': selectedOneDevice
                            })
                            newChess.setStatus('playing')
                            setChess(newChess)
                        }
                        else if (selectedTime) {
                            setLog({
                                "message": "This feature is coming soon...",
                                "type": "info"
                            })
                        }
                        else {
                            setLog({
                                "message": "Please choose full information",
                                "type": "warning"
                            })
                        }
                    }}
                >
                    Play
                </button>
            </div>

            <Link to="/" className="back-home">Home</Link>
        </div>
    );
}
