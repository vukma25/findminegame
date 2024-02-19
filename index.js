let name_sign_up = "";
let pass_sign_up = "";
let pass_sign_up_again = "";
let name_remember = "";
let pass_remember = "";
let pass_login_user = "egfhhhihfoihwfhoebobebwibbfoi";
let name_login_user = "egfhhhihfoihwfhoebobebwibbfoi";
let url = "game.html";

const name_login = document.getElementById("name_user");
const pass_login = document.getElementById("password_user");
const name_sign = document.getElementById("name_user_sign");
const pass_sign = document.getElementById("password_user_sign");
const pass_confirm = document.getElementById("password_confirm_user");
const click_login = document.getElementById("click_login");
const click_sign = document.getElementById("sign");
const save = document.getElementById("save");
const capcha = document.getElementById("capcha");
const give = document.getElementById("give");
const email = document.getElementById("email");
const number = document.getElementById("number");

click_login.onclick = check_pass_and_name;
click_sign.onclick = sign_up;
give.onclick = send;

save.addEventListener("change", function(){
    if (save.value === "yes" && name_login_user === name_login.value && pass_login_user === pass_login.value){
        name_login.value = name_login_user;
        pass_login.value = pass_login_user;
        save.value = "no";
    }
    else {
        save.value = "yes";
    }
});

function check_pass_and_name(){
   if (pass_login_user === pass_login.value && name_login_user === name_login.value){
       notice("Đăng nhập thành công");
       setTimeout(function(){
        window.open(url, "_self");
       }, 2000);
   }
   else {
       notice("Tên đăng nhập hoặc mật khẩu không đúng");
   }
}

function sign_up(){
    if (pass_sign.value === pass_confirm.value && pass_sign.value !== pass_sign_up && name_sign.value !== name_sign_up){
       pass_login_user = pass_sign.value;
       name_login_user = name_sign.value;
       notice("Đăng kí thành công");
    }
    else if (pass_sign.value === pass_sign_up && name_sign.value === name_sign_up){
       notice("Hãy điền đầy đủ thông tin");
    }
    else {
       notice("Mật khẩu không đúng");
    }
}

function notice(string){
    let note = document.createElement("div");
    note.className = "console";
    note.innerText = string;
    document.body.appendChild(note);
    setTimeout(function(){
        document.body.removeChild(note);
    },1000);
}

function random_code(){
    let cap = Math.floor(Math.random() * 10000);
    let code = String(cap);
    while (code.length < 4){
        code += "0";
    }
    return code;
}
let code_cap = random_code();
capcha.innerText = code_cap;

function send(){
    if (number.value == parseInt(code_cap)){
        notice("Gửi thành công. Chờ trong giây lát");
        number.value = "";
        code_cap = random_code();
        capcha.innerText = code_cap;
    }
    else {
        notice("Mã không chính xác");
        code_cap = random_code();
        capcha.innerText = code_cap; 
    }
}