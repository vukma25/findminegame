import { useState, useReducer } from 'react'
import OptionsBar from './OptionBar';
import SettingsBroad from './SettingsBroad';
import GameOver from './GameOver'
import Cell from './Cell';
import Tool from './Tool';
import Logger from '../../Components/Logger/Logger'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn';
import { initialState, reducer } from './Reducer'
import {
    marks,
    convertToMinute,
    isMobileDevice,
    isWin
} from './Functions';
import "./Minesweeper.css";


function Minesweeper() {

    const [settings, dispatch] = useReducer(reducer, initialState)
    const [timeFinish, setTimeFinish] = useState({})
    const [log, setLog] = useState({
        "message": settings.logError,
        "type": "info"
    })

    return (
        <>
            <Tool
                dispatch={dispatch}
                settings={settings}
            />
            <div className="minesweeper">
                {/* Thanh thong tin */}
                <OptionsBar
                    setTimeFinish={setTimeFinish}
                    settings={settings}
                    dispatch={dispatch}
                />
                <div className="minesweeper-broad">
                    {/* Bang cau hinh game */}
                    <SettingsBroad
                        settings={settings}
                        dispatch={dispatch}
                        marks={marks}
                        convertToMinute={convertToMinute}
                    />
                       
                    {/* Bang game chinh */}
                    <div
                        className="game-broad"
                        style={
                            {
                                display: 'grid',
                                gridTemplateRows:
                                    `repeat(
                                    ${settings.row},
                                    ${isMobileDevice() ? 3 : 4}rem
                                )`,
                                gridTemplateColumns:
                                    `repeat(
                                    ${settings.col},
                                    ${isMobileDevice() ? 3 : 4}rem
                                )`,
                            }
                        }
                    >
                        {
                            settings.gameOver &&
                            <GameOver
                                dispatch={dispatch}
                                message={settings.message}
                                isWin={isWin(settings)}
                            />
                        }
                        {
                            settings.cells?.map((cell, index) => {
                                return <Cell
                                    key={index}
                                    mine={cell.mine}
                                    dispatch={dispatch}
                                    index={index}
                                    settings={settings}
                                    setLog={setLog}
                                />
                            })
                        }
                    </div>
                </div>
            </div>
            <Logger log={log} setLog={setLog} />
            <GoTopBtn />
        </>
    )
}

export default Minesweeper
