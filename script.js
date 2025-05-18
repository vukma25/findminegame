
//==============Settings and Tutorial=============================================================================
// This script is for the settings and tutorial icons

const setting = document.querySelector('.setting-icon');
const changeMode = document.querySelector('.settings-mode');
const tutor = document.querySelector('.tutor-icon');
const settingsContent = document.querySelector('.settings-content');
const tutorContent = document.querySelector('.tutorial-content');

let hasDisplay = [false, false];
let darkMode = localStorage.getItem('theme');

const toggle = (element) => {
    if (element.style.display === "none" || element.style.display === "") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

const enableDarkTheme = () => {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    document.querySelector('.settings-mode').innerHTML = `<i class="fa-solid fa-moon mode-icon" title="Chế độ tối"></i>`
}
const disableDarkTheme = () => {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light')
    document.querySelector('.settings-mode').innerHTML = `<i class="fa-solid fa-sun mode-icon" title="Chế độ sáng"></i>`
}

if (darkMode === 'dark') {
    enableDarkTheme();
}

setting.addEventListener('click', () => {
    hasDisplay[0] = !hasDisplay[0];
    toggle(settingsContent);
    if (hasDisplay.every((element) => element)) {
        toggle(tutorContent);
        hasDisplay[1] = !hasDisplay[1]
    }
});

tutor.addEventListener('click', () => {
    hasDisplay[1] = !hasDisplay[1];
    toggle(tutorContent);   
    if (hasDisplay.every((element) => element)) {
        toggle(settingsContent);
        hasDisplay[0] = !hasDisplay[0]
    } 
});

changeMode.addEventListener('click', () => {
    darkMode = localStorage.getItem('theme');
    if (darkMode === 'dark') {
        disableDarkTheme();
    } else {
        enableDarkTheme();
    }
})


//==============Settings for the number of mines and flags ========================================================


const rows = document.getElementById('rows');
const cols = document.getElementById('columns');
const proportion = document.getElementById('proportion');
const mines = document.getElementById('mines');
const flag = document.getElementById('flag');
const regex = /[-e]+/;
let isUpdate = [true, true, true];

const restrictValue = (start, end, value, element) => {
    if (parseFloat(value) < start || parseFloat(value) > end || regex.test(value) || value === '' || value.length > 5){
        element.classList.add('error');
        return true;
    }
    element.classList.remove('error');
    return false;
}

rows.addEventListener('input', () => {
    if (restrictValue(10, 30, rows.value, rows)) {
        isUpdate[0] = false;
        return;
    }
    isUpdate[0] = true;
    if (isUpdate.every(e => e)) {
        mines.value = Math.floor((parseInt(rows.value) + parseInt(cols.value)) / 2 * parseFloat(proportion.value));
        flag.value = Math.floor((parseInt(rows.value) + parseInt(cols.value)) / 2 * parseFloat(proportion.value));
    }
    
})
cols.addEventListener('input', () => {
    let end = isMobileDevice() ? 11 : 30;
    if (restrictValue(10, end, cols.value, cols)) {
        isUpdate[1] = false;
        return;
    }
    isUpdate[1] = true;
    if (isUpdate.every(e => e)) {
        mines.value = Math.floor((parseInt(rows.value) + parseInt(cols.value)) / 2 * parseFloat(proportion.value));
        flag.value = Math.floor((parseInt(rows.value) + parseInt(cols.value)) / 2 * parseFloat(proportion.value));
    }
    
})
proportion.addEventListener('input', () => {
    if (restrictValue(1.5, 4.5, proportion.value, proportion)) {
        isUpdate[3] = false;
        return;
    }
    isUpdate[3] = true;
    if (isUpdate.every(e => e)) {
        mines.value = Math.floor((parseInt(rows.value) + parseInt(cols.value)) / 2 * parseFloat(proportion.value));
        flag.value = Math.floor((parseInt(rows.value) + parseInt(cols.value)) / 2 * parseFloat(proportion.value));
    }
    
})


//==============Settings for time==================================================================================

const timeSwitch = document.getElementById('time-switch');
const clock = document.querySelector('.clock');
let timer = document.getElementById('time');
let duration = null;
let interval = null;

timeSwitch.addEventListener('input', () => {
    if (timeSwitch.checked) {
        timer.disabled = false;
        !isRender ? clock.style.opacity = 1 : null;
    } else {
        timer.disabled = true;
        !isRender ? clock.style.opacity = 0 : null;
    }
});

const countDown = () => {
    duration = parseInt(timer.value) * 1000 + Date.now();
    interval = setInterval(() => {
        let timeLeft = Math.max(0, duration - Date.now());
        if (timeLeft <= 0) {
            isRender = false;
            clearInterval(interval);
            renderNotification('Time is up! Game over!');
            gameOver(Array.from(document.querySelectorAll('.cell')));
            return;
        }

        if (!winOrLose) {
            let minutes = Math.floor(timeLeft / 60000);
            let seconds = Math.floor((timeLeft % 60000) / 1000);
            document.querySelector('.minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
            document.querySelector('.seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
        } else {
            clearInterval(interval);
            isRender = false;
        }
    }, 1000)
}

//==============Logic for find-mine game===========================================================================
// This script is for the logic of the game

let isRender = false;
let isBegin = false;
let winOrLose = false;
let mineLocations = null;
let flags = flag.value;
const numberOfFlag = document.querySelector('.flag-limit')


const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const clear = () => {
    isBegin = false;
    winOrLose = false;
    isRender = true;
    timeSwitch.checked ? clock.style.opacity = 1 : clock.style.opacity = 0;
    clearInterval(interval);
    document.querySelector('.minutes').textContent = '';
    document.querySelector('.seconds').textContent = '';
    document.querySelector('.btn').textContent = 'Start';
    numberOfFlag.textContent = flag.value;
    flags = flag.value;
    const notification = document.querySelector('.notification');
    if (notification) {
        notification.remove();
    }
}


document.querySelector('.btn').addEventListener('click', () => {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('columns').value);
    const proportion = parseFloat(document.getElementById('proportion').value);
    const mines = Math.floor((rows + cols) / 2 * proportion);
    if (isUpdate.every(e => e)){
        clear();
        generateBoard(rows, cols, mines);
    } else {
        renderNotification('Have something wrong in your setting!!!')
    }
})

document.getElementById('game-board').addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

const generateBoard = (rows, cols, mines) => {
    const boardGame = document.getElementById('game-board');
    let cells = [];
    boardGame.innerHTML = ''; 
    boardGame.style.gridTemplateColumns = `repeat(${cols}, 35px)`;
    boardGame.style.gridTemplateRows = `repeat(${rows}, 35px)`;
    boardGame.style.gap = '2px';

    timeSwitch.checked ? countDown() : null;

    for (let i = 0; i < rows * cols; i++) {
        let cell = document.createElement('div');
        cell.className = 'cell';

        let row = Math.floor(i / cols);
        let col = i % cols;

        cell.dataset.position = `${row},${col}`;
        
        cell.addEventListener('click', (event) => {
            if (isMobileDevice()) {
                const rect = event.target.getBoundingClientRect();
                handleCellClickMobile(cell, rows, cols, mines, cells, rect.left, rect.top);
            } else {
                handleCellClick(cell, rows, cols, mines, cells);
            }
        });
        cell.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            toggleFlag(cell);
        });

        cells.push(cell);
        boardGame.appendChild(cell);
    }
}

