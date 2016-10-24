var gulp = require("gulp");

gulp.task("default", function () {
    var configuration = require("./configuration/" + process.env.ENVIRONMENT + ".js")();

    var express = require("express");
    var app = express();
    var bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({ "extended" : true }));
    app.use(bodyParser.json());
    var cors = require("cors");
    app.use(cors());

    var mongoose = require("mongoose");
    var dbURI = configuration.database.scheme + "://" + configuration.database.domain + "/" + configuration.database.dbname;

    mongoose.connect(dbURI);
    mongoose.connection.on("connected", function () {
        console.log("Mongoose connected to database: " + dbURI);
        checkIfUserExists(function (err, users) {
            console.log("Checking if user exists:");
            if(err) {
                console.log("Unable to fetch users");
            } else {
                console.log(users.length + " Users Found");
                if(users.length < 1) {
                    createDefaultUser(function (err, newUser) {
                        console.log("Creating default user");
                        if(err) {
                            console.log("Failed to create default user");
                        } else {
                            console.log("Successfully created default user");
                            console.log(newUser);
                        }
                    });
                }
            }
        });
    });

    mongoose.connection.on("error", function (err) {
        console.log("Mongoose connection error: " + err);
    });

    mongoose.connection.on("disconnected", function () {
        console.log("Mongoose database connection disconnected");
    });

    process.on("SIGINT", function () {
        mongoose.connection.close(function () {
            console.log("Mongoose database connection disconnected because process terminated");
            process.exit(0);
        });
    });

    var models = require("./models")();
    var auth = require("./auth")(models.User, configuration);
    app.use(auth.passport.initialize());

    var modules = {
        "User" : require("./user")(),
        "Home" : require("./home")(models.Home)
    };
    app.use(require("./routes/routes")(express, auth, modules));
    app.listen(8080);

    function checkIfUserExists(callback) {
        models.User.find().exec(callback);
    }

    function createDefaultUser(callback) {
        var newUser = new models.User();
        newUser.userName = "gulfaraz";
        newUser.password = "pass";
        newUser.status = "active";
        newUser.mail = "gulfarazyasin@gmail.com";
        newUser.save(callback);
    }

}());
