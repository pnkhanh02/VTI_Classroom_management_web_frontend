const urlAuth = "http://localhost:8686/api/v1/auth/";

function Login(){
   
    let username = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;
    console.log(username, password);
    let request = {
        "password": password,
        "username": username,
    }

    $.ajax({
        url: urlAuth + "login-jwt",
        type: "POST",
        // beforeSend: function (xhr) {
        //   xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        // },
        contentType: "application/json",
        data: JSON.stringify(request),
        error: function (err) {
          console.log(err)
          alert(err.responseJSON.message)
          
        },
        success: function (data) {
            localStorage.setItem("fullName", data.fullName);
            localStorage.setItem("id", data.id);
            localStorage.setItem("role", data.role);
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            window.location.href = '/index.html';
        }
      });
}