const fight = document.querySelector("#fight");
const select = document.querySelector("#select");
const start = document.querySelector("#start");
const options = document.querySelector("#options");
const pointer = document.querySelector("#pointer");
//tiếng bắn súng 
let audio = document.querySelector("#audio");
fight.onclick = connect;

options.addEventListener("change", (event) => {
  let option = event.target.value;
  if (option === "easy"){
    start.onclick = openindex_easy;
  }
  else if (option === "medium"){
    start.onclick = openindex_medium;
  }
  else if (option === "hard"){
    start.onclick = openindex_hard;
  }
  else {
    start.onclick = function(){};
  }
});

function openindex_easy(){
  let url = "findmine_easy.html";
  window.open(url, "_self");
}

function openindex_medium(){
  let url = "findmine_medium.html";
  window.open(url, "_self");
}

function openindex_hard(){
  let url = "findmine_hard.html";
  window.open(url, "_self");
}

function connect(){
  select.style.display = "flex";
  pointer.style.display = "none";
  fight.onclick = hidden;
}

function hidden(){
  select.style.display = "none";
  pointer.style.display = "block";
  fight.onclick = connect;
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
