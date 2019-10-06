/**************************************************
*Generate right click context menus for bills page*
***************************************************/
$(function () {
    //Table context menu
    $.contextMenu({
        selector: '.bill-item',
        callback: function (key) {
            if (key == "Remove") {
                RemoveSelectedItemFromBill(this);
            }
            else if (key == "AddAnother") {
                DuplicateSelectedItem(this);
            }
        },
        items: {
            "Remove": { name: "Remove" },
            "AddAnother": { name: "Add another" },
        }
    });
});

//Remove selected item from selected bill
function RemoveSelectedItemFromBill(selectedItem) {
    var _billId = $(selectedItem).attr("billId");
    var _billItemId = $(selectedItem).attr("name");

    $.post('/RemoveBillItem', { billItemId: _billItemId }, function () {
        $(`div[alt=label${_billItemId}]`).remove();
        $(`div[alt=input${_billItemId}]`).remove();
        CalculateBillTotals(_billId);
    });
}

//Duplicate selected bill item on bill
function DuplicateSelectedItem(selectedItem) {
    var _billId = $(selectedItem).attr("billId");
    var _itemId = $(selectedItem).attr("itemId");

    $.post('/GetMenuItemById', { menuItemId: _itemId }, function (item) {
        var _itemDiscount = isItemADiscountItem(item);

        $.post('/AddMenuItemToBill', { menuItemId: item.itemId, itemPrice: item.itemPrice, menuItemDiscount: _itemDiscount, menuItemDiscountPercent: item.itemDiscount, billId: _billId }, function () {
            $.post('/GetBillItemsByBillId', { billId: _billId }, function (billItemRows) {
                loadActiveBills();
            })
        });
    });
}

//Returns bool if item is a discount item
function isItemADiscountItem(item) {
    var itemIsDiscount = 1;
    if (item.itemDiscountPercent == null) {
        itemIsDiscount = 0;
    }
    return itemIsDiscount;
}