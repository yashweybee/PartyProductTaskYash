const URL = 'https://localhost:7026/api/Login/Register';

const inputUsername = document.querySelector('#inputUsername');
const inputPassword = document.querySelector('#inputPassword');
const btnRegister = document.querySelector('#btnRegister');
const alertNode = document.querySelector('.alert')
const alert = bootstrap.Alert.getInstance(alertNode);

btnRegister.addEventListener('click', onBtnRegister);

// Shows alert message
function alertAnimation() {
    $('.alert').show();
    $("#success-alert").fadeTo(2000, 200).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });
}

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
            console.log(er)
        });

    // if user is new then redirect to login page
    if (userData.userName) window.location.replace("./login.html");

    // if user is already exists
    if (userData.status == 400) {
        alertAnimation();
    }
}
