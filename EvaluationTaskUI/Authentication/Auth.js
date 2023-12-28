const btnLogout = document.querySelector('#btnLogout');
btnLogout.addEventListener('click', function () {
    localStorage.removeItem("token");
    window.location.replace("../Authentication/Login.html");
});