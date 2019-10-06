//Hides non initial tabs
$("#menuSettingsDiv").hide();
$("#tableSettingsDiv").hide();

/**************************************************
************** Tab switching Navbar ***************
***************************************************/
function restaurantInfoClick() {
    $("#restaurantInfoTab").addClass('active');
    $("#menuSettingsTab").removeClass('active');
    $("#tableSettingsTab").removeClass('active');

    $("#restaurantInfoDiv").show();
    $("#menuSettingsDiv").hide();
    $("#tableSettingsDiv").hide();
}

function menuSettingsClick() {
    loadMenuData();

    $("#restaurantInfoTab").removeClass('active');
    $("#menuSettingsTab").addClass('active');
    $("#tableSettingsTab").removeClass('active');

    $("#restaurantInfoDiv").hide();
    $("#menuSettingsDiv").show();
    $("#tableSettingsDiv").hide();
}

function tableSettingsClick() {
    loadTableData();

    $("#restaurantInfoTab").removeClass('active');
    $("#menuSettingsTab").removeClass('active');
    $("#tableSettingsTab").addClass('active');

    $("#restaurantInfoDiv").hide();
    $("#menuSettingsDiv").hide();
    $("#tableSettingsDiv").show();
    updateDraggableObjects();
}

/**************************************************
************ Menu tab updates/loading *************
***************************************************/
function loadMenuData() {
    $.get('/getMenuData', function (menuData) {
        UpdateMenuFilterNav(menuData);
        UpdateMenuItems(menuData);
    });
}

function UpdateMenuFilterNav(menuData) {
    $("#menuFilters").empty();
    $("#menuAddFilter").empty();
    $("#menuEditFilter").empty();
    $("#menuSettingsItems").empty();
    var firstFilter = 0;

    //Add users Menu Filters to list
    $.each(menuData.filters, function () {
        $("#menuFilters").append(`<li class="menuItems"><a class="menuA" id="${this.filterId}">${this.filterName}</a></li>`);
        $("#menuSettingsItems").append(`<div id="filter${this.filterId}" style="display: none;" class="grid-container" ></div>`);

        $('#menuAddFilter').append($('<option>', {
            value: `${this.filterId}`,
            text: `${this.filterName}`
        }));

        $('#menuEditFilter').append($('<option>', {
            value: `${this.filterId}`,
            text: `${this.filterName}`
        }));

        if(firstFilter == 0){
            firstFilter = this.filterId;
        }
    });

    //Display first filter
    $(`#filter${firstFilter}`).show();

    //Add "Add Filter" button to list last.
    $("#menuFilters").append(`<li class="menuItems"><a class="menuA" id="AddFilter">Add Filter</a></li>`);

    //Select first filter if its not the add filter button
    var firstLI = $('ul#menuFilters li').first().find("a");
    if (firstLI.attr('id') != "AddFilter") {
        firstLI.addClass('active');
    }
}

function UpdateMenuItems(menuData) {
    $('#menuSettingsItems div').html('');

    //For each item from the database, create a menu button corresponding to the filter id
    $.each(menuData.items, function () {
        if (this.itemDiscount == 0) {
            $(`#filter${this.filterId}`).append(`<div class="grid-item"><button id="${this.itemId}" name="${this.itemName}" price="${this.itemPrice}" alt="${this.itemCalories}" filterId="${this.filterId}" discount=0 class="pure-button pure-button-primary menuButton">${this.itemName} <br/> $${this.itemPrice} <br/> Calories: ${this.itemCalories}</button></div>`);
        } else {
            $(`#filter${this.filterId}`).append(`<div class="grid-item"><button id="${this.itemId}" name="${this.itemName}" price="${this.itemDiscountPercent}" filterId="${this.filterId}" discount=1 class="pure-button pure-button-primary menuButton">${this.itemName} <br/> Discount: ${this.itemDiscountPercent}%</button></div>`);
        }
    });
}

