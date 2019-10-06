//When page is loaded, load all
//menu popularity data from the database
$(document).ready(function () {
    $.get('/GetMenuPopularityData', function (menuPopularityData) {
        $.each(menuPopularityData, function () {
            $("#detailedSummaryContainer").append(`<div class="menuPopularityReport-grid-item">${this.itemName}</div>`);
            $("#detailedSummaryContainer").append(`<div class="menuPopularityReport-grid-item">${this.Count}</div>`);
        });
        window.print();
    });
});