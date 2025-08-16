import { useState, useEffect, useCallback } from 'react';
import './Caro.css'

const Caro = () => {
    const BOARD_SIZE = 15;
    const EMPTY = 0;
    const PLAYER_X = 1;
    const PLAYER_O = 2;

    const [board, setBoard] = useState(() =>
        Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY))
    );
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);
    const [gameStatus, setGameStatus] = useState('playing');
    const [winningLine, setWinningLine] = useState([]);
    const [gameMode, setGameMode] = useState('ai');
    const [aiDifficulty, setAiDifficulty] = useState('medium');
    const [moveCount, setMoveCount] = useState(0);
    const [isAiThinking, setIsAiThinking] = useState(false);

    const checkWin = useCallback((board, row, col, player) => {
        const directions = [
            [0, 1],   // ngang
            [1, 0],   // dọc
            [1, 1],   // chéo chính
            [1, -1]   // chéo phụ
        ];

        for (let [dx, dy] of directions) {
            let count = 1;
            let line = [{ row, col }];

            // Kiểm tra về phía trước
            for (let i = 1; i < 5; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (newRow >= 0 && newRow < BOARD_SIZE &&
                    newCol >= 0 && newCol < BOARD_SIZE &&
                    board[newRow][newCol] === player) {
                    count++;
                    line.push({ row: newRow, col: newCol });
                } else {
                    break;
                }
            }

            // Kiểm tra về phía sau
            for (let i = 1; i < 5; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (newRow >= 0 && newRow < BOARD_SIZE &&
                    newCol >= 0 && newCol < BOARD_SIZE &&
                    board[newRow][newCol] === player) {
                    count++;
                    line.unshift({ row: newRow, col: newCol });
                } else {
                    break;
                }
            }

            if (count >= 5) {
                return line.slice(0, 5); // Chỉ lấy 5 quân đầu tiên
            }
        }

        return null;
    }, []);

    // Đánh giá vị trí cho AI
    const evaluatePosition = useCallback((board, row, col, player) => {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];
        let score = 0;

        for (let [dx, dy] of directions) {
            let count = 1;
            let blocked = 0;

            // Kiểm tra về phía trước
            for (let i = 1; i < 5; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                    if (board[newRow][newCol] === player) {
                        count++;
                    } else if (board[newRow][newCol] !== EMPTY) {
                        blocked++;
                        break;
                    } else {
                        break;
                    }
                } else {
                    blocked++;
                    break;
                }
            }

            // Kiểm tra về phía sau
            for (let i = 1; i < 5; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                    if (board[newRow][newCol] === player) {
                        count++;
                    } else if (board[newRow][newCol] !== EMPTY) {
                        blocked++;
                        break;
                    } else {
                        break;
                    }
                } else {
                    blocked++;
                    break;
                }
            }

            // Tính điểm dựa trên số quân liên tiếp và bị chặn
            if (blocked < 2) {
                switch (count) {
                    case 5: score += 100000; break;
                    case 4: score += blocked === 0 ? 10000 : 1000; break;
                    case 3: score += blocked === 0 ? 1000 : 100; break;
                    case 2: score += blocked === 0 ? 100 : 10; break;
                    default: score += 1;
                }
            }
        }

        return score;
    }, []);

    // AI thực hiện nước đi
    const makeAiMove = useCallback((board) => {
        const availableMoves = [];

        // Tìm tất cả nước đi có thể
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (board[row][col] === EMPTY) {
                    // Chỉ xem xét các ô gần quân cờ đã có
                    let hasNeighbor = false;
                    for (let dr = -2; dr <= 2; dr++) {
                        for (let dc = -2; dc <= 2; dc++) {
                            const nr = row + dr;
                            const nc = col + dc;
                            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                                if (board[nr][nc] !== EMPTY) {
                                    hasNeighbor = true;
                                    break;
                                }
                            }
                        }
                        if (hasNeighbor) break;
                    }

                    if (hasNeighbor || moveCount === 0) {
                        availableMoves.push({ row, col });
                    }
                }
            }
        }

        if (availableMoves.length === 0) return null;

        let bestMove = availableMoves[0];
        let bestScore = -Infinity;

        for (let move of availableMoves) {
            const { row, col } = move;

            // Kiểm tra nước đi thắng ngay
            const testBoard = board.map(r => [...r]);
            testBoard[row][col] = PLAYER_O;
            if (checkWin(testBoard, row, col, PLAYER_O)) {
                return move;
            }

            // Kiểm tra nước đi chặn người chơi thắng
            testBoard[row][col] = PLAYER_X;
            if (checkWin(testBoard, row, col, PLAYER_X)) {
                bestMove = move;
                bestScore = Infinity;
                continue;
            }

            // Đánh giá vị trí
            let score = 0;
            if (aiDifficulty !== 'easy') {
                score += evaluatePosition(board, row, col, PLAYER_O);
                score -= evaluatePosition(board, row, col, PLAYER_X) * 1.1; // Ưu tiên chặn
            }

            // Thêm yếu tố ngẫu nhiên cho AI dễ
            if (aiDifficulty === 'easy') {
                score = Math.random() * 100;
            } else if (aiDifficulty === 'medium') {
                score += Math.random() * 50;
            }

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }, [aiDifficulty, moveCount, checkWin, evaluatePosition]);

    // Xử lý click ô cờ
    const handleCellClick = (row, col) => {
        if (gameStatus !== 'playing' || board[row][col] !== EMPTY) return;
        if (gameMode === 'ai' && currentPlayer === PLAYER_O) return;

        makeMove(row, col, currentPlayer);
    };

    // Thực hiện nước đi
    const makeMove = (row, col, player) => {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = player;
        setBoard(newBoard);
        setMoveCount(prev => prev + 1);

        // Kiểm tra thắng
        const winLine = checkWin(newBoard, row, col, player);
        if (winLine) {
            setWinningLine(winLine);
            setGameStatus(player === PLAYER_X ? 'x-wins' : 'o-wins');
            return;
        }

        // Kiểm tra hòa
        if (moveCount + 1 >= BOARD_SIZE * BOARD_SIZE) {
            setGameStatus('draw');
            return;
        }

        // Đổi lượt
        setCurrentPlayer(player === PLAYER_X ? PLAYER_O : PLAYER_X);
    };

    // AI tự động chơi
    useEffect(() => {
        if (gameMode === 'ai' && currentPlayer === PLAYER_O && gameStatus === 'playing') {
            setIsAiThinking(true);
            const timer = setTimeout(() => {
                const aiMove = makeAiMove(board);
                if (aiMove) {
                    makeMove(aiMove.row, aiMove.col, PLAYER_O);
                }
                setIsAiThinking(false);
            }, aiDifficulty === 'hard' ? 1000 : aiDifficulty === 'medium' ? 500 : 200);

            return () => clearTimeout(timer);
        }
    }, [currentPlayer, gameMode, gameStatus, board, makeAiMove]);

    const resetGame = () => {
        setBoard(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY)));
        setCurrentPlayer(PLAYER_X);
        setGameStatus('playing');
        setWinningLine([]);
        setMoveCount(0);
        setIsAiThinking(false);
    };


    const getCellClass = (row, col) => {
        let baseClass = "caro-cell";

        const isWinningCell = winningLine.some(pos => pos.row === row && pos.col === col);
        if (isWinningCell) {
            baseClass += " winning-cell winning-line ";
        }

        return baseClass;
    };

    const getCellContent = (value) => {
        if (value === PLAYER_X) return <span className="player-x">✕</span>;
        if (value === PLAYER_O) return <span className="player-o">○</span>;
        return null;
    };

    return (
        <div className="caro-container">
            <div className="caro-card">
                {/* Header */}
                <div className="caro-header">
                    <h1>⚫ Cờ caro</h1>
                    <p>Xếp 5 quân thành hàng để thắng</p>
                </div>

                <div className="caro-content">
                    {/* Game Board */}
                    <div className="caro-board-section flex-div">
                        {/* Current Player */}
                        <div className="current-player">
                            {gameStatus === 'playing' ? (
                                <>
                                    Lượt: {currentPlayer === PLAYER_X ?
                                        <span className="player-x">✕ (Bạn)</span> :
                                        <span className="player-o">○ {gameMode === 'ai' ? '(AI)' : '(Người chơi 2)'}</span>
                                    }
                                    {isAiThinking && <span className="ai-thinking">- AI đang suy nghĩ...</span>}
                                </>
                            ) : (
                                <span>Game kết thúc</span>
                            )}
                        </div>

                        {/* Game Status */}
                        {gameStatus === 'x-wins' && (
                            <div className="game-status x-wins">
                                🎉 {gameMode === 'ai' ? 'Bạn thắng!' : 'Người chơi ✕ thắng!'}
                            </div>
                        )}

                        {gameStatus === 'o-wins' && (
                            <div className="game-status o-wins">
                                🎉 {gameMode === 'ai' ? 'AI thắng!' : 'Người chơi ○ thắng!'}
                            </div>
                        )}

                        {gameStatus === 'draw' && (
                            <div className="game-status draw">
                                🤝 Hòa! Bàn cờ đã đầy
                            </div>
                        )}

                        {/* Caro Board */}
                        <div className="board-container">
                            <div
                                className="caro-board"
                                style={{ 
                                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`
                                }}
                            >
                                {board.map((row, rowIndex) =>
                                    row.map((cell, colIndex) => (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={getCellClass(rowIndex, colIndex)}
                                            onClick={() => handleCellClick(rowIndex, colIndex)}
                                        >
                                            {getCellContent(cell)}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div className="reset-section">
                            <button
                                onClick={resetGame}
                                className="reset-button"
                            >
                                Ván mới
                            </button>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="side-panel">
                        {/* Game Settings */}
                        <div className="settings-panel">
                            <h3>Cài đặt game</h3>

                            <div className="settings-content">
                                <div className="setting-group">
                                    <label>
                                        Chế độ chơi:
                                    </label>
                                    <select
                                        value={gameMode}
                                        onChange={(e) => setGameMode(e.target.value)}
                                        disabled={gameStatus === 'playing' && moveCount > 0}
                                    >
                                        <option value="ai">Chơi với AI</option>
                                        <option value="human">2 người chơi</option>
                                    </select>
                                </div>

                                {gameMode === 'ai' && (
                                    <div className="setting-group">
                                        <label>
                                            Độ khó AI:
                                        </label>
                                        <select
                                            value={aiDifficulty}
                                            onChange={(e) => setAiDifficulty(e.target.value)}
                                            disabled={gameStatus === 'playing' && moveCount > 0}
                                        >
                                            <option value="easy">Dễ</option>
                                            <option value="medium">Trung bình</option>
                                            <option value="hard">Khó</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Game Stats */}
                        <div className="stats-panel">
                            <h3>Thống kê</h3>
                            <div className="stats-content">
                                <div className="stat-item">
                                    <span>Số nước đã đi:</span>
                                    <span>{moveCount}</span>
                                </div>
                                <div className="stat-item">
                                    <span>Kích thước bàn:</span>
                                    <span>{BOARD_SIZE}×{BOARD_SIZE}</span>
                                </div>
                                <div className="stat-item">
                                    <span>Điều kiện thắng:</span>
                                    <span>5 quân liên tiếp</span>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="instructions-panel">
                            <h3>Hướng dẫn</h3>
                            <div className="instructions-content">
                                <p>• <span className="player-x">✕</span> - Người chơi 1 (Đỏ)</p>
                                <p>• <span className="player-o">○</span> - {gameMode === 'ai' ? 'AI' : 'Người chơi 2'} (Xanh)</p>
                                <p>• Nhấp vào ô trống để đặt quân</p>
                                <p>• Xếp 5 quân thành hàng để thắng</p>
                                <p>• Có thể thắng theo hàng ngang, dọc, hoặc chéo</p>
                            </div>
                        </div>

                        {/* AI Info */}
                        {gameMode === 'ai' && (
                            <div className="ai-info-panel">
                                <h3>Thông tin AI</h3>
                                <div className="ai-info-content">
                                    <p><strong>Dễ:</strong> AI chơi ngẫu nhiên</p>
                                    <p><strong>Trung bình:</strong> AI có chiến thuật cơ bản</p>
                                    <p><strong>Khó:</strong> AI thông minh, khó thắng</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Caro;