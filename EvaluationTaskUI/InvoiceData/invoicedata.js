const URL = 'https://localhost:7026/api/Invoice';
const URL_Party = 'https://localhost:7026/api/Party';
const URL_Product = 'https://localhost:7026/api/Product';
const URL_ProductRate = 'https://localhost:7026/api/ProductRate';
const URL_AssignParty = 'https://localhost:7026/api/AssignParty';


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

addInvoiceBtn.addEventListener('click', openModel);

async function openModel() {
    const dataParty = await fetch(URL_Party, {
        method: 'GET',
        headers: { "content-type": "application/json" }
    }).then(res => res.json());
    setDropdownParty(dataParty);
    console.log(dataParty);

    const dataProduct = await fetch(URL_Product, {
        method: 'GET',
        headers: { "content-type": "application/json" }
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
    ddPartyEdit.innerHTML = allOptions;
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