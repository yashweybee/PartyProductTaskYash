// import reciptDataEntering from './Recipt.js'

const URL = 'https://localhost:7026/api/Invoice';
const URL_Party = 'https://localhost:7026/api/Party';
const URL_Product = 'https://localhost:7026/api/Product';
const URL_ProductRate = 'https://localhost:7026/api/ProductRate';

const mainHeader = {
    "content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
};


const tableBody = document.querySelector('#Table-body');
const addInvoiceBtn = document.querySelector('#addInvoice');
const btnModelAdd = document.querySelector('#btnModelAdd');
const btnModelEdit = document.querySelector('#btnModelEdit');
const downloadPDF = document.querySelector('#pdfDownload');
const tabel = document.querySelector('#invoiceTable');
const ddParty = document.querySelector('#ddParty');
const ddProduct = document.querySelector('#ddProduct');
const ddPartyEdit = document.querySelector('#ddPartyEdit')
const ddProductEdit = document.querySelector('#ddProductEdit')
const inputProductRate = document.querySelector('#inputProductRate');
const inputProductRateEdit = document.querySelector('#inputProductRateEdit');
const inputQuantity = document.querySelector('#inputQuantity');
const inputQuantityEdit = document.querySelector('#inputQuantityEdit');
const lablePartyName = document.querySelector('#lablePartyName');
const lableProductName = document.querySelector('#lableProductName');


let selectedParty, selectedProduct, totalAmount = 0;
let editedParty, editedProduct;
let currentInvoice;
let invoiceData = [];

addInvoiceBtn.addEventListener('click', openModel);
btnModelAdd.addEventListener('click', onAddInvoice);
btnModelEdit.addEventListener('click', onEditBtn)

// PDF Download Logic
$(document).ready(function () {
    $('#pdfDownload').click(function () {
        let pdfPage = document.getElementById('frame').contentWindow;
        pdfPage.focus();
        reciptDataEntering();
        pdfPage.print();
    })
});


const reciptDataEntering = async function () {
    const table = document.getElementById('frame').contentWindow.document.getElementById('myTable');
    tabel.innerHTML = "";

    //date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    //sorting data for listing
    invoiceData.sort((a, b) => b.partyId - a.partyId);
    let thisPartyId = 0;
    totalAmount = 0;


    invoiceData.forEach(inv => {
        totalAmount += inv.currentRate * inv.quantity;

        var row = table.insertRow(-1);

        var PartyRow = row.insertCell(0);
        var ProductRow = row.insertCell(1);
        var QuantityRow = row.insertCell(2);
        var AmountRow = row.insertCell(3);

        PartyRow.classList.add('col-md-9');
        ProductRow.classList.add('col-md-9');
        QuantityRow.classList.add('col-md-9');
        AmountRow.classList.add('col-md-3');

        if (thisPartyId !== inv.partyId) {
            PartyRow.textContent = `${inv.partyName}`;
            thisPartyId = inv.partyId;
        } else {
            PartyRow.textContent = "";
        }
        ProductRow.innerHTML = `${inv.productName}`;
        QuantityRow.innerHTML = `${inv.quantity}`;
        AmountRow.innerHTML = `${inv.currentRate}`;
    })

    // setting total amount
    document.getElementById('frame').contentWindow.document.getElementById('totalInvoiceAmount').innerHTML = `${totalAmount}/-`;

    document.getElementById('frame').contentWindow.document.getElementById('receipt-date').innerHTML = `${day}-${month}-${year}`;
}


ddParty.addEventListener('change', function (e) {
    selectedParty = e.target.value;
});

ddPartyEdit.addEventListener('change', function (e) {
    editedParty = e.target.value;
});

ddProduct.addEventListener('change', async function (e) {
    selectedProduct = e.target.value;
    let productRate = await fetch(URL_ProductRate + `/${e.target.value}`, {
        method: 'GET',
        headers: mainHeader
    }).then(res => res.json());
    console.log(selectedProduct);
    inputProductRate.value = productRate.rate;
});

