const URL = 'https://localhost:7026/api/Login';

const inputUsername = document.querySelector('#inputUsername');
const inputPassword = document.querySelector('#inputPassword');
const btnLogin = document.querySelector('#btnLogin');
const alertNode = document.querySelector('.alert')
const alert = bootstrap.Alert.getInstance(alertNode);

btnLogin.addEventListener('click', onBtnLogin);

// Shows alert message
function alertAnimation() {
    $('.alert').show();
    $("#success-alert").fadeTo(2000, 200).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });
    clearInputField();
}

// clearing input field
function clearInputField() {
    inputUsername.value = "";
    inputPassword.value = "";
}

// gets data and sends to the specific function
function onBtnLogin() {
    const objBody = {
        userName: inputUsername.value,
        password: inputPassword.value
    }
    postingData(objBody);
}

// posting user data to api
async function postingData(objBody) {
    const userData = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(objBody),
        headers: {
            "content-type": "application/json"
        }
    })
        .then(res => res.json())
        .catch(er => {
            console.log(er);
            alertAnimation();
        });

    if (userData.token) {
        localStorage.setItem("token", userData.token);
        console.log(localStorage.getItem("token"));
        window.location.replace("../index.html");
    } else {
        alert("Error");
    }
}
