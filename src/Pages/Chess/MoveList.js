import { useEffect, useRef } from 'react'
import Icon from '@mui/material/Icon';
import wp from '../../assets/image/wp.png'
import wq from '../../assets/image/wq.png'
import wk from '../../assets/image/wk.png'
import wn from '../../assets/image/wn.png'
import wr from '../../assets/image/wr.png'
import wb from '../../assets/image/wb.png'
import bp from '../../assets/image/bp.png'
import bq from '../../assets/image/bq.png'
import bk from '../../assets/image/bk.png'
import bn from '../../assets/image/bn.png'
import br from '../../assets/image/br.png'
import bb from '../../assets/image/bb.png'

function MoveList({ moves, setInGame }) {

    const image = {
        wp,
        wr,
        wk,
        wq,
        wn,
        wb,
        bp,
        br,
        bk,
        bq,
        bn,
        bb,

    }

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [moves])

    return (
        <div className="move-list-wrapper flex-div">
            <div className="move-list-header">Starting Position</div>
            <div className="move-list" ref={scrollRef}>
                {moves.map(({ turn, white, black }) => {
                    const whiteIsCurrent = (
                        turn === moves.length &&
                        !black
                    ) ? "move-current" : ""
                    const blackIsCurrent = (
                        turn === moves.length &&
                        black
                    ) ? "move-current" : ""


                    return (
                        <div key={turn} className="move-row">
                            <div className="move-num">{turn}.</div>
                            <div className="move-container flex-div">
                                <div className={`move move-white flex-div ${whiteIsCurrent}`}>
                                    <img src={image[white?.piece]} alt={white?.piece} />
                                    <p className="flex-div">{white?.move}</p>
                                </div>
                            </div>
                            <div className="move-container flex-div">
                                {black && <div className={`move move-white flex-div ${blackIsCurrent}`}>
                                    <img src={image[black?.piece]} alt={black?.piece} />
                                    <p className="flex-div">{black?.move}</p>
                                </div>}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='move-list-option flex-div'>
                <div className='move-list-new-game flex-div'>
                    <Icon
                        sx={{ fontSize: '3.5rem' }}
                    >add</Icon>
                    <p>New Game</p>
                </div>
                <div 
                    className='move-list-resign flex-div'
                    onClick={() => { setInGame(false) }}
                >
                    <Icon
                        sx={{ fontSize: '3rem' }}
                    >flag</Icon>
                    <p>Resign</p>
                </div>
            </div>
            <div className="move-list-settings flex-div">
                <Icon
                    sx={{ fontSize: '3rem' }}
                >settings</Icon>
                <p>Settings</p>
            </div>
        </div>
    );
};

export default MoveList;
