(function ($) {
    $(document).ready(function ($) {

        $('#print-multiple-invoice-btn').on('click', function () {
            const selectedIds = [];
            $('.AdministracionVentas-table-tbody_id input:checked').each(function () {
                selectedIds.push($(this).attr('id'));
            });

            if (selectedIds.length === 0) {
                alert('Seleccione al menos un producto.');
                return;
            }
            $("#print-multiple-invoice-btn img").show();
            $.ajax({
                url: calendarSettings.ajax_url,
                type: 'POST',
                data: {
                    action: 'get_order_details',
                    order_ids: selectedIds, // Send multiple IDs
                },
                success: function (response) {
                    if (response.success) {
                        $("#print-multiple-invoice-btn img").hide();
                        let combinedInvoices = '';

                        response.data.forEach(order => {
                            const decodedArray = JSON.parse(order.frase);
                            const frase = decodedArray.join(" ");

                            let messageHTML = '';
                            if (order.message !== "") {
                                messageHTML = `
                                    <p style="margin: 0; font-size: 14px;">
                                        <span style="font-weight: bold;">Mensaje: </span> ${order.message}
                                    </p>
                                `;
                            }

                            combinedInvoices += `
                            <div style="width: 100%; max-width: 650px; border: 1px solid #000; padding: 10px; margin-bottom: 20px;">
                                <div style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
                                    <span style="font-size: 24px; color: #000;">CREA TU BROWNIE</span>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <p style="margin:0 0 5px 0; font-size: 14px;"><span style="font-weight: bold;">No.: </span> ${order.id}</p>
                                    <p style="margin:0 0 5px 0; font-size: 14px;"><span style="font-weight: bold;">Cliente: </span>${order.nombre}</p>
                                    <p style="margin:0 0 5px 0; font-size: 14px;"><span style="font-weight: bold;">Tipo de chocolate: </span>${order.chocotype}</p>
                                    ${messageHTML}
                                </div>
                                <table style="border: 1px solid #000; border-collapse: collapse; width: 100%;">
                                    <tr>
                                        <th style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px;">FRASE O PEDIDO</th>
                                        <th style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px;">FORMA PAGO</th>
                                        <th style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px;">TOTAL</th>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px; font-size: 16px;">
                                        ${frase}
                                        </td>
                                        <td style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px; text-transform:capitalize;">${order.selectedMethod}</td>
                                        <td style="border: 1px solid #000; text-align: center; padding: 5px; font-size: 18px;">${order.precio}€</td>
                                    </tr>
                                </table>
                            </div>`;
                        });

                        const fullHTML = `
                        <html>
                        <head>
                          <title>Factura</title>
                        </head>
                        <body style="font-family: Arial, sans-serif; margin: 20px;">
                          ${combinedInvoices}
                          <script>
                              window.print();
                          </script>
                        </body>
                        </html>`;

                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(fullHTML);
                        printWindow.document.close();
                    } else {
                        alert('No se pudieron obtener los detalles del pedido: ' + response.data.message);
                    }
                },
                error: function (xhr, status, error) {
                    $("#print-multiple-invoice-btn img").hide();
                    console.error('Error al obtener los detalles del pedido:', error);
                    alert('Se produjo un error al obtener los detalles del pedido.');
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
}(jQuery))