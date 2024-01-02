const token = localStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

const URL_Party = 'https://localhost:7026/api/Party';
const URL_Product = 'https://localhost:7026/api/Product';
const URL_Invoice = 'https://localhost:7026/api/InvoiceMaintain';


$(document).ready(function () {

    // $('#searchButton').click(function (e) {
    //     e.preventDefault();
    //     const partyId = $('#party').val();
    //     const productId = $('input[type="checkbox"]:checked')
    //         .map(function () {
    //             return $(this).val();
    //         })
    //         .get()
    //         .join(',');
    //     const InvoiceNo = $('#invoiceNo').val();
    //     const StartDate = $('#startDate').val();
    //     const EndDate = $('#endDate').val();

    //     const queryParams = new URLSearchParams({
    //         partyId,
    //         productId,
    //         InvoiceNo,
    //         StartDate,
    //         EndDate
    //     });

    //     console.log(partyId,
    //         productId,
    //         InvoiceNo,
    //         StartDate,
    //         EndDate);

    //     const apiUrl = `https://localhost:44309/api/invoice/FilterInvoice?${queryParams}`;

    //     $.ajax({
    //         url: apiUrl,
    //         headers: headers,
    //         method: 'GET',
    //         success: function (data) {
    //             console.log(data);
    //             $('#invoiceHistory').DataTable().clear().rows.add(data).draw();
    //         },
    //         error: function (error) {
    //             console.error('Error fetching invoice history:', error);
    //         }
    //     });
    // });


    fetch('https://localhost:7026/api/InvoiceMaintain', { headers: headers })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            $('#invoiceHistory').DataTable({
                data: data,
                columns: [
                    { data: 'id', title: 'id' },
                    { data: 'partyId', title: 'partyId' },
                    { data: 'partyName', title: 'partyName' },
                    { data: 'date', title: 'date' },
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


    // $.ajax({
    //     url: URL_Party,
    //     method: 'GET',
    //     headers: headers,
    //     success: function (data) {
    //         var partyDropdown = $('#party');
    //         partyDropdown.empty();
    //         partyDropdown.append('<option value="" selected>Select Party</option>');

    //         data.forEach(function (party) {
    //             partyDropdown.append(`<option value="${party.partyId}">${party.partyName}</option>`);
    //         });
    //     },
    //     error: function (error) {
    //         console.error('Error fetching party data:', error);
    //     }
    // });

    // $.ajax({
    //     url: URL_Product,
    //     method: 'GET',
    //     headers: headers,
    //     success: function (data) {
    //         var productDropdown = $('#productOptions ul');

    //         productDropdown.empty();

    //         data.forEach(function (product) {
    //             productDropdown.append(`
    //                 <li>
    //                     <input type="checkbox" id="productCheck${product.productId}" value="${product.productId}">
    //                     <label for="productCheck${product.productId}">${product.productName}</label>
    //                 </li>
    //             `);
    //         });

    //         productDropdown.on('change', 'input[type="checkbox"]', function () {
    //             var selectedProducts = $('input[type="checkbox"]:checked')
    //                 .map(function () {
    //                     return $(this).next('label').text();
    //                 })
    //                 .get()
    //                 .join(', ');

    //             $('#productDropdown').text(selectedProducts || 'Select Products');
    //         });
    //     },
    //     error: function (error) {
    //         console.error('Error fetching product data:', error);
    //     }
    // });
});

