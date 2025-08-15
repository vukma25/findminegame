import { useState } from "react";
import { staticURL, bots, timeOptions } from "./ChessBotData";

export default function ChessModeSelector({ setInGame, setLog }) {
    const [mode, setMode] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedBot, setSelectedBot] = useState(null);


    return (
        <div className="game-mode-selector">
            <h2>Select mode</h2>

            {/* Chọn chế độ */}
            <div className="mode-buttons flex-div">
                <button
                    className={mode === "player" ? "active" : ""}
                    onClick={() => {
                        setMode("player");
                        setSelectedBot(null);
                    }}
                >
                    Play with person
                </button>
                <button
                    className={mode === "bot" ? "active" : ""}
                    onClick={() => {
                        setMode("bot");
                        setSelectedTime(null);
                    }}
                >
                    Play with bot
                </button>
            </div>

            {/* Nếu chọn người */}
            {mode === "player" && (
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
            {mode === "bot" && (
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
                                                'level': level
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
                        if (selectedBot || selectedTime) {
                            setInGame(true)
                        } else {
                            setLog('Please choose full information')
                        }
                    }}
                >
                    Play
                </button>
            </div>
        </div>
    );
}
