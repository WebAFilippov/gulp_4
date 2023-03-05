const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();

function styles() {
  return src("./app/scss/style.scss")
    .pipe(concat("style.min.css"))
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"] }))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(["./app/js/main.js"])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function images() {
  return src("./app/images/**/*.*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("app/images"))
    .pipe(browserSync.stream());
}

function fonts() {
  return src("./app/fonts/**/*.*")
    .pipe(dest("app/fonts"))
    .pipe(browserSync.stream());
}

function watching() {
  watch(["app/js/main.js"], scripts);
  watch(["app/scss/style.scss"], styles);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function text() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

function cleanDist() {
  return src("dist").pipe(clean());
}

function building() {
  return src(
    [
      "./app/css/style.min.css",
      "./app/js/main.min.js",
      "./app/images/**/*.*",
      "./app/**/*.html",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist"));
}

exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.watching = watching;
exports.browsersync = text;

exports.build = series(cleanDist, building);
exports.default = parallel(
  styles,
  scripts,
  images,
  fonts,
  watching,
  text
);
