const URL = 'https://localhost:7026/api/Invoice';
const URL_Party = 'https://localhost:7026/api/Party';
const URL_Product = 'https://localhost:7026/api/Product';


const tableBody = document.querySelector('#Table-body');
const addInvoiceBtn = document.querySelector('#addInvoice');
const btnModelAdd = document.querySelector('#btnModelAdd');
const downloadPDF = document.querySelector('#pdfDownload');
const tabel = document.querySelector('#invoiceTable');
const ddParty = document.querySelector('#ddParty');
const ddProduct = document.querySelector('#ddProduct');
const inputProductRate = document.querySelector('#inputProductRate');
const inputQuantity = document.querySelector('#inputQuantity');

let selectedParty, selectedProduct;

addInvoiceBtn.addEventListener('click', openModel);
btnModelAdd.addEventListener('click', onAddInvoice);
downloadPDF.addEventListener('click', onDownloadPDF);

// download PDF
function onDownloadPDF() {
    html2canvas(tabel).then(canvas => {
        let pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
        pdf.save('Invoice.pdf');
    });
}

ddParty.addEventListener('change', function (e) {
    selectedParty = e.target.value;
});

ddProduct.addEventListener('change', function (e) {
    selectedProduct = e.target.value;
});


async function openModel() {
    const dataParty = await fetch(URL_Party).then(res => res.json());
    setDropdownParty(dataParty);

    const dataProduct = await fetch(URL_Product).then(res => res.json());
    setDropdownProduct(dataProduct);

}
function setDropdownParty(data) {
    let allOptions = '';

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
    let allOptions = '';

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
            showTable(data);
        }
        );
}

const showTable = function (data) {
    let allRows = '';
    // fetch(URL_Party + `/${data.partyId}`)
    //     .then(res => res.json())
    //     .then(data => console.log(data))

    data.forEach(ele => {
        const oneRow =
            `
            <tr id = "${ele.id}">
                <td>${ele.partyId}</td>
                <td>${ele.productId}</td>
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