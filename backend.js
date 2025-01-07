(function ($) {
    $(document).ready(function ($) {

        $('.print-invoice-btn').on('click', function () {
            $(".print-invoice-btn img").show();
            const orderId = $(this).data('id');

            $.ajax({
                url: calendarSettings.ajax_url,
                type: 'POST',
                data: {
                    action: 'get_order_details',
                    order_id: orderId
                },
                success: function (response) {
                    if (response.success) {
                        const order = response.data;

                        let decodedArray = JSON.parse(response.data.frase); // Decode JSON
                        let frase = decodedArray.join(" "); // Join array into a string

                        let messageHTML = '';
                        if (response.data.message !== "") {
                            messageHTML = `
                                <p style="margin: 0; font-size: 14px;">
                                    <span style="font-weight: bold;">Mensaje: </span> ${response.data.message}
                                </p>
                            `;
                        }

                        // Invoice content template
                        const invoiceHTML = `
                        <div style="width: 100%; max-width: 650px; border: 1px solid #000; padding: 10px; margin-bottom: 20px;">
                            <div style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
                                <span style="font-size: 24px; color: #000;">CHOCO<span style="color: red;">❤</span>LETRA</span>
                            </div>
                            <div style="margin-bottom: 20px;">
                                <p style="margin:0 0 5px 0; font-size: 14px;"><span style="font-weight: bold;">No.: </span> ${orderId}</p>
                                <p style="margin:0 0 5px 0; font-size: 14px;"><span style="font-weight: bold;">Cliente: </span>${response.data.nombre}</p>
                                <p style="margin:0 0 5px 0; font-size: 14px;"><span style="font-weight: bold;">Tipo de chocolate: </span>${response.data.chocotype}</p>
                                ${messageHTML}
                            </div>
                            <table style="border: 1px solid #000; border-collapse: collapse; width: 100%;">
                                <tr>
                                    <th style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px;">FRASE O PEDIDO</th>
                                    <th style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px;">FORMA PAGO</th>
                                    <th style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px;">TOTAL</th>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px;">
                                    ${frase}
                                    </td>
                                    <td style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px; text-transform:capitalize;">${response.data.selectedMethod}</td>
                                    <td style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px;">${response.data.precio}€</td>
                                </tr>
                            </table>
                        </div>`;

                        // Combine the invoice content three times
                        const fullHTML = `
                        <html>
                        <head>
                          <title>Factura</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; margin: 20px;">
                          ${invoiceHTML}
                          ${invoiceHTML}
                          ${invoiceHTML}
                          <script>
                              window.print();
                          </script>
                        </body>
                        </html>`;

                        // Open print window and write content
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(fullHTML);
                        printWindow.document.close();
                    } else {
                        alert('Failed to fetch order details: ' + response.data);
                    }
                },
                complete: function(){
                    $(".print-invoice-btn img").hide();
                }
                
            });
        });


        $("#disable_dates").flatpickr({
            mode: "multiple",
            dateFormat: "Y-m-d",
        });

        $("#disable_days_range").flatpickr({
            mode: "range",
            dateFormat: "Y-m-d",
        });


        // Select or Deselect all checkboxes
        $('#selectAll').change(function () {
            var isChecked = $(this).prop('checked');
            $('.AdministracionVentas-table-tbody input[type="checkbox"]').prop('checked', isChecked);
        });

        // Delete selected rows
        $('#deleteAll').click(function () {
            var selectedIds = [];
            $('.AdministracionVentas-table-tbody ul li input[type="checkbox"]:checked').each(function () {
                selectedIds.push($(this).val());
                console.log(selectedIds);
            });

            if (selectedIds.length > 0) {
                $.ajax({
                    url: calendarSettings.ajax_url, // WordPress AJAX URL
                    type: 'POST',
                    data: {
                        datatype: 'JSON',
                        action: 'delete_rows',
                        ids: selectedIds
                    },
                    success: function (response) {
                        if (response.success) {
                            // Remove the deleted rows from the table
                            selectedIds.forEach(function (id) {
                                $('#openPannel_' + id).remove();
                            });
                            alert('Selected rows have been deleted.');
                            location.reload();
                        } else {
                            alert('Failed to delete selected rows.');
                        }
                    },
                    error: function () {
                        alert('Error occurred while deleting rows.');
                    }
                });
            } else {
                alert('No rows selected.');
            }
        });

    });
}(jQuery));
