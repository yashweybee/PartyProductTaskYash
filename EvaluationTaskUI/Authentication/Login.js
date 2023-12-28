const URL = 'https://localhost:7026/api/Login';

const inputUsername = document.querySelector('#inputUsername');
const inputPassword = document.querySelector('#inputPassword');
const btnLogin = document.querySelector('#btnLogin');

btnLogin.addEventListener('click', onBtnLogin)

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
        .catch(er => console.log(er));

    if (userData.token) {
        localStorage.setItem("token", userData.token);
        console.log(localStorage.getItem("token"));
        window.location.replace("../index.html");
    } else {
        alert("Error");
    }
}
