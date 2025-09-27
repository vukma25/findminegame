import { useState, useRef } from 'react';
import { Icon, Switch } from '@mui/material'

export default function ChessSettings({ settings, setSettings, setDisplaySettingBoard }) {
    
    const tempSettings = useRef(settings)
    
    const [change, setChange] = useState(settings)
    const [selectedLightColor, setSelectedLightColor] = useState(settings.lightSquareColor || '#FFFFFF')
    const [selectedDarkColor, setSelectedDarkColor] = useState(settings.darkSquareColor || '#5309B3')

    const lightColors = [
        { color: '#F0D9B5', title: 'Vàng cổ điển' },
        { color: '#FFFFFF', title: 'Trắng' },
        { color: '#E8E8E8', title: 'Xám nhạt' },
        { color: '#FFEAA7', title: 'Vàng nhạt' },
        { color: '#FAB1A0', title: 'Cam nhạt' },
        { color: '#FD79A8', title: 'Hồng nhạt' }
    ];

    const darkColors = [
        { color: '#B58863', title: 'Nâu cổ điển' },
        { color: '#769656', title: 'Xanh lá' },
        { color: '#8B4513', title: 'Nâu đậm' },
        { color: '#2D3436', title: 'Xám đen' },
        { color: '#5309B3', title: 'Tím' },
        { color: '#0984E3', title: 'Xanh dương' }
    ]

    const handleColorSelect = (color, type) => {
        if (type === 'light') {
            setSelectedLightColor(color);
            setChange(prev => ({ ...prev, lightSquareColor: color }));
        } else {
            setSelectedDarkColor(color);
            setChange(prev => ({ ...prev, darkSquareColor: color }));
        }
    }

    const handleCustomColorChange = (e, type) => {
        const color = e.target.value;
        if (type === 'light') {
            setSelectedLightColor(color);
            setChange(prev => ({ ...prev, lightSquareColor: color }));
        } else {
            setSelectedDarkColor(color);
            setChange(prev => ({ ...prev, darkSquareColor: color }));
        }
    }

    const handleSwitchChange = (e, field) => {
        setChange(prev => ({
            ...prev,
            [field]: e.target.checked
        }))
    }

    const handleSaveChange = () => {
        localStorage.setItem("chess-theme", JSON.stringify(change))
        setSettings(change)
        setDisplaySettingBoard(false)
    }

    const handleBackupChange = () => {
        setChange(tempSettings.current)
        setSelectedLightColor(tempSettings.current.lightSquareColor)
        setSelectedDarkColor(tempSettings.current.darkSquareColor)
    }

    const renderChessboardPreview = () => {
        const board = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const isLightSquare = (i + j) % 2 === 0;
                const color = isLightSquare ? change.lightSquareColor : change.darkSquareColor;

                board.push(
                    <div
                        key={`${i}-${j}`}
                        className="preview-square"
                        style={{ backgroundColor: color }}
                    ></div>
                );
            }
        }
        return board;
    }

    return (
        <div className="chess-settings-container">
            <div className="preview-section">
                <div className="preview-title flex-div"><Icon>visibility</Icon><p>Preview</p></div>
                <div className="chess-preview">
                    {renderChessboardPreview()}
                </div>
            </div>

            <div className="settings-section">
                <h1>Settings</h1>
                <Icon 
                    className="close-btn"
                    onClick={() => { setDisplaySettingBoard(false) }}
                >close</Icon>
                <div className="settings-grid">
                    <div className="game-settings">
                        <div className="settings-title flex-div">
                            <Icon className="settings-icon">sports_esports</Icon>
                            <p>Cài đặt trò chơi</p>
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Hiện thị nước đi gợi ý</h3>
                                <p>Hiển thị các nước đi có thể của quân cờ</p>
                            </div>
                            <Switch 
                                checked={change.showHints} 
                                onChange={(e) => { handleSwitchChange(e, "showHints") }}/>
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Tự động lật bàn cờ</h3>
                                <p>Tự động xoay bàn cờ theo lượt đi <strong>(nên dùng khi chơi 2 người 1 máy)</strong></p>
                            </div>
                            <Switch 
                                checked={change.autoRotate} 
                                onChange={(e) => { handleSwitchChange(e, "autoRotate") }} 
                            />
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Âm thanh</h3>
                                <p>Phát âm thanh khi di chuyển quân cờ</p>
                            </div>
                            <Switch 
                                checked={change.sound} 
                                onChange={(e) => { handleSwitchChange(e, "sound") }}
                            />
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Hiệu ứng animation</h3>
                                <p>Hiệu ứng khi di chuyển quân mượt mà hơn</p>
                            </div>
                            <Switch 
                                checked={change.animation} 
                                onChange={(e) => { handleSwitchChange(e, "animation") }}    
                            />
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Hiển thị tọa độ</h3>
                                <p>Hiện số và chữ cái trên bàn cờ</p>
                            </div>
                            <Switch 
                                checked={change.showCoordinates} 
                                onChange={(e) => { handleSwitchChange(e, "showCoordinates") }}
                            />
                        </div>
                    </div>

                    <div className="appearance-settings">
                        <div className="settings-title flex-div">
                            <Icon className="settings-icon">palette</Icon>
                            <p>Cài đặt giao diện</p>
                        </div>
                        <div className="setting-card setting-card__col flex-div">
                            <h3>Màu ô sáng</h3>
                            <div className="color-grid">
                                {lightColors.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`color-option ${selectedLightColor === item.color ? 'selected' : ''}`}
                                        style={{ backgroundColor: item.color }}
                                        title={item.title}
                                        onClick={() => handleColorSelect(item.color, 'light')}
                                    ></div>
                                ))}
                            </div>
                            <div className="custom-color">
                                <div className="custom-color-label flex-div">
                                    <Icon sx={{
                                        color: `${change.lightSquareColor}`
                                    }}>format_color_fill</Icon>
                                    <p>Tùy chỉnh:</p>
                                </div>
                                <input
                                    type="color"
                                    className="custom-color-input"
                                    value={selectedLightColor}
                                    onChange={(e) => handleCustomColorChange(e, 'light')}
                                />
                            </div>
                        </div>

                        <div className="setting-card setting-card__col flex-div">
                            <h3>Màu ô tối</h3>
                            <div className="color-grid">
                                {darkColors.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`color-option ${selectedDarkColor === item.color ? 'selected' : ''}`}
                                        style={{ backgroundColor: item.color }}
                                        title={item.title}
                                        onClick={() => handleColorSelect(item.color, 'dark')}
                                    ></div>
                                ))}
                            </div>
                            <div className="custom-color">
                                <div className="custom-color-label flex-div">
                                    <Icon sx={{
                                        color: `${change.darkSquareColor}`
                                    }}>format_color_fill</Icon>
                                    <p>Tùy chỉnh:</p>
                                </div>
                                <input
                                    type="color"
                                    className="custom-color-input"
                                    value={selectedDarkColor}
                                    onChange={(e) => handleCustomColorChange(e, 'dark')}
                                />
                            </div>
                        </div>

                        <div className="setting-card flex-div">
                            <div className="setting-info">
                                <h3>Hiển thị viền bàn cờ</h3>
                                <p>Thêm viền trang trí xung quanh bàn cờ</p>
                            </div>
                            <Switch 
                                checked={change.showBorder} 
                                onChange={(e) => { handleSwitchChange(e, "showBorder") }}
                            />
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button 
                        className="btn-save"
                        onClick={() => {handleSaveChange()}}
                    >
                        Lưu cài đặt
                    </button>
                    <button 
                        className="btn-reset"
                        onClick={() => { handleBackupChange() }}
                    >
                        Khôi phục
                    </button>
                </div>
            </div>
        </div>
    );
};