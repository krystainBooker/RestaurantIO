/**************************************************
************** Jquery Form submission  ************
***************************************************/
$(document).ready(function () {

    //Add menu filter
    var addFilterform = $('#addFilterForm');
    addFilterform.submit(function (event) {

        //Add new filter to database
        $.post('/AddNewFilter', { filterName: $('#filterAddName').val() }, function () {
            $.modal.close();
            $.get('/getMenuData', function (menuData) {
                UpdateMenuFilterNav(menuData);
                UpdateMenuItems(menuData);
            });

            //Empty filter modal
            $("#filterAddName").val('');
        });
        event.preventDefault();
    });

    //Edit menu filter
    var addFilterform = $('#editFilterForm');
    addFilterform.submit(function (event) {

        //Edit existing filter in datbase
        $.post('/EditFilter', { filterName: $('#filterEditName').val(), filterId: $('#filterId').val() }, function () {
            $.modal.close();
            $.get('/getMenuData', function (menuData) {
                UpdateMenuFilterNav(menuData);
                UpdateMenuItems(menuData);
            });

            //Empty filter modal
            $("#filterEditName").val('');
        });
        event.preventDefault();
    });

    //Add menu item
    var addFilterform = $('#addMenuItemForm');
    addFilterform.submit(function (event) {

        //Add new menu item to database
        $.post('/AddMenuItem', {
            itemName: $('#menuAddName').val(),
            itemFilter: $('#menuAddFilter').val(),
            itemPrice: $('#menuAddPrice').val(),
            itemCalories: $('#menuAddCalories').val(),
            itemDiscount: $("#menuAddDiscount").is(":checked"),
            itemDiscountPercent: $("#menuAddDiscountPercent").val(),
            restaurantId: $('#restaurantId').val()
        }, function () {
            $.modal.close();
            $('#menuAddName').val('');
            $('#menuAddFilter').val('');
            $('#menuAddPrice').val('');
            $('#menuAddCalories').val('');
            $("#menuAddPrice").prop('disabled', false);
            $("#menuAddCalories").prop('disabled', false);
            $('#menuAddDiscount').prop('checked', false);
            $("#addDiscountPercent").addClass("hiddenElement");

            //Refresh menu page
            $.get('/getMenuData', function (menuData) {
                UpdateMenuFilterNav(menuData);
                UpdateMenuItems(menuData);
            });
        });
        event.preventDefault();
    });

    //Edit menu item
    var editFilterform = $('#editMenuItemForm');
    editFilterform.submit(function (event) {

        //Edit existing menu item in database
        $.post('/EditMenuItem', {
            itemId: $("#menuItemId").val(),
            itemName: $('#menuEditName').val(),
            itemFilter: $('#menuEditFilter').val(),
            itemPrice: $('#menuEditPrice').val(),
            itemCalories: $('#menuEditCalories').val(),
            itemDiscount: $("#menuEditDiscount").is(":checked"),
            itemDiscountPercent: $("#menuEditDiscountPercent").val(),
        }, function () {
            $.modal.close();

            //Refresh menu page
            $.get('/getMenuData', function (menuData) {
                UpdateMenuFilterNav(menuData);
                UpdateMenuItems(menuData);
            });
        });
        event.preventDefault();
    });

    //Edit table capacity
    var editFilterform = $('#editTableCapacityForm');
    editFilterform.submit(function (event) {

        //Edit existing menu item in database
        $.post('/EditTableCapacity', {
            tableCapacity: $("#tableCapacity").val(),
            tableId: $('#tableId').val(),
        }, function () {
            $.modal.close();

            //Empty modal
            $("#tableCapacity").val('');

            //Refresh tables 
            loadTableData();
        });
        event.preventDefault();
    });
})