module.exports = function (app, passport, dataAccess) {

    //--------------------------------------------------
    //---------------- Page redirects ------------------
    //--------------------------------------------------

    //#region Index

    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    //#endregion Index

    //#region About

    app.get('/about', function (req, res) {
        res.render('about.ejs');
    });

    //#endregion About

    //#region Sign up

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/CreateAccount', isUserLoggedIn, function (req, res) {
        dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
            res.render('createAccount.ejs', { message: req.flash('signupMessage'), user: req.user, pageData: restaurantInfo });
        });
        
    });

    app.post('/CreateAccount', passport.authenticate('local-signup', {
        successRedirect: '/menu',
        failureRedirect: '/CreateAccount',
        failureFlash: true
    }));

    app.get('/CreateRestaurant', function (req, res) {
        res.render('createRestaurant.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/CreateRestaurant', passport.authenticate('local-signup', {
        successRedirect: '/menu',
        failureRedirect: '/CreateRestaurant',
        failureFlash: true
    }));

    //#endregion Sign up

    //#region Login

    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login',
        {
            successRedirect: '/useraccount',
            failureRedirect: '/login',
            failureFlash: true
        }));

    //#endregion Login

    //#region Logout 

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    //#endregion Logout

    //--------------------------------------------------
    //---------------- Signed in pages -----------------
    //--------------------------------------------------

    //#region Menu

    app.get('/menu', isUserLoggedIn, function (req, res) {
        dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
            res.render('menu.ejs', { user: req.user, pageData: restaurantInfo });
        });
    });

    app.post('/AddNewBill', isUserLoggedIn, function (req, res) {
        dataAccess.addNewBill(req).then(function (billId) {
            res.send(billId);
        });
    });

    app.get('/GetActiveBills', isUserLoggedIn, function (req, res) {
        dataAccess.getActiveBills(req).then(function (billRows) {
            res.send(billRows);
        });
    });

    app.post('/GetBillItemsByBillId', isUserLoggedIn, function (req, res) {
        dataAccess.getBillItemsByBillId(req).then(function (billRows) {
            res.send(billRows);
        });
    });

    app.post('/AddMenuItemToBill', isUserLoggedIn, function (req, res) {
        dataAccess.addMenuItemToBill(req).then(function () {
            res.status(204).send();
        });
    });

    app.post('/UpdateBillItemPrice', isUserLoggedIn, function (req, res) {
        dataAccess.updateBillItemPrice(req).then(function () {
            res.status(204).send();
        })
    });

    app.post('/UpdateBillCustomInstructions', isUserLoggedIn, function (req, res) {
        dataAccess.UpdateBillCustomInstructions(req).then(function () {
            res.status(204).send();
        })
    });

    app.post('/GetBillCustomInstructions', isUserLoggedIn, function (req, res) {
        dataAccess.GetBillCustomInstructions(req).then(function (customInstructions) {
            res.send(customInstructions);
        })
    });

    app.post('/GetBillById', isUserLoggedIn, function (req, res) {
        dataAccess.GetBillById(req).then(function (bill) {
            res.send(bill);
        })
    });

    app.post('/SetBillToMade', isUserLoggedIn, function (req, res) {
        dataAccess.SetBillToMade(req).then(function () {
            res.status(204).send();
        })
    });

    app.get('/SendBillToKitchen', isUserLoggedIn, function (req, res) {
        var _billId = req.query.billId;
        res.render('reportSendToKitchen.ejs', { user: req.user, billId: _billId });
    });

    //#endregion Menu

    //#region Tables

    app.get('/tables', isUserLoggedIn, function (req, res) {
        dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
            res.render('tables.ejs', { user: req.user, pageData: restaurantInfo });
        });
    });

    app.post('/UpdateTableState', isUserLoggedIn, function (req, res) {
        dataAccess.updateTableState(req).then(function () {
            res.status(204).send();
        })
    });

    app.post('/UpdateTableOccupantCount', isUserLoggedIn, function (req, res) {
        dataAccess.updateTableOccupantCount(req).then(function () {
            res.status(204).send();
        })
    });

    app.post('/ResetTableOptions', isUserLoggedIn, function (req, res) {
        dataAccess.resetTableOptions(req).then(function () {
            res.status(204).send();
        })
    });

    app.post('/AddTableToBill', isUserLoggedIn, function (req, res) {
        dataAccess.addTableToBill(req).then(function () {
            res.status(204).send();
        })
    });

    app.post('/GetTableState', isUserLoggedIn, function (req, res) {
        dataAccess.getTableState(req).then(function (tableRow) {
            res.send(tableRow);
        })
    });

    app.post('/FindBillOccupyingTable', isUserLoggedIn, function (req, res) {
        dataAccess.findBillOccupyingTable(req).then(function (tableRow) {
            res.send(tableRow);
        })
    });

    //#endregion Tables

    //#region Bills

    app.get('/bills', isUserLoggedIn, function (req, res) {
        dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
            res.render('bills.ejs', { user: req.user, pageData: restaurantInfo });
        });
    });

    app.post('/RemoveBillItem', isUserLoggedIn, function (req, res) {
        dataAccess.RemoveBillItemByBillId(req).then(function () {
            res.status(204).send();
        })
    });

    app.post('/GetMenuItemById', isUserLoggedIn, function (req, res) {
        dataAccess.GetMenuItemById(req).then(function (item) {
            res.send(item);
        })
    });

    app.get('/PrintCustomerBill', isUserLoggedIn, function (req, res) {
        var _billId = req.query.billId;
        dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
            res.render('reportCustomerBill.ejs', { user: req.user, billId: _billId, pageData: restaurantInfo });
        });
    });

    app.post('/SetBillToCompleted', isUserLoggedIn, function (req, res) {
        dataAccess.SetBillToCompleted(req).then(function () {
            res.status(204).send();
        })
    });

    //#endregion Bills

    //#region Reports

    app.get('/reports', isUserLoggedIn, function (req, res) {
        dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
            res.render('reports.ejs', { user: req.user, pageData: restaurantInfo });
        });
    });

    app.get('/DailyCashSummarySimple', isUserLoggedIn, function (req, res) {
        var todaysDate = new Date(Date.now()).toLocaleString();

        dataAccess.GetDailyCashSummarySimple(req).then(function (simpleSummary) {
            dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
                res.render('reportDailyCashSummarySimple.ejs', { user: req.user, pageData: restaurantInfo, cashSummary: simpleSummary, date: todaysDate });
            });
        });
    });

    app.get('/DailyCashSummaryDetailed', isUserLoggedIn, function (req, res) {
        var todaysDate = new Date(Date.now()).toLocaleString();

        dataAccess.GetDailyCashSummarySimple(req).then(function (simpleSummary) {
            dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
                res.render('reportDailyCashSummaryDetailed.ejs', { user: req.user, pageData: restaurantInfo, cashSummary: simpleSummary, date: todaysDate });
            });
        });
    });

    app.post('/DailyCashSummaryDetailedData', isUserLoggedIn, function (req, res) {
        dataAccess.GetDailyCashSummaryDetailed(req).then(function (detailedSummary) {
            res.send(detailedSummary);
        });
    });

    app.get('/MonthlyCashSummarySimple', isUserLoggedIn, function (req, res) {
        var todaysDate = new Date(Date.now()).toLocaleString();

        dataAccess.GetMonthlyCashSummarySimple(req).then(function (simpleSummary) {
            dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
                res.render('reportMonthlyCashSummarySimple.ejs', { user: req.user, pageData: restaurantInfo, cashSummary: simpleSummary, date: todaysDate });
            });
        });
    });

    app.get('/MonthlyCashSummaryDetailed', isUserLoggedIn, function (req, res) {
        var todaysDate = new Date(Date.now()).toLocaleString();

        dataAccess.GetMonthlyCashSummarySimple(req).then(function (simpleSummary) {
            dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
                res.render('reportMonthlyCashSummaryDetailed.ejs', { user: req.user, pageData: restaurantInfo, cashSummary: simpleSummary, date: todaysDate });
            });
        });
    });

    app.post('/MonthlyCashSummaryDetailedData', isUserLoggedIn, function (req, res) {
        dataAccess.GetMonthlyCashSummaryDetailed(req).then(function (detailedSummary) {
            res.send(detailedSummary);
        });
    });

    app.get('/GetYearlyCashSummary', isUserLoggedIn, function (req, res) {
        var todaysDate = new Date(Date.now()).toLocaleString();

        dataAccess.GetYearlyCashSummary(req).then(function (simpleSummary) {
            dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
                res.render('reportYearlyCashSummary.ejs', { user: req.user, pageData: restaurantInfo, cashSummary: simpleSummary[0].dailyCashSummarySum, date: todaysDate });
            });
        });
    });

    app.get('/GetMenuPopularity', isUserLoggedIn, function (req, res) {
        var todaysDate = new Date(Date.now()).toLocaleString();

        dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
            res.render('reportMenuPopularity.ejs', { user: req.user, pageData: restaurantInfo, date: todaysDate });
        });
    });

    app.get('/GetMenuPopularityData', isUserLoggedIn, function (req, res) {
        dataAccess.GetMenuPopularity(req).then(function (menuPopularityData) {
            res.send(menuPopularityData);
        });
    });

    app.get('/GetServerIncome', isUserLoggedIn, function (req, res) {
        var todaysDate = new Date(Date.now()).toLocaleString();

        dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
            res.render('reportServerIncome.ejs', { user: req.user, pageData: restaurantInfo, date: todaysDate });
        });
    });

    app.get('/GetServerIncomeData', isUserLoggedIn, function (req, res) {
        dataAccess.GetServerIncomes(req).then(function (serverIncome) {
            res.send(serverIncome);
        });
    });

    app.get('/GetIncomeVsDayTime', isUserLoggedIn, function (req, res) {
        var todaysDate = new Date(Date.now()).toLocaleString();

        dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
            res.render('reportIncomeVsDayTime.ejs', { user: req.user, pageData: restaurantInfo, date: todaysDate });
        });
    });

    app.get('/GetIncomeVsDayTimeData', isUserLoggedIn, function (req, res) {
        dataAccess.GetIncomeVsDayTime(req).then(function (incomeTime) {
            res.send(incomeTime);
        });
    });

    app.post('/ShareIncomeReportWithEmployees', isUserLoggedIn, function (req, res) {
        dataAccess.ShareIncomeReportWithEmployees(req).then(function () {
            res.status(204).send();
        });
    });

    app.post('/ShareIncomeVsTime', isUserLoggedIn, function (req, res) {
        dataAccess.ShareIncomeVsTime(req).then(function () {
            res.status(204).send();
        });
    });

    //#endregion Reports

    //#region User account

    app.get('/useraccount', isUserLoggedIn, function (req, res) {
        if (req.user.userIsAdmin == 1) {
            dataAccess.getRestaurantInformation(req).then(function (restaurantInfo) {
                res.render('useraccount.ejs', { user: req.user, pageData: restaurantInfo });
            });
        } else {
            res.redirect('/menu');
        }
    });

    app.post('/SaveRestaurantInfo', isUserLoggedIn, function (req, res) {
        dataAccess.updateRestaurantInformation(req);
        res.redirect('/useraccount');
    });

    app.get('/getMenuData', isUserLoggedIn, function (req, res) {
        dataAccess.getRestaurantMenuData(req).then(function (menuData) {
            res.send(menuData);
        });
    });

    app.post('/AddNewFilter', isUserLoggedIn, function (req, res) {
        dataAccess.addNewMenuFilter(req).then(function () {
            res.status(204).send();
        });
    });

    app.post('/EditFilter', isUserLoggedIn, function (req, res) {
        dataAccess.editMenuFilter(req).then(function () {
            res.status(204).send();
        });
    });

    app.post('/DeleteFilter', isUserLoggedIn, function (req, res) {
        dataAccess.deleteMenuFilter(req).then(function () {
            res.status(204).send();
        });
    });

    app.post('/AddMenuItem', isUserLoggedIn, function (req, res) {
        dataAccess.addMenuItem(req).then(function () {
            res.status(204).send();
        });
    });

    app.post('/EditMenuItem', isUserLoggedIn, function (req, res) {
        dataAccess.editMenuItem(req).then(function () {
            res.status(204).send();
        });
    });

    app.post('/DeleteMenuItem', isUserLoggedIn, function (req, res) {
        dataAccess.deleteMenuItem(req).then(function () {
            res.status(204).send();
        });
    });

    app.post('/AddNewTable', isUserLoggedIn, function (req, res) {
        dataAccess.addNewTable(req).then(function (tableData) {
            res.send(tableData);
        })
    });

    app.post('/UpdateTablePosition', isUserLoggedIn, function (req, res) {
        dataAccess.updateTablePosition(req).then(function () {
            res.status(204).send();
        });
    });

    app.get('/GetTablesForRestaurant', isUserLoggedIn, function (req, res) {
        dataAccess.getTablesForRestaurant(req).then(function (tableRows) {
            res.send(tableRows);
        });
    });

    app.post('/EditTableCapacity', isUserLoggedIn, function (req, res) {
        dataAccess.updateTableCapacity(req).then(function () {
            res.status(204).send();
        });
    });

    app.post('/DeleteTable', isUserLoggedIn, function (req, res) {
        dataAccess.deleteTable(req).then(function () {
            res.status(204).send();
        });
    });

    //#endregion User account

    //#region Catch unknown pages

    app.all('*', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/menu');
        } else {
            res.redirect('/');
        }
    })

    //#endregion Catch unknown pages
};

//Maintains users logged in status
function isUserLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}