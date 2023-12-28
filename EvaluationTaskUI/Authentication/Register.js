const URL = 'https://localhost:7026/api/Login/Register';

const inputUsername = document.querySelector('#inputUsername');
const inputPassword = document.querySelector('#inputPassword');
const btnRegister = document.querySelector('#btnRegister');

btnRegister.addEventListener('click', onBtnRegister)

function onBtnRegister() {
    const objBody = {
        userName: inputUsername.value,
        password: inputPassword.value
    }
    // console.log(objBody);
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
            window.location.replace("./login.html");
            console.log(er)
        });
    console.log(userData);
}