const generateMines = (rows, cols, mines, cell, cells) => {
    let minePosition = new Set();
    let cellNotExpected = new Set();

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = parseInt(cell.dataset.position.split(',')[0]) + i;
            let newCol = parseInt(cell.dataset.position.split(',')[1]) + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                cellNotExpected.add(`${newRow},${newCol}`);
            }
        }
    }

    while (minePosition.size < mines) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);
        if (!cellNotExpected.has(`${row},${col}`)) {
            minePosition.add(`${row},${col}`);
            const index = row * cols + col;
            cells[index].dataset.mine = true;
        }
    }
    return minePosition;
}

// USE DIRECTLY THIS FUNCTION FOR DESKTOP ONLY
const handleCellClick = (cell, rows, cols, mines, cells) => {
    if (winOrLose || cell.dataset.flag) {
        return;
    }

    if (!isBegin){
        isBegin = true;
        let [row, col] = cell.dataset.position.split(',');
        row = parseInt(row);
        col = parseInt(col);
        mineLocations = generateMines(rows, cols, mines, cell, cells);
        revealEmpty(row, col, rows, cols, cells, mineLocations);
    }
    else {
        if (cell.dataset.mine) {
            renderNotification('You clicked on a mine! Game over!');
            gameOver(cells);
            return;
        }
        if (cell.dataset.visited) {
            return;
        }
        let [row, col] = cell.dataset.position.split(',');
        row = parseInt(row);
        col = parseInt(col);
        revealEmpty(row, col, rows, cols, cells, mineLocations);
        checkWin(cells);
    }
}
//==================================================================================================================

