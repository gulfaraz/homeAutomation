var gulp = require("gulp");
var plugin = require("gulp-load-plugins")();
var electron = require("electron-connect").server.create();

var config = {
    "lib": "lib",
    "src": "src",
    "dest": "build",
    "debug": !(process.env.APPLICATION_ENVIRONMENT === "production")
};

gulp.task("hint", function() {
    return gulp.src([config.src + "/**/*.js"])
        .pipe(plugin.jshint({ multistr: true, laxcomma: true }))
        .pipe(plugin.jshint.reporter("default"));
});

gulp.task("sass", function() {
    return gulp.src([
            config.lib + "/Materialize/dist/css/materialize.css",
            config.src + "/home/stylesheets/variables.scss",
            config.src + "/home/stylesheets/mixins.scss",
            config.src + "/**/*.scss"
        ])
        .pipe(plugin.if(config.debug, plugin.sourcemaps.init()))
        .pipe(plugin.concat("styles.css"))
        .pipe(plugin.sass())
        .pipe(plugin.autoprefixer({
            "browsers": ["last 2 versions"],
            "cascade": false
        }))
        .pipe(plugin.cleanCss())
        .pipe(plugin.if(config.debug, plugin.sourcemaps.write()))
        .pipe(gulp.dest(config.dest + "/stylesheets"))
        .pipe(plugin.if(config.debug, plugin.livereload()));
});

gulp.task("markup", function() {
    return gulp.src([config.src + "/**/*.html"])
        .pipe(plugin.flatten())
        .pipe(gulp.dest(config.dest + "/html"))
        .pipe(plugin.if(config.debug, plugin.livereload()));
});

gulp.task("images", function() {
    return gulp.src([
            config.src + "/**/*.{png,ico,jpg}"
        ])
        .pipe(plugin.flatten())
        .pipe(gulp.dest(config.dest + "/images/"))
        .pipe(plugin.if(config.debug, plugin.livereload()));
});

gulp.task("libraryScripts", function() {
    return gulp.src([
            config.lib + "/angular/angular.js",
            config.lib + "/angular-ui-router/release/angular-ui-router.js",
            config.lib + "/Materialize/dist/js/materialize.js"
        ])
        .pipe(plugin.concat("libraries.js"))
        .pipe(plugin.uglify().on("error", plugin.util.log))
        .pipe(gulp.dest(config.dest + "/javascripts"))
        .pipe(plugin.if(config.debug, plugin.livereload()));
});

gulp.task("applicationScripts", [ "hint" ], function() {
    return gulp.src([
            config.src + "/home/home.js",
            config.src + "/*.js",
            config.src + "/**/*.js"
        ])
        .pipe(plugin.if(config.debug, plugin.sourcemaps.init()))
        .pipe(plugin.concat("scripts.js"))
        .pipe(plugin.uglify().on("error", plugin.util.log))
        .pipe(plugin.if(config.debug, plugin.sourcemaps.write()))
        .pipe(gulp.dest(config.dest + "/javascripts"))
        .pipe(plugin.if(config.debug, plugin.livereload()));
});

gulp.task("watch", ["build"], function() {
    plugin.livereload.listen();
    gulp.watch(config.src + "/**/*.js", [ "hint", "applicationScripts" ]);
    gulp.watch(config.src + "/**/*.scss", [ "sass" ]);
    gulp.watch([config.src + "/**/*.html"], [ "markup" ]);
});

gulp.task("build", [ "markup", "images", "sass", "libraryScripts", "applicationScripts" ], function () {
    console.log("Completed UI Build");
});

gulp.task("serve", [ "watch" ], function () {
    electron.start();
    gulp.watch("main.js", electron.restart);
    gulp.watch("./build/**/*.{js,html,scss}", electron.reload);
});

gulp.task("default", [ "serve" ]);
