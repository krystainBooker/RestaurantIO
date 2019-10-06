//When page is loaded, load all 
//income vs day time datat from the database
$(document).ready(function () {
    $.get('/GetIncomeVsDayTimeData', function (incomeTime) {
        $.each(incomeTime, function () {
            console.log(this);
            $("#detailedSummaryContainer").append(`<div class="menuPopularityReport-grid-item">${this.Time}:00</div>`);
            $("#detailedSummaryContainer").append(`<div class="menuPopularityReport-grid-item">${this.BillCount}</div>`);
        });
        window.print();
    });
});