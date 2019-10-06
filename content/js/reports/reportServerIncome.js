//On page load, load server income data
//Add data to page
$(document).ready(function () {
    $.get('/GetServerIncomeData', function (serverIncome) {
        $.each(serverIncome, function () {
            $("#detailedSummaryContainer").append(`<div class="menuPopularityReport-grid-item">${this.userFirstName} ${this.userLastName}</div>`);
            $("#detailedSummaryContainer").append(`<div class="menuPopularityReport-grid-item">$${this.Total}</div>`);
        });
        window.print();
    });
});