const URL = 'https://localhost:7026/api/Invoice';


const tableBody = document.querySelector('#Table-body');
const addInvoiceBtn = document.querySelector('#addInvoice');
const downloadPDF = document.querySelector('#pdfDownload');
const tabel = document.querySelector('#invoiceTable');

addInvoiceBtn.addEventListener('click', onAddInvoice);
downloadPDF.addEventListener('click', onDownloadPDF);

// download PDF
function onDownloadPDF() {
    html2canvas(tabel).then(canvas => {
        let pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
        pdf.save('Invoice.pdf');
    });
}

//adding Invoice
function onAddInvoice() {

    if (data.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: data
    }
    addNewInvoice(objBody)
}

function addNewInvoice(objBody) {
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
const getData = async function () {
    const data = await fetch(URL)
        .then(res => res.json())
        .then(data => {
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

