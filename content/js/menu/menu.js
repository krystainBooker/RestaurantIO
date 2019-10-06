loadMenuData();
loadActiveBills();

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
    $("#menuItems").empty();
    var firstFilter = 0;

    //Add users Menu Filters to list
    $.each(menuData.filters, function () {
        $("#menuFilters").append(`<li class="menuItems"><a class="menuA" id="${this.filterId}">${this.filterName}</a></li>`);
        $("#menuItems").append(`<div id="filter${this.filterId}" style="display: none;" class="grid-container" ></div>`);

        if (firstFilter == 0) {
            firstFilter = this.filterId;
        }
    });

    //Display first filter
    $(`#filter${firstFilter}`).show();

    //Select first filter
    var firstLI = $('ul#menuFilters li').first().find("a");
    firstLI.addClass('active');
}

//Updates menu display item based on menu item in database
function UpdateMenuItems(menuData) {
    $('#menuItems div').html('');

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
    $('#menuItems').children().hide();
    $('a.menuA').removeClass('active');
    $(`#filter${this.id}`).show();
    $(`#${this.id}`).addClass('active');
});

//Menu item clicked
$(document).on('click', 'button.menuButton', function () {
    var activeBill = $(".verticalBills.active");

    if (activeBill.length == 0) {
        $("#billSelectionModal").modal({
            fadeDuration: 150
        });
    } else {
        var billName = activeBill.attr('name');
        var billId = activeBill.attr('id');

        if ($(this).attr('discount') == 0) {
            $.post('/AddMenuItemToBill', { menuItemId: this.id, itemPrice: $(this).attr('price'), menuItemDiscount: 0, menuItemDiscountPercent: 0, billId: billName }, function () {
                //Refresh active bill
                GetBillItemsByBillId(billName, billId);
            });
        } else {
            $.post('/AddMenuItemToBill', { menuItemId: this.id, itemPrice: 0, menuItemDiscount: 1, menuItemDiscountPercent: $(this).attr('price'), billId: billName }, function () {
                //Refresh active bill
                GetBillItemsByBillId(billName, billId);
            });
        }
    }
})

//Displays custom instruction modal
function openCustomInstructionsModal() {
    var activeBill = $(".verticalBills.active");

    if (activeBill.length == 0) {
        $("#billSelectionModal").modal({
            fadeDuration: 150
        });
    } else {
        $("#customInstructionsModal").modal({
            fadeDuration: 150
        });
    }
}

/**************************************************
***************** Bill Creation *******************
***************************************************/
function loadActiveBills() {
    $.get('/GetActiveBills', function (billRows) {
        $.each(billRows, function () {
            if (this.tablesId == null) {
                var currentBillCount = $(`#billsNavbar`).children().length;
                var newBillNumber = (currentBillCount - 1) + 1;
                $("#billsNavbar").append(`<li><a id="billTab${this.billId}" name="${this.billId}" class="verticalBills">Unattached Bill ${newBillNumber}</a></li>`);
            } else {
                $("#billsNavbar").append(`<li><a id="billTab${this.billId}" name="${this.billId}" class="verticalBills">Table ${this.tableNumber}</a></li>`);
            }
        });
    });
}

//Bill Navbar clicked
$("#billsNavbar").on('click', 'a', function () {
    if (this.id == "NewBill") {
        CreateNewBill();
    } else {
        GetBillItemsByBillId(this.name, this.id);
    }

});

//Inserts new bill into the database, creates new bill in navbar
function CreateNewBill() {
    $.post('/AddNewBill', function (billId) {
        var currentBillCount = $(`#billsNavbar`).children().length;
        var newBillNumber = (currentBillCount - 1) + 1;

        $("#billsNavbar").append(`<li><a id="billTab${billId.insertId}" name="${billId.insertId}" class="verticalBills">Unattached Bill ${newBillNumber}</a></li>`);
    });
}

//Loads bill items by bill id, add bill items to bill container
function GetBillItemsByBillId(billName, billId) {
    $.post('/GetBillItemsByBillId', { billId: billName }, function (billItemRows) {
        UpdateSelectedBillNavBar(billId);

        //Empty previous bill items
        $("#billItemContainer").empty();

        //Create bill items
        $.each(billItemRows, function () {
            if (this.billItemDiscount == 0) {
                $("#billItemContainer").append(`<div class="bill-item" name="${this.billItemId}">${this.itemName}</div>`);
                $("#billItemContainer").append(`<div class="bill-item"><input id="bill${this.billItemId}" name="${this.billItemId}" alt="item" class="billAmount" type="number" step="0.01" style="width:60%;" value="${this.billItemPrice}"></div>`);
            } else {
                $("#billItemContainer").append(`<div class="bill-item" name="${this.billItemId}">${this.itemName}</div>`);
                $("#billItemContainer").append(`<div class="bill-item"><input id="bill${this.billItemId}" name="${this.billItemId}" alt="discount" class="billAmount" type="text" style="width:60%;" value="${this.itemDiscountPercent}%" disabled></div>`);
            }
        });

        CalculateBillTotals();
    });
}

function UpdateSelectedBillNavBar(billId) {
    //Clear all set active tabs
    $("a.verticalBills").removeClass("active");

    //Set bill as active
    $(`#${billId}`).addClass("active");
}

//Based off bill items, calculates totals, add tax
function CalculateBillTotals() {
    var subTotal = 0.00;
    var tax = 0.00;
    var total = 0.00;
    var discount = 0;

    //Calculate sub total from bill items
    var billItems = $("input.billAmount");
    $.each(billItems, function () {
        if (this.alt == "item") {
            subTotal += parseFloat(this.value);
        } else {
            discount = parseInt(this.value);
        }
    });

    //Calculate tax and total
    subTotal = subTotal.toFixed(2);

    //Remove discount
    subTotal = (subTotal - ((discount / 100) * subTotal)).toFixed(2);

    tax = (subTotal * 0.13).toFixed(2);
    total = (+subTotal + +tax).toFixed(2);

    //Output amounts
    $("#subTotalLabel").html(`$${subTotal}`);
    $("#taxLabel").html(`$${tax}`);
    $("#totalLabel").html(`$${total}`);
}

//Bill item price changed
$("#billItemContainer").on('keyup mouseup', 'input', function () {
    if (this.alt == "item") {
        CalculateBillTotals();
        $.post('/UpdateBillItemPrice', { billItemId: this.name, itemPrice: $(this).val() });
    }
});

/**************************************************
******************** Bill Send ********************
***************************************************/
function sendBillToKitchen() {
    var activeBill = $(".verticalBills.active");

    if (activeBill.length == 0) {
        $("#billSelectionModal").modal({
            fadeDuration: 150
        });
    } else {
        var _billId = activeBill.attr('name');
        window.location.href = `/SendBillToKitchen?billId=${_billId}`;
    }
}