ddProductEdit.addEventListener('change', async function (e) {
    editedProduct = e.target.value;
    let productRate = await fetch(URL_ProductRate + `/${e.target.value}`, {
        method: 'GET',
        headers: mainHeader
    }).then(res => res.json());
    // console.log(productRate);
    // inputProductRateEdit.value = productRate.rate;
});

async function openModel() {
    const dataParty = await fetch(URL_Party, {
        method: 'GET',
        headers: mainHeader
    }).then(res => res.json());
    setDropdownParty(dataParty);

    const dataProduct = await fetch(URL_Product, {
        method: 'GET',
        headers: mainHeader
    }).then(res => res.json());
    setDropdownProduct(dataProduct);
}
function setDropdownParty(data) {
    let allOptions = '<option selected value="">Select Party</option>';

    data.forEach(ele => {
        const singleOption =
            `
        <option value="${ele.id}">${ele.name}</option>
        `;

        allOptions += singleOption;
    });

    ddParty.innerHTML = allOptions;
    ddPartyEdit.innerHTML = allOptions
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
    ddProductEdit.innerHTML = allOptions
}


//adding Invoice on modal add btn click
function onAddInvoice() {

    const objBody = {
        partyId: selectedParty,
        productId: selectedProduct,
        currentRate: inputProductRate.value,
        quantity: inputQuantity.value,
        data: new Date().toJSON()
    }

    addNewInvoice(objBody);
}

async function addNewInvoice(objBody) {
    await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(objBody),
        headers: mainHeader
    })
        .then(res => res.json())
        .then(data => getData());
}

//Get all Parties
const getData = async function () {
    const data = await fetch(URL, {
        method: 'GET',
        headers: mainHeader
    })
        .then(res => res.json())
        .then(data => {
            invoiceData = data;
            showTable(data);
        });
}

const showTable = async function (data) {
    console.log(data);
    let allRows = '';
    data.forEach(ele => {
        const oneRow =
            `
            <tr id = "${ele.id}">
                <td>${ele.partyName}</td>
                <td>${ele.productName}</td>
                <td>${ele.currentRate}</td>
                <td>${ele.quantity}</td>
                <td><button type="button" id = "${ele.id}" onclick="onEditModelOpen(this)" data-bs-toggle="modal"
                data-bs-target="#editInvoiceModal"  class="btn btn-secondary">Edit</button></td>
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
    if (confirm("Are your to delete Invoice??")) {
        deleteInvoice(id);
    }
}

function deleteInvoice(id) {
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: mainHeader
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

async function onEditModelOpen(ele) {
    //Setting drop-down data
    openModel();

    //fetching selected Invoice data
    const data = await fetch(URL + `/${ele.id}`, {
        method: 'GET',
        headers: mainHeader
    }).then(res => res.json());
    currentInvoice = data;
    lablePartyName.textContent = currentInvoice.partyName;
    lableProductName.textContent = currentInvoice.productName;
    inputProductRateEdit.value = currentInvoice.currentRate;
    inputQuantityEdit.value = currentInvoice.quantity;
}

function onEditBtn() {
    const objBody = {
        partyId: editedParty === undefined ? currentInvoice.partyId : editedParty,
        productId: editedProduct === undefined ? currentInvoice.productId : editedProduct,
        currentRate: inputProductRateEdit.value,
        quantity: inputQuantityEdit.value,
        date: new Date()
    }
    editInvoice(currentInvoice.id, objBody)

}
function editInvoice(id, objBody) {
    fetch(`${URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(objBody),
        headers: mainHeader
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
    // console.log("Bearer " + localStorage.getItem("token"));
    if (localStorage.getItem("token") === null) {
        window.location.replace("../Authentication/Login.html");
    } else {
        getData();
    }
};