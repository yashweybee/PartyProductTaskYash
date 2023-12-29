// const tabledata = $('#tableParty').DataTable({
//     'columnDefs': [{
//         'targets': [1, 2], /* column index */
//         'orderable': false, /* true or false */
//     }]
// });



const mainHeader = {
    "content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
};

const URL = 'https://localhost:7026/api/Party';

const tableBody = document.querySelector('#Table-body');
const btnAddModel = document.querySelector('#btnAddModel');
const inputParty = document.querySelector('#inputParty');
const inputPartyEdit = document.querySelector('#inputPartyEdit');
const btnEditModel = document.querySelector('#btnEditModel');
const btnDeleteModel = document.querySelector('#btnDeleteModel');
const alertNode = document.querySelector('.alert')
const alert = bootstrap.Alert.getInstance(alertNode);
let currentPartyName, currentParty, currentPartyId;

btnAddModel.addEventListener('click', onAddParty);
btnEditModel.addEventListener('click', onEditBtn);
btnDeleteModel.addEventListener('click', () => deleteParty(currentPartyId));


// Shows alert message
function alertShowHide() {
    $('.alert').show();
    $("#success-alert").fadeTo(1000, 300).slideUp(300, function () {
        $("#success-alert").slideUp(500);
    });
}


//adding Party
function onAddParty() {
    // const inpPartyName = inputParty;
    const inpPartyName = inputParty.value;

    if (inpPartyName == null || inpPartyName == '') return;

    if (inpPartyName.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: inpPartyName
    }
    addNewParty(objBody);
    inputParty.value = "";
    alertShowHide();
}


// calling api and adding new party
function addNewParty(objBody) {
    fetch(URL, {
        method: 'POST',
        body: JSON.stringify(objBody),
        headers: mainHeader
    })
        .then(res => res.json())
        .then(data => getData());
}

//Get all Parties
const getData = async function () {
    await fetch(URL, {
        method: 'GET',
        headers: mainHeader
    })
        .then(res => res.json())
        .then(data => {
            showTable(data);
        });
}

const showTable = function (data) {
    console.log(data);
    let allRows = '';
    data.forEach(ele => {
        const oneRow =
            `
        <tr id = "${ele.id}">
        <td>${ele.name}</td>
        <td><button type="button" id = "${ele.id}" onclick="getSetEditData(this.id)" data-bs-toggle="modal"
        data-bs-target="#btnEditParty" class="btn btn-secondary">Edit</button></td>
        <td><button id = "${ele.id}" onclick="deleteBtn(this.id)" type="button" data-bs-toggle="modal"
        data-bs-target="#deleteParty" class="btn btn-danger">Delete</button></td>
        </tr>
        `;

        allRows += oneRow
        // tabledata.row.add($(oneRow)).draw();
    });

    document.querySelectorAll(".btn-danger").forEach(ele => {
        ele.addEventListener('click', function (e) {
            deleteBtn(e)
        })
    });

    tableBody.innerHTML = allRows;
}

//delete
function deleteBtn(id) {
    console.log(id);
    currentPartyId = id;
    // if (confirm("Are sure to delete Party??")) {
    //     deleteParty(id);
    // }
}

function deleteParty(id) {
    // console.log(`${URL}/${id}`);
    fetch(URL + `/${id}`, {
        method: 'DELETE',
        headers: mainHeader
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            getData();
            return response.json();
        })
        .catch(error => {
            console.log(error);
        });
}

async function getSetEditData(id) {
    // console.log(ele.parentNode.parentNode);
    currentParty = await fetch(URL + `/${id}`, {
        method: 'GET',
        headers: mainHeader
    }).then(res => res.json());
    inputPartyEdit.value = currentParty.name;
}

// Model edit Btn clicked
function onEditBtn() {
    currentPartyName = inputPartyEdit.value
    const objBody = {
        name: currentPartyName
    };
    editParty(currentParty.id, objBody);
}

// fuction sends PUT req
function editParty(id, objBody) {
    fetch(`${URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(objBody),
        headers: mainHeader
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            getData();

        })
        .catch(error => {
            console.log(error);
        });
}

//started with this method
window.onload = function () {
    // console.log("Bearer " + localStorage.getItem("token"));
    if (localStorage.getItem("token") === null) {
        window.location.replace("./Authentication/Login.html");
    } else {
        getData();
    }
};
