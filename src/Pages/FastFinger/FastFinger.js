import { useState, useEffect, useCallback, useRef } from 'react';
import { textSamples } from './data';
import './FastFinger.css'

const FastFinger = () => {
    

    const [gameState, setGameState] = useState('waiting');
    const [currentText, setCurrentText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [selectedTime, setSelectedTime] = useState(60);
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [correctChars, setCorrectChars] = useState(0);
    const [incorrectChars, setIncorrectChars] = useState(0);
    const [totalChars, setTotalChars] = useState(0);
    const [bestWpm, setBestWpm] = useState(localStorage.getItem('bestWpm') || 0);
    const [bestAccuracy, setBestAccuracy] = useState(localStorage.getItem('bestAccuracy') || 0);

    const inputRef = useRef(null);
    const timerRef = useRef(null);

    const initializeText = useCallback(() => {
        const randomText = textSamples[Math.floor(Math.random() * textSamples.length)];
        setCurrentText(randomText);
        setUserInput('');
        setCurrentIndex(0);
        setCorrectChars(0);
        setIncorrectChars(0);
        setTotalChars(0);
        setWpm(0);
        setAccuracy(100);
    }, []);

    const startGame = () => {
        setGameState('playing');
        setTimeLeft(selectedTime);
        setStartTime(Date.now());
        initializeText();
        inputRef.current?.focus();

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const endGame = () => {
        setGameState('finished');
        clearInterval(timerRef.current);

        if (wpm > bestWpm) {
            setBestWpm(wpm);
            localStorage.setItem('bestWpm', wpm);
        }
        if (accuracy > bestAccuracy) {
            setBestAccuracy(accuracy);
            localStorage.setItem('bestAccuracy', accuracy);
        }
    };

    const resetGame = () => {
        setGameState('waiting');
        clearInterval(timerRef.current);
        setTimeLeft(selectedTime);
        initializeText();
    };

    const handleInputChange = (e) => {
        if (gameState !== 'playing') return;

        const value = e.target.value;
        const newIndex = value.length;

        setUserInput(value);
        setCurrentIndex(newIndex);

        let correct = 0;
        let incorrect = 0;

        for (let i = 0; i < value.length; i++) {
            if (i < currentText.length) {
                if (value[i] === currentText[i]) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        }

        setCorrectChars(correct);
        setIncorrectChars(incorrect);
        setTotalChars(value.length);

        const timeElapsed = (Date.now() - startTime) / 1000 / 60;
        const wordsTyped = correct / 5;
        const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        setWpm(currentWpm);

        const currentAccuracy = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;
        setAccuracy(currentAccuracy);

        if (value.length >= currentText.length) {
            endGame();
        }
    };

    const renderText = () => {
        return currentText.split('').map((char, index) => {
            let className = 'char';

            if (index < userInput.length) {
                className += userInput[index] === char ? ' correct' : ' incorrect';
            } else if (index === currentIndex) {
                className += ' current';
            } else {
                className += ' untyped';
            }

            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    };

    useEffect(() => {
        initializeText();
        return () => clearInterval(timerRef.current);
    }, [initializeText]);

    useEffect(() => {
        if (gameState === 'playing') {
            inputRef.current?.focus();
        }
    }, [gameState]);

    const progress = currentText.length > 0 ? (currentIndex / currentText.length) * 100 : 0;

    return (
        <div className="typing-game-container">
            <div className="typing-game-card">
                {/* Header */}
                <div className="game-header">
                    <h1>⚡ Fast Finger Typing</h1>
                    <p>Thử thách tốc độ đánh máy của bạn!</p>
                </div>

                {/* Game Stats */}
                <div className="stats-grid">
                    <div className="stat-card blue">
                        <div className="stat-value">{wpm}</div>
                        <div className="stat-label">WPM</div>
                    </div>
                    <div className="stat-card green">
                        <div className="stat-value">{accuracy}%</div>
                        <div className="stat-label">Độ chính xác</div>
                    </div>
                    <div className="stat-card purple">
                        <div className="stat-value">{timeLeft}</div>
                        <div className="stat-label">Giây còn lại</div>
                    </div>
                    <div className="stat-card orange">
                        <div className="stat-value">{Math.round(progress)}%</div>
                        <div className="stat-label">Tiến độ</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-track">
                        <div
                            className="progress-bar"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Game Area */}
                {gameState === 'waiting' && (
                    <div className="waiting-screen">
                        <div className="time-selection">
                            <h3>Chọn thời gian thử thách:</h3>
                            <div className="time-options">
                                {[30, 60, 120].map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                                    >
                                        {time}s
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={startGame}
                                className="start-button"
                            >
                                🚀 Bắt đầu thử thách!
                            </button>
                        </div>

                        {/* Best Scores */}
                        <div className="best-scores">
                            <div className="best-score yellow">
                                <div className="score-value">{bestWpm}</div>
                                <div className="score-label">Kỷ lục WPM</div>
                            </div>
                            <div className="best-score green">
                                <div className="score-value">{bestAccuracy}%</div>
                                <div className="score-label">Kỷ lục độ chính xác</div>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="playing-screen">
                        {/* Text Display */}
                        <div className="text-display">
                            <div className="typing-text">
                                {renderText()}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="input-area">
                            <textarea
                                ref={inputRef}
                                value={userInput}
                                onChange={handleInputChange}
                                className="typing-input"
                                placeholder="Bắt đầu gõ ở đây..."
                                disabled={gameState !== 'playing'}
                            />
                            <div className="input-counter">
                                {userInput.length} / {currentText.length}
                            </div>
                        </div>

                        {/* Live Stats */}
                        <div className="live-stats">
                            <div className="live-stat blue">
                                <div className="stat-value">{correctChars}</div>
                                <div className="stat-label">Ký tự đúng</div>
                            </div>
                            <div className="live-stat red">
                                <div className="stat-value">{incorrectChars}</div>
                                <div className="stat-label">Ký tự sai</div>
                            </div>
                            <div className="live-stat gray">
                                <div className="stat-value">{totalChars}</div>
                                <div className="stat-label">Tổng ký tự</div>
                            </div>
                        </div>

                        <div className="reset-section">
                            <button
                                onClick={resetGame}
                                className="reset-button"
                            >
                                🔄 Làm lại
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'finished' && (
                    <div className="finished-screen">
                        <div className="results-container">
                            <h2>🎉 Hoàn thành!</h2>

                            <div className="results-grid">
                                <div className="result-card">
                                    <div className="result-value blue">{wpm}</div>
                                    <div className="result-label">WPM</div>
                                    {wpm > bestWpm && <div className="record-badge">🎉 Kỷ lục mới!</div>}
                                </div>
                                <div className="result-card">
                                    <div className="result-value green">{accuracy}%</div>
                                    <div className="result-label">Độ chính xác</div>
                                    {accuracy > bestAccuracy && <div className="record-badge">🎉 Kỷ lục mới!</div>}
                                </div>
                                <div className="result-card">
                                    <div className="result-value purple">{correctChars}</div>
                                    <div className="result-label">Ký tự đúng</div>
                                </div>
                                <div className="result-card">
                                    <div className="result-value orange">{Math.round(progress)}%</div>
                                    <div className="result-label">Hoàn thành</div>
                                </div>
                            </div>

                            {/* Performance Rating */}
                            <div className="performance-rating">
                                <div className="rating-title">Đánh giá hiệu suất:</div>
                                <div className="rating-text">
                                    {wpm >= 60 ? '🏆 Xuất sắc!' :
                                        wpm >= 40 ? '🥇 Rất tốt!' :
                                            wpm >= 25 ? '🥈 Tốt!' :
                                                wpm >= 15 ? '🥉 Khá!' : '📚 Cần luyện tập thêm!'}
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button
                                    onClick={resetGame}
                                    className="action-button blue"
                                >
                                    🔄 Thử lại
                                </button>
                                <button
                                    onClick={() => {
                                        resetGame();
                                        setTimeout(startGame, 100);
                                    }}
                                    className="action-button green"
                                >
                                    🚀 Thử thách mới
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="instructions">
                    <h3>💡 Hướng dẫn:</h3>
                    <div className="instructions-content">
                        <p>• <strong>WPM (Words Per Minute):</strong> Số từ gõ được trong 1 phút (1 từ = 5 ký tự)</p>
                        <p>• <strong>Độ chính xác:</strong> Tỷ lệ phần trăm ký tự gõ đúng</p>
                        <p>• Ký tự <span className="char correct">xanh</span> là đúng, <span className="char incorrect">đỏ</span> là sai</p>
                        <p>• Ký tự <span className="char current">xanh đậm</span> là vị trí hiện tại cần gõ</p>
                        <p>• Mục tiêu: Đạt WPM cao nhất có thể với độ chính xác tối đa!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FastFinger;