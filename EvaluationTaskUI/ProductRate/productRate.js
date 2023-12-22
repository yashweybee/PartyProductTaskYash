const URL = 'https://localhost:7026/api/ProductRate';


const tableBody = document.querySelector('#Table-body');
const addPatryBtn = document.querySelector('#addProduct');
const editedRate = document.querySelector('#editedRate');

addPatryBtn.addEventListener('click', onAddProductRate);


//adding ProductRate
function onAddProductRate() {
    // const data = prompt('Enter ProductRate Name');

    if (data.length === 0) {
        alert("Enter valid data please!!");
        return;
    }

    const objBody = {
        name: data
    }
    addNewProductRate(objBody)
}

function addNewProductRate(objBody) {
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
                <td>${ele.productId}</td>
                <td>${ele.rate}</td>
                <td><button type="button" id ="${ele.id}" onclick="editBtn(this.id, this)" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal2">Edit</button></td>
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
            getData(URL);

        })
        .catch(error => {
            console.log(error);
        });
}

function editBtn(id, ele) {
    // console.log(ele.parentNode.parentNode);

    // const data = prompt('Edit ProductRate Name');

    // if (data.length === 0) {
    //     alert("Enter valid data please!!");
    //     return;
    // }

    // const objBody = {
    //     name: data
    // }
    // editProductRate(id, objBody)
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

