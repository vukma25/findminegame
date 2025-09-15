import { useEffect, useState } from 'react';
import Icon from '@mui/material/Icon';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import ClockBase from '../../Components/ClockBase/ClockBase';
import Clock from './Clock'
import {
    setToggleSetting,
    setSelect
} from './Action'


const BootstrapInput = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        border: '.1rem solid var(--cl-gray)',
        padding: '1rem 2.6rem .5rem 1.2rem',
        fontSize: '1.4rem',

        '&:focus': {
            borderColor: 'var(--cl-primary-purple)'
        }
    }
}
));

function OptionsBar({ setTimeFinish, settings, dispatch }) {
    const [semaphore, setSemaphore] = useState(false)

    function handleAssignSemaphore () {
        if (settings.gameOver) {
            setSemaphore(true)
        }
        else if (settings.level === 4 && !settings.isInGame) {
            setSemaphore(true)
        } 
        else {
            setSemaphore(false)
        }
    }

    useEffect(() => {
        handleAssignSemaphore()
    }, [settings.level, settings.gameOver, settings.isInGame])

    return (
        <div className="minesweeper-settings flex-div">
            <Select
                className="minesweeper-settings-level"
                value={settings.level}
                input={<BootstrapInput />}
                onChange={e => dispatch(setSelect(e.target.value))}
            >

                <MenuItem value={0} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>
                    <em>--Level--</em>
                </MenuItem>
                <MenuItem value={1} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>Easy</MenuItem>
                <MenuItem value={2} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>Medium</MenuItem>
                <MenuItem value={3} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>Hard</MenuItem>
                <MenuItem value={4} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>Custom</MenuItem>
            </Select>
            {
                (settings.level === 4 && settings.setTime.isTime) &&
                <Icon
                    sx={{
                        fontSize: '3rem',
                        color: 'var(--cl-primary-purple)'
                    }}
                    title="Modify settings"
                    onClick={() => dispatch(setToggleSetting())}
                >tune</Icon>
            }
            <div className="minesweeper-settings-flag flex-div">
                <Icon sx={{
                    fontSize: '3rem',
                    color: 'var(--cl-red-flag)'
                }}>flag</Icon>
                <p>{settings.flag}</p>
            </div>
            {
                settings.setTime.isTime ?
                    <ClockBase 
                        type={"countdown"}
                        duration={settings.setTime.duration}
                        semaphore={semaphore}
                        setTimeFinish={setTimeFinish}
                    >
                        <Clock level={settings.level} dispatch={dispatch}/>
                    </ClockBase> :
                    <Icon
                        sx={{
                            fontSize: '3rem',
                            color: 'var(--cl-primary-purple)',
                            marginLeft: 'auto'
                        }}
                        title="Modify settings"
                        onClick={() => dispatch(setToggleSetting())}
                    >tune</Icon>
            }
        </div>
    )
}

export default OptionsBar