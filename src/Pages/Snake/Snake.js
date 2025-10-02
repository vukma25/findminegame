import { useState, useEffect, useRef, useMemo } from 'react';
import './Snake.css';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const Snake = () => {
    const [rows, setRows] = useState(15);
    const [cols, setCols] = useState(15);
    const [speed, setSpeed] = useState(140);
    const [running, setRunning] = useState(true);
    const [direction, setDirection] = useState('RIGHT');
    const [snake, setSnake] = useState(() => [[7, 5], [7, 4], [7, 3]]);
    const [food, setFood] = useState([7, 10]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(
        Number(localStorage.getItem('snake_highscore') || 0)
    );
    const [gameOver, setGameOver] = useState(false);
    const [paused, setPaused] = useState(false);
    const boardRef = useRef(null);
    const dirRef = useRef(direction);
    const runningRef = useRef(running);

    const cellSize = useMemo(() => 28, []);

    const spawnFood = (snakeArr, r = rows, c = cols) => {
        let fr, fc, bad = true;
        while (bad) {
            fr = randInt(0, r - 1);
            fc = randInt(0, c - 1);
            bad = snakeArr.some(([sr, sc]) => sr === fr && sc === fc);
        }
        return [fr, fc];
    };

    useEffect(() => { dirRef.current = direction; }, [direction]);
    useEffect(() => { runningRef.current = running && !paused; }, [running, paused]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                if (gameOver) return;
                setPaused(p => !p);
                return;
            }
            const k = e.key.toLowerCase();
            const map = {
                arrowup: 'UP', w: 'UP',
                arrowdown: 'DOWN', s: 'DOWN',
                arrowleft: 'LEFT', a: 'LEFT',
                arrowright: 'RIGHT', d: 'RIGHT'
            };
            const next = map[k];
            if (!next) return;

            const cur = dirRef.current;
            const invalid =
                (cur === 'UP' && next === 'DOWN') ||
                (cur === 'DOWN' && next === 'UP') ||
                (cur === 'LEFT' && next === 'RIGHT') ||
                (cur === 'RIGHT' && next === 'LEFT');
            if (!invalid) setDirection(next);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [gameOver]);

    useEffect(() => {
        if (!running || paused || gameOver) return;
        const id = setInterval(() => {
            setSnake(prev => {
                const head = prev[0];
                const dir = dirRef.current;
                let [hr, hc] = head;
                if (dir === 'UP') hr -= 1;
                if (dir === 'DOWN') hr += 1;
                if (dir === 'LEFT') hc -= 1;
                if (dir === 'RIGHT') hc += 1;

                if (hr < 0 || hr >= rows || hc < 0 || hc >= cols) {
                    endGame();
                    return prev;
                }
                if (prev.some(([r, c], idx) => idx !== 0 && r === hr && c === hc)) {
                    endGame();
                    return prev;
                }

                const newHead = [hr, hc];
                const ateFood = (hr === food[0] && hc === food[1]);

                const newSnake = [newHead, ...prev];
                if (!ateFood) {
                    newSnake.pop();
                } else {
                    setScore(s => {
                        const ns = s + 1;
                        if (ns > highScore) {
                            setHighScore(ns);
                            localStorage.setItem('snake_highscore', ns);
                        }
                        return ns;
                    });
                    if ((score + 1) % 5 === 0 && speed > 70) {
                        setSpeed(sp => Math.max(70, sp - 10));
                    }
                    const nf = spawnFood(newSnake, rows, cols);
                    setFood(nf);
                }
                return newSnake;
            });
        }, speed);
        return () => clearInterval(id);
    }, [running, paused, gameOver, rows, cols, speed, food, score, highScore]);

    const endGame = () => {
        setRunning(false);
        setGameOver(true);
    };

    const resetGame = () => {
        const startSnake = [[Math.floor(rows / 2), 5], [Math.floor(rows / 2), 4], [Math.floor(rows / 2), 3]];
        setSnake(startSnake);
        setFood(spawnFood(startSnake, rows, cols));
        setDirection('RIGHT');
        setRunning(true);
        setPaused(false);
        setGameOver(false);
        setScore(0);
    };

    useEffect(() => {
        resetGame();
    }, [rows, cols]);

    const isSnakeCell = (r, c) => snake.some(([sr, sc]) => sr === r && sc === c);
    const isHead = (r, c) => snake.length && snake[0][0] === r && snake[0][1] === c;

    return (
        <div className="snake-game">
            <div className="game-container">
                <div className="game-layout">
                    {/* Game panel */}
                    <div className="game-board">
                        <div className="board-card">
                            {/* Stats */}
                            <div className="stats-container">
                                <div className="stats-group">
                                    <div className="stat score">
                                        Điểm: {score}
                                    </div>
                                    <div className="stat highscore">
                                        Kỷ lục: {highScore}
                                    </div>
                                </div>
                                <div className="action-buttons">
                                    <span className={`status-badge ${paused ? 'paused' : running ? 'running' : 'game-over'}`}>
                                        {gameOver ? 'Kết thúc' : paused ? 'Tạm dừng' : 'Đang chạy'}
                                    </span>
                                    <button
                                        onClick={() => setPaused(p => !p)}
                                        disabled={gameOver}
                                        className="btn pause"
                                    >
                                        {paused ? 'Tiếp tục' : 'Tạm dừng'}
                                    </button>
                                    <button
                                        onClick={resetGame}
                                        className="btn reset"
                                    >
                                        Chơi lại
                                    </button>
                                </div>
                            </div>

                            {/* Board */}
                            <div className="board-wrapper">
                                <div
                                    ref={boardRef}
                                    className="snake-board"
                                    style={{
                                        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                                        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
                                        width: `calc(${cols} * ${cellSize}px + 1rem)`,
                                    }}
                                    aria-label="Bàn chơi rắn săn mồi"
                                >
                                    {Array.from({ length: rows }).map((_, r) =>
                                        Array.from({ length: cols }).map((_, c) => {
                                            const head = isHead(r, c);
                                            const onSnake = isSnakeCell(r, c);
                                            const onFood = (food[0] === r && food[1] === c);
                                            const cellClass = `cell ${onFood ? 'food' : head ? 'head' : onSnake ? 'body' : ''} ${head ? 'pulse-glow' : ''}`;

                                            return (
                                                <div
                                                    key={`${r}-${c}`}
                                                    className={cellClass}
                                                    role="presentation"
                                                    title={onFood ? '🍎' : ''}
                                                ></div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side panel */}
                    <div className="side-panel">
                        <div className="settings-panel">
                            <div className="panel-title">Cài đặt</div>
                            <div className="settings-content">
                                <div className="setting-group">
                                    <label>Số hàng</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="25"
                                        value={rows}
                                        onChange={(e) => setRows(Number(e.target.value))}
                                    />
                                    <div className="setting-value">Hiện tại: {rows}</div>
                                </div>
                                <div className="setting-group">
                                    <label>Số cột</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="25"
                                        value={cols}
                                        onChange={(e) => setCols(Number(e.target.value))}
                                    />
                                    <div className="setting-value">Hiện tại: {cols}</div>
                                </div>
                                <div className="setting-group">
                                    <label>Tốc độ (ms/tick)</label>
                                    <input
                                        type="range"
                                        min="70"
                                        max="300"
                                        step="10"
                                        value={speed}
                                        onChange={(e) => setSpeed(Number(e.target.value))}
                                    />
                                    <div className="setting-value">Hiện tại: {speed} ms</div>
                                </div>
                                <button
                                    onClick={resetGame}
                                    className="btn full-width reset"
                                >
                                    Khởi động lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Snake;