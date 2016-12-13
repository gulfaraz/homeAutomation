var gulp = require("gulp");
var plugin = require("gulp-load-plugins")();

gulp.task("hint", function() {
    return gulp.src("espruino.js")
        .pipe(plugin.jshint({ multistr: true, laxcomma: true }))
        .pipe(plugin.jshint.reporter("default"));
});

gulp.task("script", [ "hint" ], function() {
    return gulp.src("espruino.js")
        .pipe(plugin.uglify().on("error", plugin.util.log))
        .pipe(gulp.dest("../../../iot/projects"))
        .pipe(plugin.rename("espruino.min.js"))
        .pipe(gulp.dest("."));
});

gulp.task("watch", ["build"], function() {
    gulp.watch("espruino.js", [ "script" ]);
});

gulp.task("build", [ "script" ], function () {
    console.log("Completed Build");
});

gulp.task("default", [ "watch" ]);

