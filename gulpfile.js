const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const sourcemaps = require("gulp-sourcemaps");
const svgSrite = require("gulp-svg-sprite");
const imagemin = require("gulp-imagemin");
const { version } = require("os");
const fs = require("fs");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");

const paths = {
  styles: {
    src: "src/styles/**/*.scss",
    dest: "src/css/",
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "src/js/",
  },
  html: {
    src: "src/**/*.html",
  },
  image: {
    src: "src/img/**/*.*",
    dest: "dist/img",
  },
  svg: {
    src: "src/svg/**/*.svg",
    dest: "src/img/",
  },
  fonts: {
    src: "src/fonts/",
    dest: "src/fonts/",
  },
};

function fontsOtfToTtf() {
  return src(paths.fonts.src)
    .pipe(fonter({ formats: ["ttf"] }))
    .pipe(src(paths.fonts.src));
}

function fontsTtfToWoff() {
  return src(paths.fonts.src)
    .pipe(fonter({ formats: ["woff"] }))
    .pipe(src(paths.fonts.dest));
}

function styles() {
  // Импортирует сжатую версию в CSS
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"] }))
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Импортирует сжатую версию в JS
function scripts() {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("../maps"))
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// таск для просмотра исходника проекта
function browsersync() {
  browserSync.init({
    server: {
      baseDir: "src/",
    },
  });
}

// таск для просмотра готового проекта
function browsersyncDist() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
  });
}

// удаление папки с дистрибутивом
function cleanDist() {
  return src("dist").pipe(clean());
}

// копирование сжатых итоговых файлов в папку дистрибутива
function building() {
  return src(
    [
      "src/css/style.min.css",
      "src/js/script.min.js",
      paths.html.src,
      paths.image.src,
    ],
    {
      base: "src",
    }
  ).pipe(dest("dist"));
}

// сжатие и копирование изображений в конечную папку с дистрибутивом
function images() {
  return src(paths.image.src)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(dest(paths.image.dest));
}

// создание спрайтов в папку img в папке с исходниками
function svgSprites() {
  return src(paths.svg.src)
    .pipe(
      svgSrite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest(paths.svg.dest));
}

// Таск для отслеживания изменений в файлах проекта
function watching() {
  watch([paths.styles.src], styles);
  watch([paths.scripts.src, "!app/js/*min.js"], scripts);
  watch([paths.html.src]).on("change", browserSync.reload);
  watch([paths.image.src], images);
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.images = images;
exports.svgSprites = svgSprites;
exports.fontsOtfToTtf = fontsOtfToTtf;
exports.fontsTtfToWoff = fontsTtfToWoff;

exports.build = series(cleanDist, building, images);

exports.default = parallel(styles, scripts, svgSprites, browsersync, watching);

exports.dist = browsersyncDist;
