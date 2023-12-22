const URL = 'https://localhost:7026/api/Party';


const tableBody = document.querySelector('#Table-body');
const addPatryBtn = document.querySelector('#addParty');

addPatryBtn.addEventListener('click', onAddParty);


//adding Party
function onAddParty() {
    const data = prompt('Enter Party Name');

    if (data.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: data
    }
    addNewParty(objBody)
}

function addNewParty(objBody) {
    fetch(URL, {
        method: 'POST',
        body: JSON.stringify(objBody),
        headers: {
            "content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => getData(URL));
}

//Get all Parties
const getData = async function (URL) {
    const data = await fetch(URL)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showTable(data);
        }
        );
}

const showTable = function (data) {
    let allRows = '';
    data.forEach(ele => {
        const oneRow =
            `
            <tr id = "${ele.id}">
                <td>${ele.name}</td>
                <td><button type="button" id = "${ele.id}" onclick="editBtn(this.id, this)"  class="btn btn-secondary">Edit</button></td>
                <td><button id = "${ele.id}" onclick="deleteBtn(this.id)" type="button" class="btn btn-danger">Delete</button></td>
            </tr>
        `
        allRows += oneRow
    });

    document.querySelectorAll(".btn-danger").forEach(ele => {
        ele.addEventListener('click', function () {
            deleteBtn(e)
        })
    })


    tableBody.innerHTML = allRows;
}
const addRows = function (name) {
    let html = `
    `
    tableBody.insertAdjacentElement('afterbegin', html)
}

//delete
function deleteBtn(id) {
    console.log(id);
    if (confirm("Are your to delete Party??")) {
        deleteParty(id);
    }
}

function deleteParty(id) {
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            "content-type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            getData(URL);

        })
        .catch(error => {
            console.log(error);

        });
}

function editBtn(id, ele) {
    // console.log(ele.parentNode.parentNode);
    ele.parentNode.parentNode.style.backgroundColor = "red"

    const data = prompt('Edit Party Name');

    if (data.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: data
    }
    editParty(id, objBody)

}
function editParty(id, objBody) {


    fetch(`${URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(objBody),
        headers: {
            "content-type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            getData(URL);

        })
        .catch(error => {
            console.log(error);

        });

}

//started with this method
getData(URL);

$(document).ready(function () {
    $('#tableParty').DataTable({
    });
});  
