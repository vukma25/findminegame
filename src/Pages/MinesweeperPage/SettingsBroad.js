import { Icon, Slider } from '@mui/material'
import {
    setCol,
    setRow,
    setPro,
    setDuration,
    setTime,
    setInGame,
    setResetSetting
} from './Action'

function SettingsBroad({
    settings,
    dispatch,
    marks,
    convertToMinute
}) {
    return (
        <div
            className={`
                customize-broad 
                ${settings.level === 4 && !settings.hidden ?
                    "" : "customize-broad__hidden"
                }
            `}
        >
            <div className="customize-container">
                <div className="customize-field">
                    <div className="customize-name flex-div">
                        <Icon
                            className="customize-name-icon"
                        >table_rows_narrow</Icon><p>Row</p>
                    </div>
                    <p className="customize-data">{settings.row}</p>
                </div>
                <Slider
                    className="range-allow"
                    valueLabelDisplay="auto"
                    defaultValue={20}
                    min={10}
                    max={30}
                    value={settings.row}
                    disabled={settings.isInGame}
                    onChange={(_, newValue) => dispatch(setRow(newValue))}
                />
            </div>
            <div className="customize-container">
                <div className="customize-field">
                    <div className="customize-name flex-div">
                        <Icon
                            className="customize-name-icon"
                        >calendar_view_week</Icon><p>Column</p>
                    </div>
                    <p className="customize-data">{settings.col}</p>
                </div>
                <Slider
                    className="range-allow"
                    valueLabelDisplay="auto"
                    defaultValue={20}
                    min={10}
                    max={30}
                    value={settings.col}
                    disabled={settings.isInGame}
                    onChange={(_, newValue) => dispatch(setCol(newValue))}
                />
            </div>
            <div className="customize-container">
                <div className="customize-field">
                    <div className="customize-name flex-div">
                        <Icon
                            className="customize-name-icon"
                        >percent</Icon><p>Proportion</p>
                    </div>
                    <p className="customize-data">{settings.proportion}</p>
                </div>  
                <Slider
                    className="difficulty"
                    valueLabelDisplay="auto"
                    defaultValue={1.5}
                    step={0.5}
                    min={1.5}
                    max={4.5}
                    marks={marks}
                    disabled={settings.isInGame}
                    sx={{
                        '& .MuiSlider-markLabel': {
                            color: 'var(--cl-primary-purple)',
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            transform: 'translateY(-.2rem)'
                        },
                        color: `${settings.proportion >= 4 ? "red" : 
                                settings.proportion >= 2.5 ? "var(--cl-primary-purple)" : "green"
                            }`
                    }}
                    value={settings.proportion}
                    onChange={(_, newValue) => dispatch(setPro(newValue))}
                />
            </div>
            <div className="customize-container">
                <div className="customize-field">
                    <div className="customize-name flex-div">
                        <Icon
                            className="customize-name-icon"
                        >all_out</Icon><p>Mines</p>
                    </div>
                    <p className="customize-data">{settings.mine}</p>
                </div>
                <Slider
                    className="range-allow"
                    valueLabelDisplay="auto"
                    value={settings.mine}
                    min={15}
                    max={135}
                    disabled
                />
            </div>
            <div className="setting-time flex-div">
                <input
                    type="checkbox"
                    id="setTime"
                    checked={settings.setTime.isTime}
                    onChange={() => dispatch(setTime())}
                    disabled={settings.isInGame}
                />
                <label htmlFor="setTime">set time</label>
            </div>
            {
                settings.setTime.isTime &&
                <div className="customize-container">
                    <div className="customize-field">
                        <div className="customize-name flex-div">
                            <Icon
                                className="customize-name-icon"
                            >alarm</Icon><p>Time (s)</p>
                        </div>
                        <p className="customize-data">
                            {`${settings.setTime.duration}s ~ ${convertToMinute(settings.setTime.duration)
                                }`}
                        </p>
                    </div>
                    <Slider
                        className="range-allow"
                        valueLabelDisplay="auto"
                        step={60}
                        min={300}
                        max={900}
                        value={settings.setTime.duration}
                            onChange={(_, newValue) => dispatch(setDuration(newValue))}
                        marks
                        disabled={settings.isInGame}
                    />
                </div>
            }
            <button
                className="confirm-customize"
                onClick={() => dispatch(setInGame())}
                disabled={settings.isInGame}
            >
                Ok
            </button>
            {
                settings.isInGame &&
                <button
                    className="reset-customize"
                    onClick={() => dispatch(setResetSetting())}
                >
                    Reset
                </button>
            }
        </div>
    )
}

export default SettingsBroad