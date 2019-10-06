//On page load, load bill custom instructions, load bill items.
//Display bills on report.
$(document).ready(function () {
    var _billId = $("#BillId").val();
    $.post('/GetBillCustomInstructions', { billId: _billId }, function (customInstructions) {
        if (customInstructions[0].billCustomInstructions != null) {
            $("#customInstructions").text(`Custom instructions: ${customInstructions[0].billCustomInstructions}`);
        }

        $.post('/SetBillToMade', { billId: _billId }, function () {
            $.post('/GetBillItemsByBillId', { billId: _billId }, function (billItemRows) {
                $.each(billItemRows, function () {
                    if (this.billItemDiscount == 0) {
                        $("#KitchenReport").append(`<li>${this.itemName}</li>`);
                    }
                });
                window.print();
            });
        });
    });
});