//USE THIS FUNCTION FOR MOBILE ONLY
const renderOptions = (cell, cols, x, y) => {
    const modelOptions = `
        <button class="bindFlag" id="bindFlag">
            <i class="fa-solid fa-flag red-flag"></i>
        </button>
        <button class="cancel" id="cancel" onclick="removeOptions()">
            <i class="fa-solid fa-xmark close"></i>
        </button>
        <button class="open" id="open">
            <i class="fa-solid fa-hammer hammer"></i>
        </button>
    `;

    let template = '';
    let [row, col] = cell.dataset.position.split(',');
    let coordX = 0;
    let coordY = 0;
    row = parseInt(row);
    col = parseInt(col);
    console.log(col, cols);

    if (row === 0 && col === cols - 1){
        template = `
            "bindFlag ."
            "cancel open"
        `
        coordX = x - 36;
        coordY = y;
    } else if (row === 0){
        template = `
            ". bindFlag"
            "open cancel"
        `
        coordX = x;
        coordY = y;
    } else if (col === cols - 1){
        template = `
            "bindFlag cancel"
            "open ."
        `
        coordX = x - 36;
        coordY = y - 36;
    } else {
        template = `
            "bindFlag cancel"
            ". open"
        `
        coordX = x;
        coordY = y - 36;
    }

    const options = document.createElement('div');
    options.className = 'options';
    options.innerHTML = modelOptions;
    options.style.left = `${coordX}px`;
    options.style.top = `${coordY}px`;
    options.style.gridTemplateAreas = template;
    document.getElementById('game-board').appendChild(options);
}

const removeOptions = () => {
    const options = document.querySelector('.options');
    const open = document.getElementById('open');
    const bindFlag = document.getElementById('bindFlag');
    if (options) {
        open.removeEventListener('click', handleCellClick);
        bindFlag.removeEventListener('click', toggleFlag);
        options.remove();
    }
}

const handleCellClickMobile = (cell, rows, cols, mines, cells, x, y) => {
    if (winOrLose || cell.dataset.visited) {
        return;
    }
    removeOptions();

    renderOptions(cell, cols, x, y);
    document.getElementById('open').addEventListener('click', () => {
        handleCellClick(cell, rows, cols, mines, cells)
        removeOptions();
    });
    document.getElementById('bindFlag').addEventListener('click', () => {
        toggleFlag(cell, cells)
        removeOptions();
    });
}

//==================================================================================================================


const countMines = (row, col, rows, cols, mineLocations) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i;
            let newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !(i === 0 && j === 0) && mineLocations.has(`${newRow},${newCol}`)) {
                count++
            }
        }
    }
    return count;
}


const revealEmpty = (row, col, rows, cols, cells, mineLocations) => {

    if (cells[row * cols + col].dataset.mine) {
        return;
    }

    cells[row * cols + col].dataset.visited = true;
    cells[row * cols + col].style.backgroundColor = 'var(--border-color)';
    let count = countMines(row, col, rows, cols, mineLocations);

    if (count > 0) {
        cells[row * cols + col].textContent = count;
        cells[row * cols + col].classList.add(`open${count}`);
        return;
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let newRow = row + i;
                let newCol = col + j;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !(i === 0 && j === 0)) {
                    if (!cells[newRow * cols + newCol].dataset.visited && !cells[newRow * cols + newCol].dataset.flag) {
                        revealEmpty(newRow, newCol, rows, cols, cells, mineLocations);
                    }
                }
            }
        }
    }
}

const toggleFlag = (cell, cells) => {
    if (cell.dataset.visited || winOrLose) return;

    if (cell.dataset.flag) {
        delete cell.dataset.flag; 
        cell.innerHTML = '';
        flags++;
        numberOfFlag.textContent = flags;
    } else {
        if (flags <= 0) {
            renderNotification('You have reached the limit of flags', 1000);
            return;
        }

        cell.dataset.flag = true;
        cell.innerHTML = `<i class="fa-solid fa-flag red-flag"></i>`;
        flags--;
        numberOfFlag.textContent = flags;
        isBegin ? checkWin(cells) : function(){};
    }
};



const checkWin = (cells) => {
    let isWin = cells.every(cell =>{
        return cell.dataset.visited || cell.dataset.mine;
    }) || cells.filter(cell => cell.dataset.mine).every(cell => cell.dataset.flag);

    if (isWin) {
        document.querySelector('.btn').textContent = 'New game';
        renderNotification('Congratulations! You solved the game!');
        winOrLose = true;
        isRender = false;
    }
}

const gameOver = (cells) => {
    cells.forEach(cell => {
        if (cell.dataset.mine) {
            cell.style.backgroundColor = 'var(--border-color)';
            cell.innerHTML = `<i class="fa-solid fa-bomb bomb"></i>`;
        }
    })
    document.querySelector('.btn').textContent = 'Play again';
    winOrLose = true;
    isRender = false;
}

const renderNotification = (message, delay) => {    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.getElementById("main").appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, delay || 3000);
}

//===============handle display ==================================================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        document.querySelector('.footer').style.display = 'none';
        removeOptions();
    } else {
        document.querySelector('.footer').style.display = 'flex';
    }
});
window.addEventListener('resize', () => {
    removeOptions();
});