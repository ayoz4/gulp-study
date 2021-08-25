// const gulp = require("gulp");
// const imagemin = require("gulp-imagemin");
// const uglify = require("gulp-uglify");
// const sass = require("gulp-sass")(require("sass"));

/*
    -- TOP LEVEL FUNCTIONS --
    gulp.task - Define task
    gulp.scr - Point tofiles to use
    gulp.dest - Points to folder to output
    gulp.watch - Watch files and folders for changes
*/

// gulp.task("message", function () {
//   return console.log("Gulp is running...");
// });

// // Copy all html files
// gulp.task("copyHtml", function () {
//   gulp.src("src/*.html").pipe(gulp.dest("dist"));
// });

// // Optimize images
// gulp.task("imageMin", function () {
//   gulp.src("src/images/*").pipe(imagemin()).pipe(gulp.dest("dist/images"));
// });

// gulp.task("minify", function () {
//   gulp.src("src/js/*.js").pipe(uglify()).pipe(gulp.dest("dist/js"));
// });

// gulp.task("sass", function () {
//   gulp
//     .src("src/sass/*.scss")
//     .pipe(sass().on("error", sass.logError))
//     .pipe(gulp.dest("dist/css"));
// });

// gulp.task("default", ["message", "copyHtml", "imageMin", "minify", "sass"]);

let preprocessos = "sass";

const { src, dest, parallel, series, watch } = require("gulp");
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");
const sass = require("gulp-sass")(require("sass"));
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");

const browserSync = require("browser-sync").create();

function browsersync() {
  browserSync.init({
    server: { baseDir: "src/" },
    notify: false,
    online: true,
  });
}

function scripts() {
  return src(["src/js/*.js"])
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

function startwatch() {
  watch(["src/**/*.js", "!src/**/*.min.js"], scripts);

  watch("src/" + preprocessos + "/*.scss", styles);

  watch("src/*.html", () => browserSync.reload);
}

function styles() {
  return src("src/" + preprocessos + "/*.scss")
    .pipe(eval(preprocessos)())
    .pipe(concat("app.min.css"))
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
    )
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest("dist/css/"))
    .pipe(browserSync.stream());
}

exports.browsersync = browsersync;

exports.scripts = scripts;

exports.styles = styles;

exports.default = parallel(styles, scripts, browsersync, startwatch);
