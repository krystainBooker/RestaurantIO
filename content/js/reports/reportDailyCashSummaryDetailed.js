//When page is loaded, load all 
//daily cash summary detailed data from the database
$(document).ready(function () {
    $.post('/DailyCashSummaryDetailedData', function (detailedData) {
        $.each(detailedData, function () {
            if(this.tablesId == null){
                table = "N/A";
            } else{
                table = this.tablesId;
            }
            
            $("#detailedSummaryContainer").append(`<div class="cashSummaryReport-grid-item">${table}</div>`);
            $("#detailedSummaryContainer").append(`<div class="cashSummaryReport-grid-item">${this.BillDate}</div>`);
            $("#detailedSummaryContainer").append(`<div class="cashSummaryReport-grid-item">$${this.BillTotal}</div>`);
        });
        window.print();
    });
});