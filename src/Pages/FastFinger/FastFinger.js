import { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import {
    setNewGame,
    setGameState,
    setUserInput,
    setOptions,
    setQuitGame
} from './Action'
import { initialState, reducer } from './Reducer';
import { renderParagraph, getWpmAndStat, getProgress } from './Functions'
import '../../assets/styles/FastFinger.css'

const FastFinger = () => {
    
    const [game, dispatch] = useReducer(reducer, initialState)
    const [buffer, setBuffer] = useState('')
    const [bestWpm, setBestWpm] = useState(JSON.parse(localStorage.getItem('bestWpm')) || 0)
    const [accuracy, setAccuracy] = useState(JSON.parse(localStorage.getItem('accuracy')) || 0)
    const [timeLeft, setTimeLeft] = useState(game.options.duration)

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const gameRef = useRef(game)
    gameRef.current = game

    const initializeNewGame = useCallback(() => {
        const randomText = renderParagraph(game.options)
        dispatch(setNewGame(randomText))
    }, [game.options]);


    const handleSetOption = useCallback((option) => {
        dispatch(setOptions(option))
    }, [game])

    const startGame = (type = 'new') => {

        if (type === 'new') {
            resetGame()
        } else {
            tryAgainThisGame()
        }

        setTimeLeft(game.options.duration)
        dispatch(setGameState("playing"))

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
    }

    const endGame = useCallback(() => {
        dispatch(setGameState("finished"))
        setBuffer('')
        updateRecord(gameRef.current.wpm, gameRef.current.accuracy)
        clearInterval(timerRef.current);
    }, [])

    const resetGame = () => {
        clearInterval(timerRef.current)
        setBuffer('')
        initializeNewGame()
    }

    const tryAgainThisGame = () => {
        clearInterval(timerRef.current)
        setBuffer('')
        dispatch(setNewGame(game.targetParagraph))
    }

    const quitGame = () => {
        clearInterval(timerRef.current)
        setBuffer('')
        dispatch(setQuitGame())
    }

    const handlePreprocessingInput = (input) => {
        if (input === '\n' || input === ' ') return ''

        const regex = /\s[^\s]+/;

        if (regex.test(input)) {
            const posSpace = input.match(regex).index;
            const filteredInput = input.slice(0, posSpace);
            return filteredInput;
        }

        return input;
    }

    const handleInputChange = (e) => {
        if (game.state !== 'playing') return;

        let value = handlePreprocessingInput(e.target.value);
        let newIndex = game.currentIndex;

        console.log(value)

        if (value.slice(-1) === ' ' || value.slice(-1) === '\n') {
            newIndex += 1

            const [
                correct,
                incorrect,
                wpm,
                accuracy
            ] = getWpmAndStat([...game.userInput, buffer], game.targetParagraph, game.startTime)

            dispatch(setUserInput({
                buffer,
                newIndex,
                correct,
                incorrect,
                wpm,
                accuracy
            }))
            setBuffer('')
        } else {
            setBuffer(value)
        }

        if (newIndex > game.targetParagraph.length) {
            endGame();
        }
    }

    const updateRecord = (newWpm, newAccuracy) => {
        let bestWpm = localStorage.getItem('bestWpm')
        let wpm = newWpm

        if (bestWpm) {
            wpm = JSON.parse(bestWpm)

            if (newWpm > wpm){
                wpm = newWpm
            }
        }

        localStorage.setItem('bestWpm', JSON.stringify(wpm))
        localStorage.setItem('accuracy', JSON.stringify(newAccuracy))
        setBestWpm(wpm)
        setAccuracy(newAccuracy)
    }

    const renderText = () => {
        const { targetParagraph, userInput } = game

        return targetParagraph.map((word, index) => {
            let className = 'word';

            if (index < userInput.length) {
                className += userInput[index] === word ? ' correct' : ' incorrect';
            } else if (index === game.currentIndex) {
                className += ' current';
            } else {
                className += ' untyped';
            }

            return (
                <span key={index} className={className}>
                    {word}
                </span>
            );
        });
    }

    const formatTime = (time) => {
        if (!time || typeof time !== 'number') return
        const minute = Math.floor(time / 60)
        const second = time % 60
        return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        initializeNewGame();
        return () => {
            if (!timerRef.current) {
                clearInterval(timerRef.current)
            }
        };
    }, [initializeNewGame]);

    useEffect(() => {
        if (game.state === 'playing') {
            inputRef.current?.focus();
        }
    }, [game.state]);

    return (
        <div className="typing-game-container">
            <div className="typing-game-card">
                <h1 className="card-title">FastFinger</h1>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-track">
                        <div
                            className="progress-bar"
                            style={{ width: `${getProgress(game)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Game Area */}
                {game.state === 'waiting' && (
                    <div className="waiting-screen">
                        <div className="selection">
                            <h1>Select option</h1>
                            <div className="options">
                                {[15, 30, 60, 120].map(time => (
                                    <button
                                        key={time}
                                        onClick={() => {
                                            handleSetOption({
                                                'duration': time
                                            })
                                        }}
                                        className={`option ${game.options.duration === time ? 'selected' : ''}`}
                                    >
                                        {time}s
                                    </button>
                                ))}
                            </div>
                            <div className="options">
                                {
                                    [
                                        {name: "with capitalization", type: "useUpper"},
                                        {name: "with mark and article", type: "useMarkAndArticle"}

                                    ].map(({ name, type }) => (
                                        <button
                                            key={name}
                                            onClick={() => {handleSetOption({
                                                [type]: !game.options[type]
                                            })}}
                                            className={`option ${game.options[type] ? 'selected' : ''}`}
                                        >
                                            {name}
                                        </button>
                                    ))
                                }
                            </div>
                            <button
                                onClick={() => {startGame()}}
                                className="start-button"
                            >
                                Start
                            </button>
                        </div>

                        {/* Best Scores */}
                        <div className="best-scores">
                            <div className="best-score yellow">
                                <div className="score-value">{bestWpm}</div>
                                <div className="score-label">The best WPM</div>
                            </div>
                            <div className="best-score green">
                                <div className="score-value">{accuracy}%</div>
                                <div className="score-label">Accuracy</div>
                            </div>
                        </div>
                    </div>
                )}

                {game.state === 'playing' && (
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
                                value={buffer}
                                onChange={handleInputChange}
                                className="typing-input"
                                placeholder="Bắt đầu gõ ở đây..."
                                disabled={game.state !== 'playing'}
                            />
                            <div className="input-counter">
                                {game.userInput.join('').length} / {game.targetParagraph.join('').length}
                            </div>
                        </div>

                        {/* Live Stats */}
                        <div className="live-stats">
                            <div className="live-stat blue">
                                <div className="stat-value">{game.correctChars}</div>
                                <div className="stat-label">Correct</div>
                            </div>
                            <div className="live-stat red">
                                <div className="stat-value">{game.incorrectChars}</div>
                                <div className="stat-label">Incorrect</div>
                            </div>
                            <div className="live-stat green">
                                <div className="stat-value">{game.totalChars}</div>
                                <div className="stat-label">Total</div>
                            </div>
                            <div className="live-stat gray">
                                <div className={`stat-value ${timeLeft < 10 ? "danger" : ""}`}>
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="stat-label">Time</div>
                            </div>
                        </div>

                        <div className="reset-section">
                            <button
                                onClick={() => {startGame()}}
                                className="reset-button"
                            >
                                New game
                            </button>
                            <button
                                onClick={quitGame}
                                className="reset-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {game.state === 'finished' && (
                    <div className="finished-screen">
                        <div className="results-container">
                            <h2>Hoàn thành!</h2>

                            <div className="results-grid">
                                <div className="result-card">
                                    <div className="result-value blue">{game.wpm}</div>
                                    <div className="result-label">WPM</div>
                                    {game.wpm > bestWpm && <div className="record-badge">New record!</div>}
                                </div>
                                <div className="result-card">
                                    <div className="result-value green">{game.accuracy}%</div>
                                    <div className="result-label">Accuracy</div>
                                </div>
                                <div className="result-card">
                                    <div className="result-value purple">{game.correctChars}</div>
                                    <div className="result-label">Correct</div>
                                </div>
                                <div className="result-card">
                                    <div className="result-value orange">{Math.round(getProgress(game))}%</div>
                                    <div className="result-label">Progress</div>
                                </div>
                            </div>

                            {/* Performance Rating */}
                            <div className="performance-rating">
                                <div className="rating-title">Evaluate</div>
                                <div className="rating-text">
                                    {game.wpm >= 60 ? 'Super fast! Check leadboard to see if you on top' :
                                        game.wpm >= 44 ? 'Good! You are quite fast' :
                                            game.wpm >= 32 ? 'Average' :
                                                game.wpm >= 15 ? 'Slow! Training as needed' : 
                                                'Too slow! Is this your the first time using phone or PC?'}
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button
                                    onClick={() => {startGame("old")}}
                                    className="action-button blue"
                                >
                                    Try again
                                </button>
                                <button
                                    onClick={() => {startGame()}}
                                    className="action-button green"
                                >
                                    New game
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FastFinger;