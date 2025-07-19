import Minesweeper from '../../Pages/MinesweeperPage/Minesweeper'
import { Link } from 'react-router-dom'
import './Card.css'

function Card({ title, description, logo, sourceBg}) {

    const arrow = '>';

    return (
        <div className="card">
            <div className="card-image" style={{background: `${sourceBg}`}}></div>
            <div className="card-detail">
                <div className="card-detail-logo"></div>
                <h2 className="card-detail-title">{title}</h2>
                <p className="card-detail-description">{description}</p>
                <Link 
                    to={`/games/${title.toLowerCase()}`} 
                    element={<Minesweeper />}
                    className="card-detail-btn flex-div"
                >
                    Play now
                    <span className="card-detail-btn-arrow">{arrow}</span>
                </Link>
            </div>
        </div>
    )
}

export default Card