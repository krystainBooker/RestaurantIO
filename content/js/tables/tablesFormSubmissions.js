/**************************************************
********** Jquery Form submission Tables  *********
***************************************************/
$(document).ready(function () {

    //Set patron amount
    var setOccupantForm = $('#setOccupantForm');
    setOccupantForm.submit(function (event) {
        var _occupantCount = $("#occupantCount").val();
        var _tableId = $("#tableId").val();
        // //Edit existing menu item in database
        $.post('/UpdateTableOccupantCount', { tableId: _tableId, occupantCount: _occupantCount }, function () {
            $.modal.close();
            loadTableData();
        });

        event.preventDefault();
    });

    //Attach Bill to table
    var attachBillForm = $('#attachBillForm');
    attachBillForm.submit(function (event) {
        var _BillId = $("#billSelection").val();
        var _tableId = $("#tableIdAttachBill").val();
        
        // //Add table id to a bill
        $.post('/AddTableToBill', { tableId: _tableId, billId: _BillId }, function () {
            $.modal.close();
            loadActiveBills();
        });

        event.preventDefault();
    });
})