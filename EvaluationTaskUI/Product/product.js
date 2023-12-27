const URL = 'https://localhost:7026/api/Product';


const tableBody = document.querySelector('#Table-body');
const addPatryBtn = document.querySelector('#addProduct');

addPatryBtn.addEventListener('click', onAddProduct);


//adding Product
function onAddProduct() {
    const data = prompt('Enter Product Name');

    if (data == null) return;

    if (data.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: data
    }
    addNewProduct(objBody)
}

function addNewProduct(objBody) {
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
    await fetch(URL)
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

    const data = prompt('Edit Product Name');
    if (data == null) return;

    if (data.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: data
    }
    editProduct(id, objBody)

}
function editProduct(id, objBody) {


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

