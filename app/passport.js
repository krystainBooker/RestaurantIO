var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '',
    user: '',
    password: ''
});

connection.query('USE restaurantIO');

module.exports = function (passport) {

    //Serialize user into session using passport
    passport.serializeUser(function (user, done) {
        done(null, user.userId);
    });

    //Deserialize user using passport
    passport.deserializeUser(function (id, done) {
        connection.query(`select * from users where userId = ${id}`, function (err, rows) {
            done(err, rows[0]);
        });
    });

    //Handles sign up functionality
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            connection.query(`select * from users where userEmail = "${email}"`, function (err, rows) {
                if (err)
                    return done(err);
                else if (rows.length)
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                else {
                    var firstName = req.body.firstName;
                    var lastName = req.body.lastName;
                    var securityQuestion = req.body.securityQuestion;
                    var securityAnswer = req.body.securityAnswer;
                    var restaurantId = req.body.restaurantId;
                    var isAdmin = req.body.isAdmin;

                    var newUserMysql = new Object();
                    newUserMysql.email = email;
                    newUserMysql.password = password;

                    //If user is an admin, create restaurant record and an admin account
                    if (isAdmin === '1') {
                        var restaurantName = req.body.restaurantName;
                        var restaurantQuery = `INSERT INTO restaurants(restaurantName) values ("${restaurantName}")`;

                        connection.query(restaurantQuery, function (err, rows) {
                            if (err) {
                                return done(err);
                            }
                            else {
                                connection.query(`select max(restaurantId) as restaurantId from restaurants`, function (err, rows) {
                                    if (err) {
                                        return done(err);
                                    }

                                    var insertQuery = `INSERT INTO users (userFirstName,userLastName,userEmail,userPassword,userSecretQuestion,userSecretAnswer,userIsAdmin,RestaurantId)`;
                                    insertQuery += `values ("${firstName}","${lastName}","${email}","${password}","${securityQuestion}","${securityAnswer}","${isAdmin}","${rows[0].restaurantId}")`;

                                    connection.query(insertQuery, function (err, rows) {
                                        if (err) {
                                            return done(err);
                                        }
                                        newUserMysql.userId = rows.insertId;
                                        return done(null, newUserMysql);
                                    });
                                });
                            }
                        });
                    }
                    else {
                        //If signup is a regular user, create user account attached to a restaurant
                        var insertQuery = `INSERT INTO users (userFirstName,userLastName,userEmail,userPassword,userSecretQuestion,userSecretAnswer,userIsAdmin,RestaurantId)`;
                        insertQuery += `values ("${firstName}","${lastName}","${email}","${password}","${securityQuestion}","${securityAnswer}","${isAdmin}","${restaurantId}")`;
                        connection.query(insertQuery, function (err, rows) {
                            if (err) {
                                return done(err);
                            }
                            newUserMysql.userId = rows.insertId;
                            return done(null, newUserMysql);
                        });
                    }
                }
            });
        }));

    //Handles login functionality
    passport.use('local-login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            connection.query(`SELECT * FROM users WHERE userEmail = "${email}"`, function (err, rows) {
                if (err) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong email/password.'));
                }
                else if ((!rows.length) || !(rows[0].userPassword == password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong email/password.'));
                }

                //Success
                return done(null, rows[0]);
            });
        }
    ));
};