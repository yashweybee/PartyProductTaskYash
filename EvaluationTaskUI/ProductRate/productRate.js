const URL = 'https://localhost:7026/api/ProductRate';
const URL_Product = 'https://localhost:7026/api/Product'

const tableBody = document.querySelector('#Table-body');
const addProductBtn = document.querySelector('#addProduct');
const editedRate = document.querySelector('#editedRate');
const ddProductRate = document.querySelector('#ddProductRate');
const btnAddModel = document.querySelector('#btnAddModel');
const lableProductRateModel = document.querySelector('#lableProductRateModel');
const modelEditBtn = document.querySelector('#modelEditBtn');
const modelPeoductRateLable = document.querySelector('#ModelProductRateName');

let inpProductRate = document.querySelector('#inputProductRate');

let selectedProduct;
let currentProduct, selectedProductId;
let productRateData = [];

addProductBtn.addEventListener('click', openModel);

btnAddModel.addEventListener('click', onAddProductRate);

modelEditBtn.addEventListener('click', onEditBtnClick)

ddProductRate.addEventListener('change', function (e) {
    selectedProduct = e.target.value;
});

//On open Modal
async function openModel() {
    const dataProduct = await fetch(URL_Product).then(res => res.json());
    setDropdownProduct(dataProduct);
}

function setDropdownProduct(data) {
    let allOptions = ' <option value="">Select Product</option>';

    data.forEach(ele => {
        const singleOption =
            `
        <option value="${ele.id}">${ele.name}</option>
        `;
        allOptions += singleOption;
    });

    ddProductRate.innerHTML = allOptions;
}

//add btn model
function onAddProductRate() {
    const productRate = inpProductRate.value;
    const productId = selectedProduct;

    const objBody = {
        productId: productId,
        rate: productRate
    }
    // console.log(objBody);
    addNewProductRate(objBody)
}

async function addNewProductRate(objBody) {
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

//Get all ProductRates Details
const getData = async function () {
    await fetch(URL)
        .then(res => res.json())
        .then(data => {
            productRateData = data;
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
                <td>${ele.productName}</td>
                <td>${ele.rate}</td>
                <td><button type="button" id ="${ele.id}" onclick="openEditModel(this)" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal2">Edit</button></td>
                <td><button id = "${ele.id}" onclick="deleteBtn(this.id)" type="button" class="btn btn-danger">Delete</button></td>
            </tr>
        `;
        allRows += oneRow;
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
    if (confirm("Are your to delete ProductRate??")) {
        deleteProductRate(id);
    }
}

function deleteProductRate(id) {
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
            getData();

        })
        .catch(error => {
            console.log(error);
        });
}


async function openEditModel(ele) {
    selectedProductId = ele.id;

    // fetching data of selected product-rate
    const data = await fetch(URL + `/${selectedProductId}`).then(res => res.json());
    currentProduct = data;
    // console.log(data);
    lableProductRateModel.innerHTML = currentProduct.productName;
    editedRate.value = currentProduct.rate;

}

async function onEditBtnClick() {
    const objBody = {
        productId: currentProduct.productId,
        rate: editedRate.value
    }
    editProductRate(currentProduct.id, objBody);
}
function editProductRate(id, objBody) {
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
            getData();
        })
        .catch(error => {
            console.log(error);
        });
}

//started with this method
window.onload = function () {
    getData();
};