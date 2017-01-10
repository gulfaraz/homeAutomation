var gulp = require("gulp");
var plugin = require("gulp-load-plugins")();

gulp.task("hint", function() {
    return gulp.src([ "espruino.js", "firmware.js" ])
        .pipe(plugin.jshint({ multistr: true, laxcomma: true, esversion: 6 }))
        .pipe(plugin.jshint.reporter("default"));
});

gulp.task("script", [ "hint" ], function() {
    return gulp.src("espruino.js")
        .pipe(plugin.babel({ presets: ["es2015"] }))
        .pipe(plugin.uglify().on("error", plugin.util.log))
        .pipe(gulp.dest("../../../iot/projects"))
        .pipe(plugin.rename("espruino.min.js"))
        .pipe(gulp.dest("."));
});

gulp.task("firmwareScript", [ "hint" ], function() {
    return gulp.src("firmware.js")
        .pipe(plugin.babel({ presets: ["es2015"] }))
        .pipe(plugin.uglify().on("error", plugin.util.log))
        .pipe(plugin.rename("firmware.min.js"))
        .pipe(gulp.dest("../../server-rest/firmware"))
        .pipe(gulp.dest("."));
});

gulp.task("watch", ["build"], function() {
    gulp.watch("espruino.js", [ "script" ]);
    gulp.watch("firmware.js", [ "firmwareScript" ]);
});

gulp.task("build", [ "script", "firmwareScript" ], function () {
    console.log("Completed Build");
});

gulp.task("default", [ "watch" ]);

