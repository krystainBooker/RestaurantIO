//Cash summary reports
function dailyCashSummary() {
    $("#dailyCashSummaryModal").modal({
        fadeDuration: 150
    });
}

//Open monthly cash summary modal
function monthlyCashSummary() {
    $("#monthlyCashSummaryModal").modal({
        fadeDuration: 150
    });
}

//Open yearly cash summary modal
function yearlyCashSummary() {
    window.location.href = "/GetYearlyCashSummary";
}

//Redirect to menu popularity report
function menuPopularity() {
    window.location.href = "/GetMenuPopularity";
}

//Redirect to server income report
function serverIncomeReport() {
    window.location.href = "/GetServerIncome";

}

//Redirect to income vs day time report
function incomveVsDayTimeReport() {
    window.location.href = "/GetIncomeVsDayTime";
}

//Share server income report with employees
function shareServerIncomeReport() {
    $.post('/ShareIncomeReportWithEmployees', function () { });
}

//Share incomve vs day time report with employees
function shareIncomveVsDayTimeReport() {
    $.post('/ShareIncomeVsTime', function () { });
}



