
import { Link } from 'react-router'

const formatTime = (clock) => {
    if (!clock) return
    return `${clock.minute.toString().padStart(2, '0')}:${clock.second.toString().padStart(2, '0')}`;
}

export default function InformBoard({ isWin, errors, timeFinish, setModal }) {
    return (
        // Bảng thông báo kết quả
        <div className="sudoku-modal">
            <div className="modal-content">
                <span className="close" onClick={() => {setModal(false)}}>&times;</span>
                <div className="result-icon"></div>
                <h2 className="result-title">Kết Quả</h2>
                <p className="result-message">
                    {`${isWin ? "Bạn đã giải thành công câu đố" :
                        "Bạn đã thất bại trong việc giải câu đố"
                    }`}
                </p>
                <div className="result-stats">
                    <p className="result-time">Thời gian: {formatTime(timeFinish)}</p>
                    <p className="result-mistakes">Số lỗi: {errors}</p>
                </div>
                <Link to="/" className="result-btn-go-home">Home</Link>
            </div>
        </div>
    )
}