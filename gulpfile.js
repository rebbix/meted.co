var gulp = require("gulp");
var plumber = require("gulp-plumber");


// For CSS
var postcss    = require('gulp-postcss');
var cleanCss   = require("gulp-clean-css");
var less       = require("gulp-less");
var concatCss  = require("gulp-concat-css");

gulp.task("process-style", () => gulp.src("src/**/*.less")
    .pipe(plumber())
    .pipe(less({}))
    .pipe(postcss([
      require("autoprefixer"),
      require('postcss-media-minmax')
    ]))
    .pipe(concatCss("style/main.css"))
    .pipe(cleanCss({compatibility: "ie10"}))
    .pipe(plumber.stop())
    .pipe(gulp.dest("./src/"))
);

gulp.task("watch", ["process-style"],() => {
  gulp.watch("src/**/*.less", ["process-style"]);
});
