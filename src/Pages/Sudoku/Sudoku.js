import { useState, useEffect } from 'react'
import './Sudoku.css';

function Sudoku() {

    const initialBoard = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    const [board, setBoard] = useState(initialBoard.map(row => [...row]));
    const [selectedCell, setSelectedCell] = useState(null);
    const [errors, setErrors] = useState(new Set());
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    // Timer
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimer(timer => timer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Kiểm tra số hợp lệ
    const isValidMove = (board, row, col, num) => {
        // Kiểm tra hàng
        for (let x = 0; x < 9; x++) {
            if (x !== col && board[row][x] === num) return false;
        }

        // Kiểm tra cột
        for (let x = 0; x < 9; x++) {
            if (x !== row && board[x][col] === num) return false;
        }

        // Kiểm tra ô 3x3
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const currentRow = startRow + i;
                const currentCol = startCol + j;
                if (currentRow !== row && currentCol !== col &&
                    board[currentRow][currentCol] === num) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleCellClick = (row, col) => {
        if (initialBoard[row][col] === 0) {
            setSelectedCell({ row, col });
        }
    };

    const handleNumberInput = (num) => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = num;

        const newErrors = new Set(errors);
        const errorKey = `${row}-${col}`;

        if (num === 0 || isValidMove(newBoard, row, col, num)) {
            newErrors.delete(errorKey);
        } else {
            newErrors.add(errorKey);
        }

        setBoard(newBoard);
        setErrors(newErrors);
    };

    const resetGame = () => {
        setBoard(initialBoard.map(row => [...row]));
        setSelectedCell(null);
        setErrors(new Set());
        setTimer(0);
        setIsRunning(true);
    };

    const getCellClass = (row, col) => {
        let baseClass = "cell-base ";

        // Màu nền cho ô ban đầu
        if (initialBoard[row][col] !== 0) {
            baseClass += "cell-base__number ";
        } else {
            baseClass += "cell-base__empty ";
        }

        // Ô được chọn
        if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
            baseClass += "cell-active ";
        }

        // Ô có lỗi
        if (errors.has(`${row}-${col}`)) {
            baseClass += "cell-error ";
        }

        // Đường viền đậm cho các ô 3x3
        if (row % 3 === 0 && row) baseClass += "row-3 ";
        if (col % 3 === 0 && col) baseClass += "col-3 ";

        return baseClass;
    };

    return (
        <div className="sudoku-container">
            <div className="sudoku-card">
                {/* Header */}
                <div className="sudoku-header">
                    <h1>🧩 Sudoku</h1>
                    <p>Điền số từ 1-9 vào các ô trống</p>
                </div>

                {/* Game Stats */}
                <div className="game-stats">
                    <div className="stat-item">
                        <div className="stat-value time">{formatTime(timer)}</div>
                        <div className="stat-label">Thời gian</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value errors">{errors.size === 0 ? '✓' : errors.size}</div>
                        <div className="stat-label">Lỗi</div>
                    </div>
                    <button
                        onClick={resetGame}
                        className="reset-button"
                    >
                        Chơi lại
                    </button>
                </div>

                {/* Sudoku Board */}
                <div className="sudoku-board">
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={getCellClass(rowIndex, colIndex)}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                {cell !== 0 ? cell : ''}
                            </div>
                        ))
                    )}
                </div>

                {/* Number Input */}
                <div className="number-input">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handleNumberInput(num)}
                            disabled={!selectedCell}
                            className="number-button"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={() => handleNumberInput(0)}
                        disabled={!selectedCell}
                        className="clear-button"
                    >
                        ✕
                    </button>
                </div>

                {/* Instructions */}
                <div className="instructions">
                    <p>💡 Nhấp vào ô trống để chọn, sau đó nhấp số để điền</p>
                    <p>Mỗi hàng, cột và ô 3×3 phải chứa các số từ 1-9</p>
                </div>
            </div>
        </div>
    );
}

export default Sudoku