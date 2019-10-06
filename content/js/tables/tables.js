loadActiveBills();

/**************************************************
***************** Bill Creation *******************
***************************************************/
function loadActiveBills() {
    $(`#billsNavbar`).empty();
    $.get('/GetActiveBills', function (billRows) {
        $.each(billRows, function () {
            if (this.tablesId == null) {
                var currentBillCount = $(`#billsNavbar`).children().length;
                var newBillNumber = (currentBillCount + 1);
                $("#billsNavbar").append(`<li><a id="billTab${this.billId}" name="${this.billId}" class="verticalBillsNonClickable">Unattached Bill ${newBillNumber}</a></li>`);
            } else {
                $("#billsNavbar").append(`<li><a id="billTab${this.billId}" name="${this.billId}" class="verticalBillsNonClickable">Bill: Table ${this.tableNumber}</a></li>`);
            }
        });
        loadTableData(billRows);
    });
}

/**************************************************
**************** Table Creation *******************
***************************************************/
function loadTableData(tableBills) {
    $(`#tableContainer`).empty();
    $.get('/GetTablesForRestaurant', function (tableData) {
        $.each(tableData, function () {
            createExistingTable(this, tableBills);
        });
    });
}

//Create table objects, add them to the table container
function createExistingTable(tableData, tableBills) {
    var tableStyle = `position: relative; left: ${tableData.tablePositionX}%; top: ${tableData.tablePositionY}%;`;
    if (tableData.tableDeleted == 1) {
        tableStyle += `visibility: hidden;`;
    }

    if (tableData.tableOccupantCount > 0) {
        $(`#tableContainer`).append(`<div id="table${tableData.tableNumber}" name="${tableData.tablesId}" alt="${tableData.tablesMaxCapacity}" class="table" style="${tableStyle}">Table: ${tableData.tableNumber}<br />current patrons: ${tableData.tableOccupantCount} <br/> ${tableData.tableState}</div>`);
    } else {
        $(`#tableContainer`).append(`<div id="table${tableData.tableNumber}" name="${tableData.tablesId}" alt="${tableData.tablesMaxCapacity}" class="table" style="${tableStyle}">Table: ${tableData.tableNumber}<br />max capacity: ${tableData.tablesMaxCapacity} <br/> ${tableData.tableState}</div>`);

    }
}