//Menu navbar clicked
$(document).on('click', "a.menuA", function () {
    if (this.id != "AddFilter") {
        $('#menuSettingsItems').children().hide();
        $('a.menuA').removeClass('active');
        $(`#filter${this.id}`).show();
        $(`#${this.id}`).addClass('active');
    } else {
        $("#menuAddFilterModal").modal({
            fadeDuration: 150
        });
    }
});

//Menu modal discount display
$("#menuAddDiscount").click(function () {
    if (this.checked) {
        $("#menuAddPrice").prop('disabled', true);
        $("#menuAddCalories").prop('disabled', true);
        $("#addDiscountPercent").removeClass("hiddenElement");
    } else {
        $("#menuAddPrice").prop('disabled', false);
        $("#menuAddCalories").prop('disabled', false);
        $("#addDiscountPercent").addClass("hiddenElement");
    }
})

//Menu modal discount display
$("#menuEditDiscount").click(function () {
    if (this.checked) {
        EditItemIsDiscount();
    } else {
        EditItemIsNotDiscount();
    }
})

function EditItemIsDiscount(){
    $("#menuEditPrice").prop('disabled', true);
    $("#menuEditCalories").prop('disabled', true);
    $("#editDiscountPercent").removeClass("hiddenElement");
}

function EditItemIsNotDiscount(){
    $("#menuEditPrice").prop('disabled', false);
    $("#menuEditCalories").prop('disabled', false);
    $("#editDiscountPercent").addClass("hiddenElement");
}

/**************************************************
******************* Table tab *********************
***************************************************/
function loadTableData() {
    $(`#tableContainer`).empty();
    $.get('/GetTablesForRestaurant', function (tableData) {
        $.each(tableData, function () {
            createExistingTable(this);
        });
    });
}

function createExistingTable(tableData) {
    var tableStyle = `position: relative; left: ${tableData.tablePositionX}%; top: ${tableData.tablePositionY}%;`;
    if (tableData.tableDeleted == 1) {
        tableStyle += `visibility: hidden;`;
    }

    $(`#tableContainer`).append(`<div id="table${tableData.tableNumber}" name="${tableData.tablesId}" alt="${tableData.tablesMaxCapacity}" class="tableSettings" style="${tableStyle}">Table: ${tableData.tableNumber}<br />max capacity: ${tableData.tablesMaxCapacity}</div>`);
    updateDraggableObjects();
}

function addNewTable() {
    var currentTableCount = $(`#tableContainer`).children().length;
    var newTableId = currentTableCount + 1;
    var topStartPos = -(16 * (newTableId - 1));

    $.post('/AddNewTable', { tableCapacity: 4, restaurantId: $('#restaurantId').val(), tableNumber: newTableId }, function (tableData) {
        $(`#tableContainer`).append(`<div id="table${newTableId}" name="${tableData.insertId}" alt="4" class="tableSettings" style="position: relative; left: 0px; top: ${topStartPos}%;">Table: ${newTableId}<br />max capacity: 4</div>`);
        updateDraggableObjects();
    });
}

function updateDraggableObjects() {
    $(".tableSettings").draggable({
        containment: "#tableContainer",
        scroll: false,
        stop: function (event, ui) {

            //Get width/height of container for tables
            var divWidth = $("#tableContainer").width();
            var divHeight = $("#tableContainer").height();

            //Make move position relative to screen size. Pixel position to Percentage position.
            var hPosPercent = ((ui.position.left / divWidth) * 100).toFixed(1);
            var vPosPercent = ((ui.position.top / divHeight) * 100).toFixed(1);

            //Set to percentage 
            $(`#${event.target.id}`).css("left", `${hPosPercent}%`);
            $(`#${event.target.id}`).css("top", `${vPosPercent}%`);

            //Update position in database
            var tableId = $(`#${event.target.id}`).attr("name");
            $.post('/UpdateTablePosition', { tableId: tableId, tableX: hPosPercent, tableY: vPosPercent });
        }
    });
}

//
function createStaffAcount(restaurantId){
    console.log(restaurantId);
    window.location.href = "/CreateAccount";
    event.preventDefault();
}