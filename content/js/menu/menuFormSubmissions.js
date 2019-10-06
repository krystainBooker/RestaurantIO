/**************************************************
********** Jquery Form submission Menu  ***********
***************************************************/
$(document).ready(function () {
    
    //Add custom instructions
    var customInstructionsForm = $('#instructionForm');
    customInstructionsForm.submit(function (event) {
        var _billId = $(".verticalBills.active").attr('name');
        var _customInstructions = $("#customInstructionsTextArea").val();

        //Edit existing menu item in database
        $.post('/UpdateBillCustomInstructions', {
            billId: _billId,
            customInstructions: _customInstructions,
        }, function () {
            $.modal.close();

            //Empty modal
            $("#customInstructionsTextArea").val('');
        });
        event.preventDefault();
    });
})