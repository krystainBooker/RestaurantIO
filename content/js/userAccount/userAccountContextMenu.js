/**************************************************
******** Generate right click context menus *******
***************************************************/
$(function () {
    //Filter Navbar Context menu
    $.contextMenu({
        selector: '.menuA',
        callback: function (key) {
            if (this.attr("id") != "AddFilter") {
                if (key == "Edit") {
                    //Open edit filter modal
                    $("#filterId").val(this.attr("id"));
                    $("#filterEditName").val($(`#${this.attr("id")}`).html());
                    $("#menuEditFilterModal").modal({
                        fadeDuration: 150
                    });
                }
                else if (key == "Delete") {
                    //Delete filter from database.
                    $.post('/DeleteFilter', { filterId: this.attr("id") }, function () {
                        $.get('/getMenuData', function (menuData) {
                            UpdateMenuFilterNav(menuData);
                            UpdateMenuItems(menuData);
                        });
                    });
                }
            }
        },
        items: {
            "Edit": { name: "Edit" },
            "Delete": { name: "Delete" },
        }
    });

    //Menu item context menu
    $.contextMenu({
        selector: '.menuButton',
        callback: function (key) {
            if (key == "Add") {
                $("#menuEditName").val('');
                $("#addDiscountPercent").addClass('hiddenElement');
                //Open add menu item modal
                $("#addMenuItemModal").modal({
                    fadeDuration: 150
                });
            }
            else if (key == "Edit") {
                //Fill data in modal from existing menu item
                $("#menuItemId").val(this.attr('id'));
                $("#menuEditName").val(this.attr('name'));
                $("#menuEditFilter").val(this.attr('filterId'));


                if ($(this).attr('discount') == 1) {
                    $("#menuEditDiscount").prop('checked', true);
                    $("#menuEditDiscountPercent").val(this.attr('price'));
                    $("#menuEditPrice").val('');
                    $("#menuEditCalories").val('');
                    EditItemIsDiscount()
                } else {
                    $('#menuEditDiscount').prop('checked', false);
                    $("#menuEditDiscountPercent").val('');
                    $("#menuEditPrice").val(this.attr('price'));
                    $("#menuEditCalories").val(this.attr('alt'));
                    EditItemIsNotDiscount();
                }


                //Open edit menu item modal
                $("#editMenuItemModal").modal({
                    fadeDuration: 150
                });
            }
            else if (key == "Delete") {
                //Delete menu item from database.
                $.post('/DeleteMenuItem', { itemId: this.attr("id") }, function () {
                    $.get('/getMenuData', function (menuData) {
                        UpdateMenuFilterNav(menuData);
                        UpdateMenuItems(menuData);
                    });
                });
            }
        },
        items: {
            "Add": { name: "Add" },
            "Edit": { name: "Edit" },
            "Delete": { name: "Delete" },
        }
    });

    //Context menu for the background of the menu page. (This is used if no menu items exist yet.)
    $.contextMenu({
        selector: '#menuSettingsItems',
        callback: function (key) {
            if (key == "Add") {
                //Open add menu item modal
                $("#addMenuItemModal").modal({
                    fadeDuration: 150
                });
            }
        },
        items: {
            "Add": { name: "Add" }
        }
    });

    //Table settings context menu
    $.contextMenu({
        selector: '.tableSettings',
        callback: function (key) {
            if (key == "Edit") {

                //Set modal data
                $("#tableCapacity").val(this.attr("alt"));
                $("#tableId").val(this.attr("name"))

                //Open add menu item modal
                $("#editTableCapacityModal").modal({
                    fadeDuration: 150
                });
            }
            else if (key == "Delete") {
                //Delete table from database
                $.post('/DeleteTable', { tableId: this.attr("name") }, function () {
                    loadTableData();
                });
            }
        },
        items: {
            "Edit": { name: "Edit Capacity" },
            "Delete": { name: "Delete" },
        }
    });
});