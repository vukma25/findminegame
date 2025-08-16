import { useState, useEffect, useMemo, useRef } from 'react';
import './Memory.css'

const EMOJI_POOL = [
    '🍎', '🍌', '🍉', '🍇', '🍓', '🍍', '🥝', '🍑',
    '🍔', '🍕', '🌭', '🍣', '🍪', '🍩', '🧁', '🍰',
    '⚽', '🏀', '🏈', '🎾', '🏐', '🎱', '🏓', '🥊',
    '🚗', '🚀', '✈️', '🚲', '🚁', '🚂', '🛵', '🚜',
    '🐶', '🐱', '🦊', '🐻', '🐼', '🐸', '🐵', '🦄',
    '🌵', '🌲', '🌻', '🌷', '🌈', '❄️', '🔥', '⭐'
];

function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const Memory = () => {
    const [rows, setRows] = useState(4);
    const [cols, setCols] = useState(4);
    const [hardMode, setHardMode] = useState(false);
    const [timeLimit, setTimeLimit] = useState(90);
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    const totalCards = rows * cols;
    const totalPairs = Math.floor(totalCards / 2);

    const [deck, setDeck] = useState([]);
    const [firstPick, setFirstPick] = useState(null);
    const [secondPick, setSecondPick] = useState(null);
    const [busy, setBusy] = useState(false);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);
    const timerRef = useRef(null);

    const bestKey = useMemo(() => `memory_best_${rows}x${cols}${hardMode ? '_hard' : ''}`, [rows, cols, hardMode]);
    const [bestMoves, setBestMoves] = useState(() => Number(localStorage.getItem(bestKey) || 0));

    const initDeck = () => {
        const chosen = shuffle(EMOJI_POOL).slice(0, totalPairs);
        const base = shuffle([...chosen, ...chosen]).slice(0, totalCards);
        const withIds = base.map((v, i) => ({
            id: i + '-' + Math.random().toString(36).slice(2, 7),
            value: v,
            flipped: false,
            matched: false
        }));
        setDeck(withIds);
        setFirstPick(null);
        setSecondPick(null);
        setMoves(0);
        setMatches(0);
        setGameOver(false);
        setVictory(false);
        setBusy(false);
        setTimeLeft(timeLimit);
        if (timerRef.current) clearInterval(timerRef.current);
        if (hardMode) startTimer();
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    setGameOver(true);
                    setVictory(false);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        setBestMoves(Number(localStorage.getItem(bestKey) || 0));
    }, [bestKey]);

    useEffect(() => {
        initDeck();
    }, [rows, cols, hardMode, timeLimit]);

    const handleFlip = (card) => {
        if (busy || gameOver || victory) return;
        if (card.flipped || card.matched) return;

        setDeck(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c));

        if (!firstPick) {
            setFirstPick(card);
            return;
        }
        if (firstPick && !secondPick) {
            setSecondPick(card);
            setBusy(true);
            setMoves(m => m + 1);

            setTimeout(() => {
                setDeck(prev => {
                    const a = prev.find(c => c.id === firstPick.id) || firstPick;
                    const b = prev.find(c => c.id === card.id) || card;
                    if (a.value === b.value) {
                        setMatches(mt => mt + 1);
                        return prev.map(c =>
                            c.value === a.value ? { ...c, matched: true } : c
                        );
                    } else {
                        return prev.map(c =>
                            (c.id === a.id || c.id === b.id) ? { ...c, flipped: false } : c
                        );
                    }
                });
                setFirstPick(null);
                setSecondPick(null);
                setBusy(false);
            }, 700);
        }
    };

    useEffect(() => {
        if (matches === totalPairs && totalPairs > 0) {
            setVictory(true);
            setGameOver(false);
            if (hardMode && timerRef.current) clearInterval(timerRef.current);
            if (bestMoves === 0 || moves < bestMoves) {
                setBestMoves(moves);
                localStorage.setItem(bestKey, String(moves));
            }
        }
    }, [matches, totalPairs, moves, bestMoves, bestKey, hardMode]);

    const resetGame = () => initDeck();

    const gridStyle = {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
    };

    return (
        <div className="memory-game">
            <div className="game-container">
                {/* Header */}
                <div className="game-header">
                    <h1>🧠 Memory Game</h1>
                    <p>Lật thẻ tìm cặp giống nhau. Hoàn thành với ít lượt nhất!</p>
                </div>

                <div className="game-layout">
                    {/* Board */}
                    <div className="game-board">
                        <div className="board-card">
                            {/* Stats */}
                            <div className="stats-container">
                                <div className="stats-group">
                                    <div className="stat moves">
                                        🎯 Lượt: {moves}
                                    </div>
                                    <div className="stat matches">
                                        ✅ Cặp: {matches}/{totalPairs}
                                    </div>
                                    {hardMode && (
                                        <div className={`stat timer ${timeLeft <= 10 ? 'critical' : ''}`}>
                                            ⏳ Thời gian: {timeLeft}s
                                        </div>
                                    )}
                                </div>
                                <div className="action-buttons">
                                    <button onClick={resetGame} className="btn reset">🔄 Chơi mới</button>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="cards-grid" style={gridStyle}>
                                {deck.map((card) => {
                                    const stateClass = card.matched ? 'matched' : card.flipped ? 'flipped' : '';
                                    return (
                                        <button
                                            key={card.id}
                                            className={`memory-card ${stateClass}`}
                                            onClick={() => handleFlip(card)}
                                            aria-label={card.flipped || card.matched ? `Thẻ ${card.value}` : 'Lật thẻ'}
                                        >
                                            <div className="card-inner">
                                                <div className="card-face front">?</div>
                                                <div className="card-face back">{card.value}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Result */}
                            {(victory || gameOver) && (
                                <div className="result-message">
                                    {victory ? (
                                        <div className="victory">
                                            <div className="title">🎉 Tuyệt vời! Bạn đã hoàn thành.</div>
                                            <div className="subtitle">Tổng lượt: {moves}{bestMoves === moves ? ' • Kỷ lục mới!' : ''}</div>
                                        </div>
                                    ) : (
                                        <div className="game-over">
                                            <div className="title">💥 Hết thời gian!</div>
                                            <div className="subtitle">Thử lại với chiến thuật khác nhé.</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side panel */}
                    <div className="side-panel">
                        <div className="settings-panel">
                            <div className="panel-title">Cài đặt</div>
                            <div className="settings-content">
                                <div className="setting-group">
                                    <label>Số hàng</label>
                                    <select
                                        value={rows}
                                        onChange={(e) => setRows(Number(e.target.value))}
                                    >
                                        {[2, 3, 4, 5, 6].map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="setting-group">
                                    <label>Số cột</label>
                                    <select
                                        value={cols}
                                        onChange={(e) => setCols(Number(e.target.value))}
                                    >
                                        {[2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="setting-group toggle">
                                    <div>
                                        <div className="label">Chế độ khó</div>
                                        <div className="description">Đếm ngược thời gian</div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={hardMode} onChange={(e) => setHardMode(e.target.checked)} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                {hardMode && (
                                    <div className="setting-group">
                                        <label>Thời gian (giây)</label>
                                        <input
                                            type="range" min="30" max="180" step="10"
                                            value={timeLimit}
                                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                                        />
                                        <div className="time-display">Giới hạn: {timeLimit}s</div>
                                    </div>
                                )}
                                <div className="action-buttons">
                                    <button onClick={resetGame} className="btn reset">🔄 Chơi mới</button>
                                    <button onClick={initDeck} className="btn shuffle">🔁 Xáo bài</button>
                                </div>
                            </div>
                        </div>

                        <div className="best-score-panel">
                            <div className="panel-title">Kỷ lục</div>
                            <div className="score">Lưới {rows}×{cols}{hardMode ? ' • Khó' : ''}: {bestMoves || '—'} lượt</div>
                        </div>

                        <div className="tips-panel">
                            <div className="panel-title">Mẹo</div>
                            <ul className="tips-list">
                                <li>Quan sát theo nhóm, ghi nhớ vị trí theo hàng/cột.</li>
                                <li>Lật nhanh hai thẻ đầu để xác định mốc so sánh.</li>
                                <li>Càng ít lượt càng tốt — đừng vội nếu không chắc chắn.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="game-footer">
                    Gợi ý: Lưới chẵn x chẵn sẽ luôn cân đối cặp thẻ.
                </div>
            </div>
        </div>
    );
};

export default Memory;