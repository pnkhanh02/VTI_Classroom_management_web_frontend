$(function () {
    let currentLocation = window.location.href;

    $(".main").load("./assets/html/Home.html");
    // checkLogin();

})

function checkLogin() {
    let username = localStorage.getItem("username");
    let token = localStorage.getItem("token");

    if (!token && !currentLocation.includes("/login.html")) {
        window.location.href = '/login.html';
    } else {
        document.getElementById("username-avatar").innerHTML = username;
    }
}

// load trang home vvafo main
function onclickHomePage() {
    $(".main").load("./assets/html/Home.html");
}
// load trang create class vào main
function onclickCreateClass() {
    $(".main").load("./assets/html/Create-New-Class.html");
}
// load trang all class vào main
function onclickViewClass() {
    $(".main").load("./assets/html/class-page.html");
    changActivePage('class-page');
}

function navToZoomPage() {
    $(".main").load("./assets/html/zoom-page.html");
    changActivePage('zoom-page');
}

function navToClassRoomPage() {
    $(".main").load("./assets/html/class-room-page.html");
    changActivePage('class-room-page');
}

function navToAccountPage() {
    $(".main").load("./assets/html/account-page.html");
    changActivePage('account-page');
}

function changActivePage(pageActive) {
    const navLinks = Array.from(document.getElementsByClassName("nav-link"));
    navLinks.forEach(element => element.classList.remove('acctive-link'))

    var navActive = document.getElementById(pageActive);
    navActive.classList.add('acctive-link');
    // navActive.classList.remove('text-dark')
}

function hideLogout() {
    $('#myModal').modal('show')
}

// logout
function Logout() {
    localStorage.clear();
    window.location.href = '/login.html';
}



function Login() {
    // call API from server
    //lay data tu model ra
    var username = document.getElementById("Username").value;
    var password = document.getElementById("Password").value;


    //khai báo employee dưới dạng json
    var admin = { username: username, password: password };
    console.log(admin);
    // var settings = {
    //     "url": "http://localhost:8080/api/v1/login",
    //     "method": "POST",
    //     "timeout": 0,
    //     "headers": {
    //         "Authorization": "",
    //         "Content-Type": "application/json"
    //     },
    //     "data": JSON.stringify({ "username": username, "password": password }),
    // };

    // $.ajax(settings).done(function (response) {
    //     console.log(response);
    //     if (response) {
    //         // lưu thông tin xuống localstorage
    //         // localStorage.setItem(username);
    //         location.replace("AdminWeb.html");
    //         return;
    //     } alert("Username or Passwword a wrong")
    // });
    if (username === "ADMIN" && password === "123456") {
        localStorage.setItem("username", username);
        localStorage.setItem("role", "ADMIN");
        localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
        window.location.href = '/index.html';
    } else {
        showAlrtError("Tài khoản hoặc mật khẩu không đúng");
    }

}

function showAlrtSuccess(content) {
    document.getElementById("conten-success-alert").innerHTML = content;
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(3000);
    });
}

function showAlrtError(content) {
    document.getElementById("content-error-alert").innerHTML = content;
    $("#error-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#error-alert").slideUp(3000);
    });
}
