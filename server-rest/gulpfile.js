var gulp = require("gulp");

gulp.task("default", function () {
    var configuration = require("./configuration/" + process.env.ENVIRONMENT + ".js")();
    var express = require("express");
    var app = express();
    var bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({ "extended" : true }));
    app.use(bodyParser.json());
    var mongoose = require("mongoose");
    var dbURI = configuration.database.scheme + "://" + configuration.database.domain + "/" + configuration.database.dbname;
    mongoose.connect(dbURI);
    mongoose.connection.on("connected", function () {
        console.log("Mongoose connected to database: " + dbURI);
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
        "User" : require("./user")(models.Home),
        "Home" : require("./home")(models.Home)
    };
    app.use(require("./routes/routes")(express, auth, modules));
    app.listen(8080);
}());
