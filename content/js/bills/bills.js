loadActiveBills();

/**************************************************
***************** Bill Creation *******************
***************************************************/
function loadActiveBills() {
    $("#billcontainter").empty();
    $.get('/GetActiveBills', function (billRows) {
        $.each(billRows, function () {
            var billData = this;
            $.post('/GetBillItemsByBillId', { billId: this.billId }, function (billItemRows) {
                createBill(billData, billItemRows)
            })
        });
    });
}

//Creates bill container for each bill in database.
function createBill(billData, billItems) {
    var header = getBillHeader(billData);
    var billId = billData.billId;
    var submitButton = ``;

    if (billData.billState == 1) {
        submitButton = `<button class="pure-button pure-button-primary largeButton" onclick="sendBillToKitchen(${billId})">Send to kitchen</button>`;
    } else {
        submitButton = `<button class="pure-button pure-button-primary largeButton" onclick="printCustomerBill(${billId})">Print customer bill</button>`;
    }

    $("#billcontainter").append(`
        <div id="bill${billId}" class="bill">
            <h3 class="centreText">${header}</h3>
            <div id="${billId}" class="bill-container"></div>
            <br />
            <div class="bill-container">
                <div class="bill-item-NonClickable">Sub-Total: </div>
                <div id="subTotalLabel${billId}" class="bill-item">$00.00</div>
                <div class="bill-item-NonClickable">Tax: </div>
                <div id="taxLabel${billId}" class="bill-item">$00.00</div>
                <div class="bill-item-NonClickable">Total: </div>
                <div id="totalLabel${billId}" class="bill-item">$00.00</div>
            </div>
            <div class="bill-footer-container">
                <div class="bill-footer-item">
                    ${submitButton}
                </div>
            </div>
        </div>
    `);
    addBillItemsToBill(billId, billItems);
}

//Returns correct bill header
function getBillHeader(billData) {
    var header = ``;
    if (billData.tableNumber == null) {
        header = `Unattached Bill`;
    } else {
        header = `Table : ${billData.tableNumber}`;
    }
    return header;
}

//Adds bill items to bill container
function addBillItemsToBill(billId, billItems) {
    //Empty previous bill items
    $(`#${billId}`).empty();

    //Create bill items
    $.each(billItems, function () {
        if (this.billItemDiscount == 0) {
            console.log();
            $(`#${billId}`)
                .append(`<div class="bill-item" name="${this.billItemId}" alt="label${this.billItemId}" 
                         billId="${billId}" itemId=${this.itemId}>${this.itemName}</div>`);
            $(`#${billId}`)
                .append(`<div class="bill-item" alt="input${this.billItemId}" itemId=${this.itemId}>
                            <input id="bill${this.billItemId}" name="${this.billItemId}" billId="${billId}"
                                itemId=${this.itemId} alt="item" class="billAmount" type="number" step="0.01" 
                                style="width:60%;" value="${this.billItemPrice}">
                         </div>`);
        } else {
            $(`#${billId}`)
                .append(`<div class="bill-item" name="${this.billItemId}" alt="label${this.billItemId}" itemId=${this.itemId}>${this.itemName}</div>`);
            $(`#${billId}`)
                .append(`<div class="bill-item" alt="input${this.billItemId}" billId="${billId}" itemId=${this.itemId}>
                            <input id="bill${this.billItemId}" name="${this.billItemId}" itemId=${this.itemId} 
                                billId="${billId}" alt="discount" class="billAmount" type="text" 
                                style="width:60%;" value="${this.itemDiscountPercent}%" disabled>
                        </div>`);
        }
    });

    CalculateBillTotals(billId);
}

//Calculates bill total based on bill items
function CalculateBillTotals(billId) {
    var subTotal = 0.00;
    var tax = 0.00;
    var total = 0.00;
    var discount = 0;

    //Calculate sub total from bill items
    var billItems = $(`input[billId=${billId}]`);
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
    $(`#subTotalLabel${billId}`).html(`$${subTotal}`);
    $(`#taxLabel${billId}`).html(`$${tax}`);
    $(`#totalLabel${billId}`).html(`$${total}`);
}

//Bill item price changed
$("#billcontainter").on('keyup mouseup', 'input', function () {
    if (this.alt == "item") {
        CalculateBillTotals($(this).attr('billId'));
        $.post('/UpdateBillItemPrice', { billItemId: this.name, itemPrice: $(this).val() });
    }
});

/**************************************************
************** Bill Send to kitchen ***************
***************************************************/
function sendBillToKitchen(billId) {
    window.location.href = `/SendBillToKitchen?billId=${billId}`;
}

/**************************************************
************* Bill Send to customer ***************
***************************************************/
function printCustomerBill(billId) {
    window.location.href = `/PrintCustomerBill?billId=${billId}`;
}