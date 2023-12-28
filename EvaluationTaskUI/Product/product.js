const URL = 'https://localhost:7026/api/Product';

const mainHeader = {
    "content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
};

const tableBody = document.querySelector('#Table-body');
const btnAddModel = document.querySelector('#btnAddModel');
const btnEditModel = document.querySelector('#btnEditModel');
const inputProduct = document.querySelector('#inputProduct');
const inputProductEdit = document.querySelector('#inputProductEdit');

let currentProductName, currentProduct;

btnAddModel.addEventListener('click', onAddProduct);
btnEditModel.addEventListener('click', onEditBtn);

//adding Product
function onAddProduct() {
    const inputedProduct = inputProduct.value;

    if (inputedProduct == null) return;

    if (inputedProduct.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: inputedProduct
    }
    addNewProduct(objBody);
    inputProduct.value = "";
}

function addNewProduct(objBody) {
    fetch(URL, {
        method: 'POST',
        body: JSON.stringify(objBody),
        headers: mainHeader
    })
        .then(res => res.json())
        .then(data => getData(URL));
}

//Get all Parties
const getData = async function () {
    await fetch(URL, {
        method: 'GET',
        headers: mainHeader
    })
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
                <td><button type="button" id = "${ele.id}" onclick="getSetEditData(this.id)" data-bs-toggle="modal"
                data-bs-target="#btnEditProduct"  class="btn btn-secondary">Edit</button></td>
                <td><button id = "${ele.id}" onclick="deleteBtn(this.id)" type="button" class="btn btn-danger">Delete</button></td>
            </tr>
        `
        allRows += oneRow;
    });

    document.querySelectorAll(".btn-danger").forEach(ele => {
        ele.addEventListener('click', function () {
            deleteBtn(e)
        })
    });

    tableBody.innerHTML = allRows;
}

//delete
function deleteBtn(id) {
    console.log(id);
    if (confirm("Are your to delete Product??")) {
        deleteProduct(id);
    }
}

function deleteProduct(id) {
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
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

async function getSetEditData(id) {
    // console.log(ele.parentNode.parentNode);
    currentProduct = await fetch(URL + `/${id}`, {
        method: 'GET',
        headers: mainHeader
    }).then(res => res.json());
    inputProductEdit.value = currentProduct.name;
}

function onEditBtn() {
    currentProductName = inputProductEdit.value;
    const objBody = {
        name: currentProductName
    }

    editProduct(currentProduct.id, objBody)
}
function editProduct(id, objBody) {
    fetch(`${URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(objBody),
        headers: mainHeader
    })
        .then(res => {
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
        window.location.replace("../Authentication/Login.html");
    } else {
        getData();
    }
};