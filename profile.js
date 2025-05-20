const userEmail = localStorage.getItem("userEmail");

// Получаем имя пользователя
const userName = localStorage.getItem("userName");


document.addEventListener("DOMContentLoaded", function () {
    loadUserProfile();
});

function loadUserProfile() {
    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
}

function go_main(){
    window.location.href = '/';
}