//When page is loaded, set bill to completed.
//Loads all bills items, adds to container
$(document).ready(function () {
    var sum = 0;
    var _billId = $("#BillId").val();
    $.post('/SetBillToCompleted', { billId: _billId }, function () {
        $.post('/GetBillItemsByBillId', { billId: _billId }, function (billItemRows) {
            $.each(billItemRows, function () {
                if (this.billItemDiscount == 0) {
                    $("#KitchenReport").append(`<li>${this.itemName} - ${this.billItemPrice}</li>`);
                    sum += this.billItemPrice;
                }
            });
            $.post('/GetBillById', { billId: _billId }, function (billData) {
                $.post('/ResetTableOptions', { tableId: billData[0].tablesId }, function () {
                    sum = (sum + (sum * 0.13)).toFixed(2);
                    $("#total").text(`Total: $${sum}`);
                    window.print();
                });
            });
        });
    });
});