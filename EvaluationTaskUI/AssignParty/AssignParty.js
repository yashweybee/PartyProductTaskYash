const URL = 'https://localhost:7026/api/AssignParty';
const URL_Party = 'https://localhost:7026/api/Party';
const URL_Product = 'https://localhost:7026/api/Product';

const tableBody = document.querySelector('#Table-body');
const ddParty = document.querySelector('#ddParty');
const ddProduct = document.querySelector('#ddProduct');
const model = document.querySelector('.modal');
const btnCancle = document.querySelector('.btnCancle');
const btnAddNewAssignParty = document.querySelector('#addAssignParty');
const btnInModelAdd = document.querySelector('#btnAssignParty');

let selectedParty, selectedProduct;

btnAddNewAssignParty.addEventListener('click', openModel);

btnInModelAdd.addEventListener('click', onAddAssignParty);

btnCancle.addEventListener('click', function () {
    model.classList.add('hide');
})

ddParty.addEventListener('change', function (e) {
    selectedParty = e.target.value;
});

ddProduct.addEventListener('change', function (e) {
    selectedProduct = e.target.value;
});

//adding Party
async function openModel() {
    const dataParty = await fetch(URL_Party).then(res => res.json());
    setDropdownParty(dataParty);

    const dataProduct = await fetch(URL_Product).then(res => res.json());
    setDropdownProduct(dataProduct);

}

// Called after clicking btn
function onAddAssignParty() {
    const objBody = {
        partyId: selectedParty,
        productId: selectedProduct
    }
    addNewAssignParty(objBody);
}


function setDropdownParty(data) {
    let allOptions = ' <option value="">Select Party</option>';

    data.forEach(ele => {
        const singleOption =
            `
        <option value="${ele.id}">${ele.name}</option>
        `;

        allOptions += singleOption;
    });

    ddParty.innerHTML = allOptions;
}

function setDropdownProduct(data) {
    let allOptions = '<option value="">Select Product</option>';

    data.forEach(ele => {
        const singleOption =
            `
        <option value="${ele.id}">${ele.name}</option>
        `;
        allOptions += singleOption;
    });

    ddProduct.innerHTML = allOptions;
}

// called after...
async function addNewAssignParty(objBody) {
    await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(objBody),
        headers: {
            "content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => getData());
}

//Get all Parties
const getData = async function () {
    await fetch(URL)
        .then(res => res.json())
        .then(data => {
            // model.classList.add('hide');

            showTable(data);
        }
        );
}

const showTable = function (data) {
    console.log(data);
    let allRows = '';
    data.forEach(ele => {
        const oneRow =
            `
            <tr id = "${ele.id}">
                <td>${ele.partyName}</td>
                <td>${ele.productName}</td>
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
    if (confirm("Are your to delete AssignParty??")) {
        deleteAssignParty(id);
    }
}

function deleteAssignParty(id) {
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

    const data = prompt('Edit AssignParty Name');

    if (data.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: data
    }
    editAssignParty(id, objBody)

}
function editAssignParty(id, objBody) {


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
window.onload = function () {
    getData();
};

