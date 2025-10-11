import { useState, useEffect } from 'react';
import WORDS from '../../VocabResource'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material'
import VirtualKeyBoard from './VirtualKeyBoard'
import Logger from '../../Components/Logger/Logger'
import Modal from './Modal';
import '../../assets/styles/Wordle.css'

const Wordle = () => {
    const [lengthWord, setLengthWord] = useState(4)
    const [targetWord, setTargetWord] = useState('') // từ được random từ kho từ, và là từ cần đoán
    const [currentGuess, setCurrentGuess] = useState('') // từ đang đoán hiện tại
    const [guesses, setGuesses] = useState([]) // chuỗi lịch sử các từ đã đoán
    const [gameStatus, setGameStatus] = useState('playing')
    const [currentRow, setCurrentRow] = useState(0)
    const [keyboardStatus, setKeyboardStatus] = useState({})
    const [log, setLog] = useState({
        'message': '',
        'type': 'info'
    })
    const [modal, setModal] = useState(false)

    useEffect(() => {
        newGame()
    }, [lengthWord]);

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

    const handleRandomWord = () => {
        const listWords = WORDS[lengthWord]
        let randomNum = Math.floor(Math.random() * listWords.length)
        let randomWord = listWords[randomNum];

        //chưa đảm bảo được danh sách hoàn toàn chỉ chứa các từ có độ dài bằng với key
        //nên phải random cho tới khi hợp lệ -> đảm bảo
        while (randomWord.length !== lengthWord) {
            randomNum = Math.floor(Math.random() * listWords.length)
            randomWord = listWords[randomNum];
        }

        return randomWord
    }

    const handleAddLetter = (letter) => {
        if (currentGuess.length < lengthWord) {
            setCurrentGuess(prev => prev + letter);
        }
    }

    const handleDeleteLetter = () => {
        setCurrentGuess(prev => prev.slice(0, -1));
    }

    const handleSubmitGuess = () => {
        if (currentGuess.length !== lengthWord) {
            setLog({
                'message': 'Too short',
                'type': 'info'
            })
            return
        }

        const lowerCurrentGuess = currentGuess.toLowerCase()

        if (!WORDS[lengthWord].includes(lowerCurrentGuess)) {
            setLog({
                'message': 'This word is invalid or its not in data resource',
                'type': 'info'
            })
            return;
        }

        const newGuess = {
            word: currentGuess,
            result: getGuessResult(lowerCurrentGuess, targetWord)
        };

        const newGuesses = [...guesses, newGuess];
        setGuesses(newGuesses);
        updateKeyboardStatus(currentGuess, newGuess.result);

        if (lowerCurrentGuess === targetWord) {
            setGameStatus('won');
            setModal(true)
        } else if (newGuesses.length >= 6) {
            setGameStatus('lost');
            setModal(true)
        }

        setCurrentGuess('');
        setCurrentRow(prev => prev + 1);
    }

    //just use VirtualKeyBoard
    const handlePressKey = (key) => {
        if (key === 'ENTER') {
            handleSubmitGuess();
        } else if (key === 'DELETE') {
            handleDeleteLetter();
        } else {
            handleAddLetter(key);
        }
    }

    const getGuessResult = (guess, target) => {
        const result = Array.from({ length: lengthWord }, () => '')
        const targetLetters = target.split('');
        const guessLetters = guess.split('');

        // khớp kí tự đúng và xóa chúng
        for (let i = 0; i < lengthWord; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null;
                guessLetters[i] = null;
            }
        }

        // các kí tự còn lại, có thể là tồn tại nhưng đặt sai vị trí, hoặc không tồn tại trong từ cần đoán
        for (let i = 0; i < lengthWord; i++) {
            if (guessLetters[i] && targetLetters.includes(guessLetters[i])) {
                result[i] = 'present';
                const targetIndex = targetLetters.indexOf(guessLetters[i]);
                targetLetters[targetIndex] = null;
            } else if (guessLetters[i]) {
                result[i] = 'absent';
            }
        }

        return result;
    }

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
    }

    const handleSelectChange = (e) => {
        const value = e.target.value
        setLengthWord(value)
    }

    const newGame = () => {
        const newWord = handleRandomWord()
        setTargetWord(newWord);
        setCurrentGuess('');
        setGuesses([]);
        setGameStatus('playing');
        setCurrentRow(0);
        setKeyboardStatus({});
    }

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

        if (isCurrentRow && log.message.length !== 0) {
            baseClass += " shake";
        }

        return baseClass;
    }

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
    }

    return (
        <div className="wordle-container">
            <div className="wordle-card flex-div">
                <div className="wordle-stats flex-div">
                    <button
                        className="wordle-btn-new-game"
                        onClick={newGame}
                    >New game</button>
                    <FormControl className="wordle-select-len-word">
                        <InputLabel className="select-label" id="select-len-word">The length of word</InputLabel>
                        <Select
                            className="select-input"
                            label={"The length of word"}
                            labelId="select-len-word"
                            value={lengthWord}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Game Grid */}
                <div className="wordle-grid">
                    {Array.from({ length: 6 }, (_, rowIndex) => (
                        <div key={rowIndex}
                            className="wordle-row"
                            style={{ gridTemplateColumns: `repeat(${lengthWord}, minmax(4rem, 5rem))` }}
                        >
                            {Array.from({ length: lengthWord }, (_, colIndex) => {
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

                <VirtualKeyBoard gameStatus={gameStatus} getKeyClass={getKeyClass} handlePressKey={handlePressKey} />
            </div>
            <Logger log={log} setLog={setLog} />
            {modal && 
            <Modal 
                targetWord={targetWord} 
                setModal={setModal} 
                newGame={newGame}
                gameStatus={gameStatus}
            />}
        </div>
    );
};

export default Wordle;