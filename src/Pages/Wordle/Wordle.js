import { useState, useEffect } from 'react';
import './Wordle.css'

const WORDS = [
    'CHIEN', 'THANG', 'NGUOI', 'NHANH', 'TRANG',
    'XANH', 'VANG', 'TRANG', 'DUNG', 'SACH',
    'BANH', 'CANH', 'DANH', 'GANH', 'HANH',
    'LANH', 'MANH', 'NANH', 'PANH', 'RANH',
    'SANH', 'TANH', 'VANH', 'WANH', 'YANH'
];

const Wordle = () => {
    const [targetWord, setTargetWord] = useState('');
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing');
    const [currentRow, setCurrentRow] = useState(0);
    const [keyboardStatus, setKeyboardStatus] = useState({});
    const [showInvalidWord, setShowInvalidWord] = useState(false);

    useEffect(() => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setTargetWord(randomWord);
    }, []);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (gameStatus !== 'playing') return;

            const key = e.key.toUpperCase();

            if (key === 'ENTER') {
                handleSubmitGuess();
            } else if (key === 'BACKSPACE') {
                handleDeleteLetter();
            } else if (key.match(/[A-Z]/) && key.length === 1) {
                handleAddLetter(key);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentGuess, gameStatus]);

    const handleAddLetter = (letter) => {
        if (currentGuess.length < 5) {
            setCurrentGuess(prev => prev + letter);
        }
    };

    const handleDeleteLetter = () => {
        setCurrentGuess(prev => prev.slice(0, -1));
    };

    const handleSubmitGuess = () => {
        if (currentGuess.length !== 5) return;

        if (!WORDS.includes(currentGuess)) {
            setShowInvalidWord(true);
            setTimeout(() => setShowInvalidWord(false), 1000);
            return;
        }

        const newGuess = {
            word: currentGuess,
            result: getGuessResult(currentGuess, targetWord)
        };

        const newGuesses = [...guesses, newGuess];
        setGuesses(newGuesses);
        updateKeyboardStatus(currentGuess, newGuess.result);

        if (currentGuess === targetWord) {
            setGameStatus('won');
        } else if (newGuesses.length >= 6) {
            setGameStatus('lost');
        }

        setCurrentGuess('');
        setCurrentRow(prev => prev + 1);
    };

    const getGuessResult = (guess, target) => {
        const result = [];
        const targetLetters = target.split('');
        const guessLetters = guess.split('');

        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null;
                guessLetters[i] = null;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] && targetLetters.includes(guessLetters[i])) {
                result[i] = 'present';
                const targetIndex = targetLetters.indexOf(guessLetters[i]);
                targetLetters[targetIndex] = null;
            } else if (guessLetters[i]) {
                result[i] = 'absent';
            }
        }

        return result;
    };

    const updateKeyboardStatus = (guess, result) => {
        const newStatus = { ...keyboardStatus };

        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const status = result[i];

            if (status === 'correct') {
                newStatus[letter] = 'correct';
            } else if (status === 'present' && newStatus[letter] !== 'correct') {
                newStatus[letter] = 'present';
            } else if (status === 'absent' && !newStatus[letter]) {
                newStatus[letter] = 'absent';
            }
        }

        setKeyboardStatus(newStatus);
    };

    const resetGame = () => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setTargetWord(randomWord);
        setCurrentGuess('');
        setGuesses([]);
        setGameStatus('playing');
        setCurrentRow(0);
        setKeyboardStatus({});
    };

    const getCellClass = (letter, status, isCurrentRow = false) => {
        let baseClass = "wordle-cell";

        if (status === 'correct') {
            baseClass += " correct";
        } else if (status === 'present') {
            baseClass += " present";
        } else if (status === 'absent') {
            baseClass += " absent";
        } else if (letter) {
            baseClass += " filled";
        }

        if (isCurrentRow && showInvalidWord) {
            baseClass += " shake";
        }

        return baseClass;
    };

    const getKeyClass = (letter) => {
        let baseClass = "keyboard-key";

        const status = keyboardStatus[letter];
        if (status === 'correct') {
            baseClass += " correct";
        } else if (status === 'present') {
            baseClass += " present";
        } else if (status === 'absent') {
            baseClass += " absent";
        }

        return baseClass;
    };

    const keyboard = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    return (
        <div className="wordle-container">
            <div className="wordle-card">
                {/* Header */}
                <div className="wordle-header">
                    <h1>🔤 Wordle</h1>
                    <p>Đoán từ 5 chữ cái trong 6 lần thử</p>
                </div>

                {/* Game Status */}
                {gameStatus === 'won' && (
                    <div className="game-status won">
                        🎉 Chúc mừng! Bạn đã đoán đúng từ "{targetWord}"!
                    </div>
                )}

                {gameStatus === 'lost' && (
                    <div className="game-status lost">
                        😔 Bạn đã thua! Từ đúng là "{targetWord}"
                    </div>
                )}

                {showInvalidWord && (
                    <div className="game-status invalid">
                        ⚠️ Từ không hợp lệ!
                    </div>
                )}

                {/* Game Grid */}
                <div className="wordle-grid">
                    {Array.from({ length: 6 }, (_, rowIndex) => (
                        <div key={rowIndex} className="wordle-row">
                            {Array.from({ length: 5 }, (_, colIndex) => {
                                let letter = '';
                                let status = '';

                                if (rowIndex < guesses.length) {
                                    letter = guesses[rowIndex].word[colIndex];
                                    status = guesses[rowIndex].result[colIndex];
                                } else if (rowIndex === currentRow) {
                                    letter = currentGuess[colIndex] || '';
                                }

                                return (
                                    <div
                                        key={colIndex}
                                        className={getCellClass(letter, status, rowIndex === currentRow)}
                                    >
                                        {letter}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Virtual Keyboard */}
                <div className="keyboard">
                    {keyboard.map((row, rowIndex) => (
                        <div key={rowIndex} className="keyboard-row">
                            {row.map((key) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        if (key === 'ENTER') {
                                            handleSubmitGuess();
                                        } else if (key === '⌫') {
                                            handleDeleteLetter();
                                        } else {
                                            handleAddLetter(key);
                                        }
                                    }}
                                    disabled={gameStatus !== 'playing'}
                                    className={`${getKeyClass(key)} ${key === 'ENTER' || key === '⌫' ? 'special-key' : ''}`}
                                >
                                    {key === '⌫' ? '⌫' : key}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Reset Button */}
                <div className="reset-section">
                    <button
                        onClick={resetGame}
                        className="reset-button"
                    >
                        🔄 Chơi lại
                    </button>
                </div>

                {/* Instructions */}
                <div className="instructions">
                    <p>💡 <span className="color-sample correct"></span> Đúng vị trí</p>
                    <p><span className="color-sample present"></span> Có trong từ nhưng sai vị trí</p>
                    <p><span className="color-sample absent"></span> Không có trong từ</p>
                </div>
            </div>
        </div>
    );
};

export default Wordle;