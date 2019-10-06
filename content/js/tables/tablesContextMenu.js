/**************************************************
*Generate right click context menus for table page*
***************************************************/
$(function () {
    //Table context menu
    $.contextMenu({
        selector: '.table',
        callback: function (key) {
            if (key == "OccupyTable") {
                occupyTable(this.attr("name"));
            } else if (key == "ReserveTable") {
                reserveTable(this.attr("name"));
            } else if (key == "DirtyTable") {
                dirtyTable(this.attr("name"));
            } else if (key == "ClearTable") {
                clearTable(this.attr("name"));
            } else if (key == "SetOccupants") {
                setTableOccupants(this.attr("name"));
            } else if (key == "attachBill") {
                attachBillToTable(this.attr("name"));
            }
        },
        items: {
            "OccupyTable": { name: "Occupy Table" },
            "ReserveTable": { name: "Reserve Table" },
            "DirtyTable": { name: "Dirty Table" },
            "ClearTable": { name: "Clear Table" },
            "SetOccupants": { name: "Set Occupants" },
            "sep": "---------",
            "attachBill": { name: "Attach a Bill" },
        }
    });
});

//Set selected table status to occupied 
function occupyTable(_tableId) {
    var _restaurantId = $("#restaurantId").val();
    $.post('/FindBillOccupyingTable', { tableId: _tableId, restaurantId: _restaurantId }, function (tableData) {
        if (tableData.billId == null) {
            $.post('/UpdateTableState', { tableId: _tableId, tableState: "Occupied" }, function () {
                loadTableData();
            });
        }
    });
}

//Set selected table status to reserved
function reserveTable(_tableId) {
    var _restaurantId = $("#restaurantId").val();
    $.post('/FindBillOccupyingTable', { tableId: _tableId, restaurantId: _restaurantId }, function (tableData) {
        if (tableData.billId == null) {
            $.post('/UpdateTableState', { tableId: _tableId, tableState: "Reserved" }, function () {
                loadTableData();
            });
        }
    });
}

//Set selected table status to dirty
function dirtyTable(_tableId) {
    var _restaurantId = $("#restaurantId").val();
    $.post('/FindBillOccupyingTable', { tableId: _tableId, restaurantId: _restaurantId }, function (tableData) {
        if (tableData.billId == null) {
            $.post('/UpdateTableState', { tableId: _tableId, tableState: "Table dirty" }, function () {
                loadTableData();
            });
        }
    });
}

//Clear status of selected table
function clearTable(_tableId) {
    var _restaurantId = $("#restaurantId").val();
    $.post('/FindBillOccupyingTable', { tableId: _tableId, restaurantId: _restaurantId }, function (tableData) {
        if (tableData.billId == null) {
            $.post('/ResetTableOptions', { tableId: _tableId }, function () {
                loadTableData();
            });
        }
    });
}

//Set table occupants of selected table
function setTableOccupants(_tableId) {
    $("#tableId").val(_tableId);
    $("#SetOccupantsModal").modal({
        fadeDuration: 150
    });
}

//Load all unattached bills, add them to the modal
function attachBillToTable(_tableId) {
    $("#tableIdAttachBill").val(_tableId);

    $.post('/GetTableState', { tableId: _tableId }, function (tableData) {
        if (tableData.tableState == "Ready") {
            $("#billSelection").empty();
            var currentBillCount = 0;

            $.get('/GetActiveBills', function (billRows) {
                $.each(billRows, function () {
                    if (this.tablesId == null) {
                        currentBillCount++;

                        $('#billSelection').append($('<option>', {
                            value: `${this.billId}`,
                            text: `Unattached Bill ${currentBillCount}`
                        }));
                    } else {
                        currentBillCount++;
                    }
                });
            });

            $("#attachBillModal").modal({
                fadeDuration: 150
            });
        } else {
            $("#tableNotReadyModal").modal({
                fadeDuration: 150
            });
        }
    });
}