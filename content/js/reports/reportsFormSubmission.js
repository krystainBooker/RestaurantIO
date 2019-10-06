/**************************************************
********* Jquery Form submission Reports  *********
***************************************************/
$(document).ready(function () {

    //Get simple/detailed daily cash summary
    var dailyCashSummaryForm = $('#dailyCashSummaryForm');
    dailyCashSummaryForm.submit(function (event) {
        var _reportType = $("#reportType").val();

        if (_reportType == "simple") {
            window.location.href = "/DailyCashSummarySimple";
        }
        else if (_reportType == "detailed") {
            window.location.href = "/DailyCashSummaryDetailed";
        }
        event.preventDefault();
    });

    //Get simple/detailed monthly cash summary
    var monthlyCashSummaryForm = $('#monthlyCashSummaryForm');
    monthlyCashSummaryForm.submit(function (event) {
        var _reportType = $("#monthlyReportType").val();

        if (_reportType == "simple") {
            window.location.href = "/MonthlyCashSummarySimple";
        }
        else if (_reportType == "detailed") {
            window.location.href = "/MonthlyCashSummaryDetailed";
        }
        event.preventDefault();
    });
})