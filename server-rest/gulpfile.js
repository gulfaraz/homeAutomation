var gulp = require("gulp");

gulp.task("default", function () {

    var configuration = require("./configuration/" + process.env.ENVIRONMENT + ".js")();

    var mongoose = require("mongoose");
    var dbURI = configuration.database.scheme + "://" + configuration.database.domain + "/" + configuration.database.dbname;

    mongoose.connect(dbURI);

    mongoose.connection.on("connected", function () {
        console.log("Mongoose connected to database: " + dbURI);

        var express = require("express");
        var app = express();
        var bodyParser = require("body-parser");
        var cors = require("cors");

        var models = require("./models")();
        var auth = require("./auth")(models.User, configuration);

        var mqttServer = require("./mqtt")(configuration.mqtt);

        var modules = {
            "User" : require("./user")(),
            "Home" : require("./home")(models.Home, mqttServer),
            "Device" : require("./device")(models.Home)
        };

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

        (function () {
            process.on("SIGINT", terminationHandler);

            app.use(bodyParser.urlencoded({ "extended" : true }));
            app.use(bodyParser.json());
            app.use(cors());
            app.use(auth.passport.initialize());

            app.use(require("./routes/routes")(express, auth, modules));
            app.listen(8080);

            function terminationHandler() {
                console.log("PROCESS TERMINATED");
                console.log("Begin cleanup...");
                mqttServer.close(function () {
                    console.log("1. MQTT Server Closed");
                    mongoose.connection.close(function () {
                        console.log("2. Mongoose Connection Terminated");
                        process.exit(0);
                    });
                });
            }
        })();

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
    });

    mongoose.connection.on("error", function (err) {
        console.log("Mongoose connection error: " + err);
    });

    mongoose.connection.on("disconnected", function () {
        console.log("Mongoose database connection disconnected");
    });

}());
