// import reciptDataEntering from './Recipt.js'

const URL = 'https://localhost:7026/api/Invoice';
const URL_Party = 'https://localhost:7026/api/Party';
const URL_Product = 'https://localhost:7026/api/Product';
const URL_ProductRate = 'https://localhost:7026/api/ProductRate'


const tableBody = document.querySelector('#Table-body');
const addInvoiceBtn = document.querySelector('#addInvoice');
const btnModelAdd = document.querySelector('#btnModelAdd');
const downloadPDF = document.querySelector('#pdfDownload');
const tabel = document.querySelector('#invoiceTable');
const ddParty = document.querySelector('#ddParty');
const ddProduct = document.querySelector('#ddProduct');
const inputProductRate = document.querySelector('#inputProductRate');
const inputQuantity = document.querySelector('#inputQuantity');


let selectedParty, selectedProduct, totalAmount = 0;
let invoiceData = [];

addInvoiceBtn.addEventListener('click', openModel);
btnModelAdd.addEventListener('click', onAddInvoice);

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
        var AmountRow = row.insertCell(2);

        PartyRow.classList.add('col-md-9');
        ProductRow.classList.add('col-md-9');
        AmountRow.classList.add('col-md-3');

        if (thisPartyId !== inv.partyId) {
            PartyRow.textContent = `${inv.partyName}`;
            thisPartyId = inv.partyId;
        } else {
            PartyRow.textContent = "";
        }
        ProductRow.innerHTML = `${inv.productName}`;
        AmountRow.innerHTML = `${inv.currentRate}`;
    })

    // setting total amount
    document.getElementById('frame').contentWindow.document.getElementById('totalInvoiceAmount').innerHTML = `${totalAmount}/-`;

    document.getElementById('frame').contentWindow.document.getElementById('receipt-date').innerHTML = `${day}-${month}-${year}`;
}


ddParty.addEventListener('change', function (e) {
    selectedParty = e.target.value;
});

ddProduct.addEventListener('change', async function (e) {
    selectedProduct = e.target.value;
    let productRate = await fetch(URL_ProductRate + `/${e.target.value}`).then(res => res.json());
    // console.log(productRate);
    inputProductRate.value = productRate.rate
});


async function openModel() {
    const dataParty = await fetch(URL_Party).then(res => res.json());
    setDropdownParty(dataParty);

    const dataProduct = await fetch(URL_Product).then(res => res.json());
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
        headers: {
            "content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => getData());
}

//Get all Parties
const getData = async function () {
    const data = await fetch(URL)
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
    if (confirm("Are your to delete Invoice??")) {
        deleteInvoice(id);
    }
}

function deleteInvoice(id) {
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

    const data = prompt('Edit Invoice Name');

    if (data.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: data
    }
    editInvoice(id, objBody)

}
function editInvoice(id, objBody) {


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