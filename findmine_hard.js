let rows = 10;
let cols = 10;
let mine = 16;
let min = 9;
let sec = 59;
let endl = 1;
let url = "game.html";
let url_medium = "findmine_medium.html";
let url_easy = "findmine_easy.html";
let audio = document.querySelector("#audio");
let video = document.querySelector("#video");
const level_easy = document.querySelector("#level-easy");
const back = document.querySelector("#back");
const minute = document.querySelector("#min");
const second = document.querySelector("#second");
const count = document.querySelector("#count");
const radios = document.querySelectorAll(".radio");
const listCell = document.querySelectorAll(".cell")
back.onclick = notice;

let arr = new Array(rows);
for (let i=0; i<cols; i++){
    arr[i] = new Array(cols).fill(0);
}
let di = [1, 1, 0, -1, -1, -1, 0 ,1];
let dj = [0, -1, -1, -1, 0, 1, 1, 1];
let virtual_arr = [];
let virtual_object = [];
let check = true;
listCell.forEach(cell => {
    cell.addEventListener("click", function(){
        if (check){
            cell.style.background = "linear-gradient(90deg, rgb(210, 210, 16), rgb(150, 150, 16))";
            times_1(cols);
            times_2(cols);
            let i = Math.floor((cell.value) / 10);
            let j = (cell.value - 1) % 10;
            virtual_arr.push((cell.value-1));
            for (let l=0; l<8; l++){
                let x = i + di[l];
                let y = j + dj[l];
                if ( x < rows && y < cols && x >= 0 && y >= 0){
                    let obj = x*10 + y;
                    virtual_arr.push(obj);
                }
            }
            check = false;
            born_mine();
            loang(i,j);
        }
        else {
            let i = Math.floor((cell.value - 1) / 10);
            let j = (cell.value - 1) % 10;
            if (arr[i][j] == 0){
                loang(i,j);
                cell.style.background = "linear-gradient(90deg, rgb(210, 210, 16), rgb(150, 150, 16))";
            }
            else if (arr[i][j] == -1){
                lose();
            }
            else {
                cell.innerText = arr[i][j];
                cell.style.background = "linear-gradient(90deg, rgb(210, 210, 16), rgb(150, 150, 16))";
            }
        }
    });
});




function notice(){
    if (confirm("Bạn muốn kết thức trò chơi")){
        window.open(url, "_self");
    }
}

function shoot(){
    audio.play();
    setTimeout(function(){
      audio.currentTime = 0;
    },50)
  }
  
  document.addEventListener("click" ,function(pos){
    let x = pos.clientX;
    let y = pos.clientY;
    let img = document.createElement("img");
    img.src = "shoothole.png";
    img.className = "gif1";
    img.style.left = (x - 5) + "px";
    img.style.top = (y - 5) + "px";
    document.body.appendChild(img);
    shoot();
    setTimeout(function(){
      document.body.removeChild(img);
    },500);
  });


function times_1(end){
    let giay = setInterval(function(){
        if (sec >= 10){
            second.innerText = sec;
        }
        else if (sec >= 0){
            second.innerText = "0" + sec;
            if (sec == 0){
                sec += 60;
            }
        }
        sec--;
    },1000);
    if (end == 1){
        setTimeout(function(){
            clearInterval(giay);
        },1000);
    }
}
function times_2(end){
    setTimeout(function(){
        minute.innerText = "0" + min;
    },1000);
    let phut = setInterval(function(){
        if (min >= 1){
            min--;
            minute.innerText = "0" + min;
        }
        else {
            alert("Game Over");
            window.open(url, "_self");
        }
    },60000);
    if (end == 1){
        setTimeout(function(){
            clearInterval(phut);
        },1000);
    }
}

radios.forEach(radio => {
    radio.addEventListener("change", function(){
        let choice = radio.value;
        console.log(choice);
        if (choice == 2){
           window.open(url_medium,"_self");
        }
        else if (choice == 1){
            window.open(url_easy,"_self");
        }
    });
});


function born_mine(){
    let cnt = 0
    while (cnt < 16){
        let i = Math.floor(Math.random() * 10);
        let j = Math.floor(Math.random() * 10);
        let key = i*10 + j;
        if (!virtual_arr.includes(key)){
            cnt++;
            virtual_arr.push(key);
            virtual_object.push(i); virtual_object.push(j);
            arr[i][j] = -1;
        }
    }

    for (let i=0; i<virtual_object.length; i+=2){
        for (let j=0; j<8; j++){
            let x = virtual_object[i] + di[j];
            let y = virtual_object[i+1] + dj[j];
            if ( x < rows && y < cols && x >= 0 && y >= 0 && arr[x][y] != -1){
                arr[x][y] += 1;
            }
        }
    }
}

let visited = new Array(rows);
for (let i = 0; i < rows; i++) {
    visited[i] = new Array(cols).fill(false);
}

function loang(i, j) {
    if (i > rows || j > cols || i < 0 || j < 0 || visited[i][j]){
        return;
    }
    visited[i][j] = true;

    for (let k = 0; k < 8; k++) {
        let l = i + di[k];
        let m = j + dj[k];
        if (l < rows && m < cols && l >= 0 && m >= 0){
            if (arr[l][m] == 0){
                let pos = l * 10 + m + 1;
                listCell.forEach(cell => {
                if (cell.value == pos){
                    cell.style.background = "linear-gradient(90deg, rgb(210, 210, 16), rgb(150, 150, 16))";
                }
                }); 
                loang(l,m);
            }
            else if (arr[l][m] != -1){
                let pos = l * 10 + m + 1;
                listCell.forEach(cell => {
                if (cell.value == pos){
                    cell.innerText = arr[l][m];
                    cell.style.background = "linear-gradient(90deg, rgb(210, 210, 16), rgb(150, 150, 16))";
                }
                }); 
            }
        }
    }
}

function lose(){
    let video = document.createElement("video");
    video.src = "new_lose.mp4";
    video.className = "video";
    times_1(endl);
    times_2(endl);
    level_easy.appendChild(video);
    video.play();
    setTimeout(function(){
        alert("Chúc mừng bạn đã click vào mìn :))")
        window.open(url, "_self");
    },100);
    setTimeout(function(){
        level_easy.removeChild(video);
    },15000);
}

function check_win(){
    let sum = 0
    for (let i=0; i<rows; i++){
        for (let j=0; j<cols; j++){
            sum += win[i][j];
        }
    }
    if (sum == 7){return true;}
    else {return false;}
}

function conculration(){
    setTimeout(function(){
        alert("Chúc mừng bạn đã chiến thắng.Bạn là nhà dò mìn tài ba!!!");
        window.open(url, "_self");
    },1000);
}

console.log(win);

