var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '',
    user: '',
    password: ''
});

connection.query('USE restaurantIO');

module.exports = {

    //#region User Account

    getRestaurantInformation: function (req) {
        return new Promise(function (resolve, reject) {
            connection.query(`SELECT * FROM restaurants WHERE restaurantId = ${req.user.RestaurantId};`, function (err, rows) {
                if (err) {
                    return reject(err);
                }
                resolve(rows[0]);
            });
        });
    },

    updateRestaurantInformation: function (req) {
        return new Promise(function (resolve, reject) {
            var restName = req.body.restrauntName;
            var restDesc = req.body.restrauntDescription;
            var restLocat = req.body.restrauntLocation;
            var restCuisine = req.body.restrauntCuisine;

            connection.query(`UPDATE restaurants SET restaurantName = "${restName}", restaurantDescription ="${restDesc}", restaurantLocation = "${restLocat}", restaurantCuisine = "${restCuisine}" where restaurantId = ${req.user.RestaurantId}`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    getRestaurantMenuData: function (req) {
        return new Promise(function (resolve, reject) {
            connection.query(`SELECT * FROM menufilters WHERE restaurantId = ${req.user.RestaurantId};`, function (err, filterRows) {
                if (err) {
                    return reject(err);
                }

                connection.query(`SELECT * FROM menu WHERE itemIsDeleted = 0 AND restaurantId = ${req.user.RestaurantId};`, function (err, itemRows) {
                    if (err) {
                        return reject(err);
                    }

                    var menuData = { filters: filterRows, items: itemRows };
                    resolve(menuData);
                });
            });
        });
    },

    addNewMenuFilter: function (req) {
        return new Promise(function (resolve, reject) {
            var filterName = req.body.filterName;
            connection.query(`INSERT INTO menufilters(filterName, restaurantId) VALUES("${filterName}",${req.user.RestaurantId})`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    editMenuFilter: function (req) {
        return new Promise(function (resolve, reject) {
            var filterName = req.body.filterName;
            var filterId = req.body.filterId;
            connection.query(`UPDATE menufilters SET filterName = "${filterName}" where filterId = ${filterId}`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    deleteMenuFilter: function (req) {
        return new Promise(function (resolve, reject) {
            var filterId = req.body.filterId;
            connection.query(`DELETE FROM menufilters where filterId = ${filterId}`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    addMenuItem: function (req) {
        return new Promise(function (resolve, reject) {
            var itemName = req.body.itemName;
            var itemPrice = req.body.itemPrice;
            var itemCal = req.body.itemCalories;
            var itemFilter = req.body.itemFilter;
            var itemDiscount = JSON.parse(req.body.itemDiscount);
            var itemDiscountPercent = req.body.itemDiscountPercent;
            var restaurantId = req.body.restaurantId;

            if (itemDiscount == true) {
                itemPrice = 0;
                itemCal = 0;
                itemDiscount = 1;
            } else {
                itemDiscountPercent = 0;
            }

            connection.query(`INSERT INTO menu(itemName, itemPrice, itemCalories, itemDiscount, itemDiscountPercent, filterId, restaurantId) 
            VALUES("${itemName}","${itemPrice}","${itemCal}","${itemDiscount}","${itemDiscountPercent}","${itemFilter}","${restaurantId}")`, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
        });
    },

    editMenuItem: function (req) {
        return new Promise(function (resolve, reject) {
            var itemName = req.body.itemName;
            var itemPrice = req.body.itemPrice;
            var itemCal = req.body.itemCalories;
            var itemFilter = req.body.itemFilter;
            var itemId = req.body.itemId;
            var itemDiscount = JSON.parse(req.body.itemDiscount);
            var itemDiscountPercent = req.body.itemDiscountPercent;

            if (itemDiscount == true) {
                itemPrice = 0;
                itemCal = 0;
            } else {
                itemDiscountPercent = 0;
            }

            connection.query(`UPDATE menu SET itemName = "${itemName}", itemPrice = "${itemPrice}", itemCalories = "${itemCal}", itemDiscount = ${itemDiscount}, itemDiscountPercent = ${itemDiscountPercent}, filterId = "${itemFilter}" where itemId = "${itemId}"`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    deleteMenuItem: function (req) {
        return new Promise(function (resolve, reject) {
            var itemId = req.body.itemId;
            connection.query(`UPDATE menu SET itemIsDeleted = 1 WHERE itemId = "${itemId}"`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    addNewTable: function (req) {
        var tableCapacity = req.body.tableCapacity;
        var tableNumber = req.body.tableNumber;
        var restaurantId = req.body.restaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`INSERT INTO tablelayout(tablePositionX,tablePositionY)VALUES(0,0)`, function (err, result) {
                if (err) {
                    return reject(err);
                }
                connection.query(`INSERT INTO tables(tablesMaxCapacity,tableState,tableNumber,restaurantId,tableLayoutId)VALUES(${tableCapacity},"Ready",${tableNumber},${restaurantId},${result.insertId})`, function (err, table) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(table);
                });
            });
        });
    },

    updateTablePosition: function (req) {
        var tableX = req.body.tableX;
        var tableY = req.body.tableY;
        var tableId = req.body.tableId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT tableLayoutId FROM tables WHERE tablesId = ${tableId}`, function (err, table) {
                if (err) {
                    return reject(err);
                }
                connection.query(`UPDATE tablelayout SET tablePositionX = ${tableX}, tablePositionY = ${tableY} WHERE tableLayoutId = ${table[0].tableLayoutId};`, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            });
        });
    },

    getTablesForRestaurant: function (req) {
        return new Promise(function (resolve, reject) {
            connection.query(`SELECT * FROM tables INNER JOIN tablelayout on tables.tableLayoutId = tablelayout.tableLayoutId where tables.restaurantId = ${req.user.RestaurantId}`, function (err, tableRows) {
                if (err) {
                    return reject(err);
                }
                resolve(tableRows);
            });
        });
    },

    updateTableCapacity: function (req) {
        var tableCapacity = req.body.tableCapacity;
        var tableId = req.body.tableId;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE tables SET tablesMaxCapacity = "${tableCapacity}" WHERE tablesId = "${tableId}"`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    deleteTable: function (req) {
        var tableId = req.body.tableId;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE tables SET tableDeleted = 1 WHERE tablesId = "${tableId}"`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    //#endregion User Account

    //#region Tables

    updateTableState: function (req) {
        var tableId = req.body.tableId;
        var tableState = req.body.tableState;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE tables SET tableState = "${tableState}" WHERE tablesId = "${tableId}"`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    updateTableOccupantCount: function (req) {
        var tableId = req.body.tableId;
        var occupantCount = req.body.occupantCount;
        var tableState = "Occupied";

        if (occupantCount <= 0) {
            tableState = "Ready"
        }

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE tables SET tableOccupantCount = ${occupantCount}, tableState="${tableState}" WHERE tablesId = "${tableId}"`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    resetTableOptions: function (req) {
        var tableId = req.body.tableId;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE tables SET tableOccupantCount = 0, tableState = "Ready" WHERE tablesId = "${tableId}"`, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });
    },

    addTableToBill: function (req) {
        var tableId = req.body.tableId;
        var billId = req.body.billId;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE bills SET tablesId = ${tableId} WHERE billId = ${billId}`, function (err) {
                if (err) {
                    return reject(err);
                }
                connection.query(`UPDATE tables SET tableState = "Occupied" WHERE tablesId = ${tableId}`, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
                resolve(true);
            });
        });
    },

    getTableState: function (req) {
        var tableId = req.body.tableId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT * FROM tables WHERE tablesId = ${tableId}`, function (err, tableRow) {
                if (err) {
                    return reject(err);
                }
                resolve(tableRow[0]);
            });
        });
    },

    findBillOccupyingTable: function (req) {
        var tableId = req.body.tableId;
        var restaurantId = req.body.restaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT * FROM bills WHERE billState = 1 AND tablesId = ${tableId} AND restaurantId = ${restaurantId}`, function (err, tableRow) {
                if (err) {
                    return reject(err);
                }
                resolve(tableRow[0]);
            });
        });
    },


    //#endregion Tables

    //#region Menu

    addNewBill: function (req) {
        var restaurantId = req.user.RestaurantId;
        var userId = req.user.userId;

        return new Promise(function (resolve, reject) {
            connection.query(`INSERT INTO bills (billState, billDateTime, restaurantId, userId) VALUES(1, NOW(), ${restaurantId}, ${userId})`, function (err, billId) {
                if (err) {
                    return reject(err);
                }
                resolve(billId);
            });
        });
    },

    getActiveBills: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT * FROM bills LEFT JOIN tables on bills.tablesId = tables.tablesId WHERE billState <> 0 AND bills.restaurantId = ${restaurantId}`, function (err, billRows) {
                if (err) {
                    console.log(err);
                }
                resolve(billRows);
            });
        });
    },

    getBillItemsByBillId: function (req) {
        var billId = req.body.billId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT * FROM billitems LEFT JOIN menu ON billitems.itemId = menu.itemId WHERE billId = ${billId}`, function (err, billItemRows) {
                if (err) {
                    console.log(err);
                }
                resolve(billItemRows);
            });
        });
    },

    addMenuItemToBill: function (req) {
        var billId = req.body.billId;
        var menuItemId = req.body.menuItemId;
        var menuItemPrice = req.body.itemPrice;
        var menuItemDiscount = req.body.menuItemDiscount;
        var menuItemDiscountPercent = req.body.menuItemDiscountPercent;

        return new Promise(function (resolve, reject) {
            connection.query(`INSERT INTO billitems (itemId, billItemPrice, billItemDiscount, billItemDiscountPercent, billId) VALUES(${menuItemId},${menuItemPrice},${menuItemDiscount},${menuItemDiscountPercent},${billId})`, function (err) {
                if (err) {
                    console.log(err);
                }
                resolve(true);
            });
        });
    },

    updateBillItemPrice: function (req) {
        var billItemId = req.body.billItemId;
        var menuItemPrice = req.body.itemPrice;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE billitems SET billItemPrice = ${menuItemPrice} WHERE billItemId = ${billItemId}`, function (err) {
                if (err) {
                    console.log(err);
                }
                resolve(true);
            });
        });
    },

    UpdateBillCustomInstructions: function (req) {
        var billId = req.body.billId;
        var customInstructions = req.body.customInstructions;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE bills SET billCustomInstructions = "${customInstructions}" where billId = ${billId}`, function (err) {
                if (err) {
                    console.log(err);
                }
                resolve(true);
            });
        });
    },

    GetBillCustomInstructions: function (req) {
        var billId = req.body.billId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT billCustomInstructions FROM bills WHERE billId = ${billId}`, function (err, customInstructions) {
                if (err) {
                    console.log(err);
                }
                resolve(customInstructions);
            });
        });
    },

    SetBillToMade: function (req) {
        var billId = req.body.billId;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE bills SET billState = '2' WHERE billId = ${billId}`, function (err) {
                if (err) {
                    console.log(err);
                }
                resolve(true);
            });
        });
    },

    SetBillToCompleted: function (req) {
        var billId = req.body.billId;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE bills SET billState = '0' WHERE billId = ${billId}`, function (err) {
                if (err) {
                    console.log(err);
                }
                resolve(true);
            });
        });
    },

    //#endregion Menu

    //#region Bills

    RemoveBillItemByBillId: function (req) {
        var billItemId = req.body.billItemId;

        return new Promise(function (resolve, reject) {
            connection.query(`DELETE FROM billitems WHERE billItemId = ${billItemId}`, function (err) {
                if (err) {
                    console.log(err);
                }
                resolve(true);
            });
        });
    },

    GetMenuItemById: function (req) {
        var menuItemId = req.body.menuItemId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT * FROM menu WHERE itemId = ${menuItemId}`, function (err, itemRow) {
                if (err) {
                    console.log(err);
                }
                resolve(itemRow[0]);
            });
        });
    },

    GetBillById: function (req) {
        var billId = req.body.billId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT * FROM bills WHERE billId = ${billId}`, function (err, billRow) {
                if (err) {
                    console.log(err);
                }
                resolve(billRow);
            });
        });
    },

    //#endregion Bills

    //#region Reports

    GetDailyCashSummarySimple: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT SUM(billItemPrice) AS dailyCashSummarySum FROM bills INNER JOIN billitems ON bills.billId = billitems.billId WHERE restaurantId = ${restaurantId} AND DATE_FORMAT(billDateTime, '%Y-%m-%d') = CURDATE()`,
                function (err, simpleSum) {
                    if (err) {
                        console.log(err);
                    }
                    resolve(simpleSum[0]);
                });
        });
    },

    GetDailyCashSummaryDetailed: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT bills.billId, SUM(billitems.billItemPrice) AS BillTotal, DATE_FORMAT(billDateTime,'%c/%e/%Y %h:%i:%s %p') AS BillDate, tablesId FROM bills INNER JOIN billitems ON bills.billId = billitems.billId 
                              WHERE bills.restaurantId = ${restaurantId} AND DATE_FORMAT(billDateTime, '%Y-%m-%d') = CURDATE()
                              GROUP BY bills.billId;`,
                function (err, detailedSummary) {
                    if (err) {
                        console.log(err);
                    }
                    resolve(detailedSummary);
                });
        });
    },

    GetMonthlyCashSummarySimple: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT SUM(billItemPrice) AS dailyCashSummarySum FROM bills INNER JOIN billitems ON bills.billId = billitems.billId WHERE restaurantId = ${restaurantId} AND billDateTime BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()`,
                function (err, simpleSum) {
                    if (err) {
                        console.log(err);
                    }
                    resolve(simpleSum[0]);
                });
        });
    },

    GetMonthlyCashSummaryDetailed: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT bills.billId, SUM(billitems.billItemPrice) AS BillTotal, DATE_FORMAT(billDateTime,'%c/%e/%Y %h:%i:%s %p') AS BillDate, tablesId FROM bills INNER JOIN billitems ON bills.billId = billitems.billId 
                              WHERE bills.restaurantId = ${restaurantId} AND billDateTime BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()
                              GROUP BY bills.billId;`,
                function (err, detailedSummary) {
                    if (err) {
                        console.log(err);
                    }
                    resolve(detailedSummary);
                });
        });
    },

    GetYearlyCashSummary: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT SUM(billItemPrice) AS dailyCashSummarySum FROM bills INNER JOIN billitems ON bills.billId = billitems.billId 
                              WHERE restaurantId = ${restaurantId} AND YEAR(billDateTime) = YEAR(NOW());`,
                function (err, detailedSummary) {
                    if (err) {
                        console.log(err);
                    }
                    resolve(detailedSummary);
                });
        });
    },

    GetMenuPopularity: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT menu.itemName, COUNT(*) AS Count FROM bills 
                              INNER JOIN billitems ON bills.billId = billitems.billId
                              INNER JOIN menu ON billitems.itemId = menu.itemId
                              WHERE bills.restaurantId = ${restaurantId}
                              GROUP BY billitems.itemId
                              ORDER BY count DESC;`,
                function (err, menuPopularity) {
                    if (err) {
                        console.log(err);
                    }
                    resolve(menuPopularity);
                });
        });
    },

    GetServerIncomes: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT users.userFirstName, users.userLastName, SUM(billitems.billItemPrice) AS Total FROM bills 
                              INNER JOIN billitems 
                              ON bills.billId = billitems.billId
                              INNER JOIN users
                              ON bills.userId = users.userId
                              WHERE bills.restaurantId = ${restaurantId}
                              GROUP BY bills.userId;`,
                function (err, serverIncome) {
                    if (err) {
                        console.log(err);
                    }
                    resolve(serverIncome);
                });
        });
    },

    GetIncomeVsDayTime: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`SELECT HOUR(billDateTime) AS Time, COUNT(*) AS BillCount FROM bills
                              WHERE restaurantId = ${restaurantId}
                              GROUP BY HOUR(billDateTime)
                              ORDER BY HOUR(billDateTime)`,
                function (err, incomeTime) {
                    if (err) {
                        console.log(err);
                    }
                    resolve(incomeTime);
                });
        });
    },

    ShareIncomeReportWithEmployees: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE users SET userHasSharedIncomeReport = 1 WHERE RestaurantId = ${restaurantId};`, function (err) {
                if (err) {
                    console.log(err);
                }
                resolve(true);
            });
        });
    },

    ShareIncomeVsTime: function (req) {
        var restaurantId = req.user.RestaurantId;

        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE users SET userHasSharedIncomeVDayReport = 1 WHERE RestaurantId = ${restaurantId};`, function (err) {
                if (err) {
                    console.log(err);
                }
                resolve(true);
            });
        });
    }

    //#endregion Reports

};
