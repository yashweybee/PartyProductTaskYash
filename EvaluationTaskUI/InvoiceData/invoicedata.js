const token = localStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

const URL_Party = 'https://localhost:7026/api/Party';
const URL_Product = 'https://localhost:7026/api/Product';
const URL_Invoice = 'https://localhost:7026/api/InvoiceMaintain';
const URL_Filter_Invoie = 'https://localhost:7026/api/InvoiceMaintain/Filter';


$(document).ready(function () {

    $('#searchButton').click(function (e) {
        e.preventDefault();
        const partyId = $('#party').val() ? $('#party').val() : null;
        const productId = $('input[type="checkbox"]:checked')
            .map(function () {
                return $(this).val();
            })
            .get()
            .join(',');
        const InvoiceNo = $('#invoiceNo').val() ? $('#invoiceNo').val() : null;
        const StartDate = $('#startDate').val() ? $('#startDate').val() : null;
        const EndDate = $('#endDate').val() ? $('#endDate').val() : null;


        const searchData = {
            order: 'asc',
            pageNo: $('#invoiceHistory').DataTable().page() + 1,
            pageSize: $('#invoiceHistory').DataTable().page.len(),
            partyId,
            InvoiceNo,
            productId: productId ? productId : null,
            StartDate,
            EndDate,
            column: "PartyName"
        }

        console.log(searchData);


        $.ajax({
            url: URL_Filter_Invoie,
            headers: headers,
            method: 'POST',
            data: JSON.stringify(searchData),
            success: function (data) {
                console.log(data);
                $('#invoiceHistory').DataTable().clear().rows.add(data.invoices).draw();
            },
            error: function (error) {
                console.error(error);
            }
        });
    });

    fetch('https://localhost:7026/api/InvoiceMaintain', { headers: headers })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            $('#invoiceHistory').DataTable({
                data: data,
                columns: [
                    { data: 'id', title: 'Id' },
                    { data: 'partyId', title: 'Party Id' },
                    { data: 'partyName', title: 'Party Name' },
                    { data: 'date', title: 'Date' },
                    {
                        title: 'Actions',
                        render: function (data, type, row) {
                            return '<button class="btn-sm btn btn-success view-btn" data-id="' + row.id + '">View Invoice</button>';
                        }
                    }
                ]
            });
        });

    $('#invoiceHistory').on('click', '.view-btn', function () {
        var invoiceId = $(this).data('id');
        window.location.href = 'viewInvoice.html?id=' + invoiceId;
    });

    $('#addInvoice').click(function () {
        location.href = './addinvoice.html'
    })
    $('#invoiceReset').click(function () {
        location.reload();
    })

    $('#invoiceHistory').on('click', 'thead th', function () {
        console.log("header");
    })


    $.ajax({
        url: URL_Party,
        method: 'GET',
        headers: headers,
        success: function (data) {
            var partyDropdown = $('#party');
            partyDropdown.empty();
            partyDropdown.append('<option value="" selected>Select Party</option>');

            data.forEach(party => {
                partyDropdown.append(`<option value="${party.id}">${party.name}</option>`);
            });
        },
        error: function (error) {
            console.error(error);
        }
    });

    $.ajax({
        url: URL_Product,
        method: 'GET',
        headers: headers,
        success: function (data) {
            var productDropdown = $('#productOptions ul');

            productDropdown.empty();

            data.forEach(function (product) {
                console.log(product);
                productDropdown.append(`
                    <li>
                        <input type="checkbox" id="productCheck${product.id}" value="${product.id}">
                        <label for="productCheck${product.id}">${product.name}</label>
                    </li>
                `);
            });

            productDropdown.on('change', 'input[type="checkbox"]', function () {
                var selectedProducts = $('input[type="checkbox"]:checked')
                    .map(function () {
                        return $(this).next('label').text();
                    })
                    .get()
                    .join(', ');

                $('#productDropdown').text(selectedProducts || 'Select Products');
            });
        },
        error: function (error) {
            console.error(error);
        }
    });
});

window.onload = function () {
    if (localStorage.getItem("token") === null) {
        window.location.replace("../Authentication/Login.html");
    } else {
        getData();
    }
};