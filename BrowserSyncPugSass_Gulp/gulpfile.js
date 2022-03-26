const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const pug = require('gulp-pug');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();

// Pug Task

function pugTask(){
  return src('src/pug/**/*.pug', { sourcemaps: true })
  .pipe(pug({
    pretty: true,
  }))
  .pipe(dest('dist', { sourcemaps: '.' }))
}

// Sass Task
function scssTask(){
  return src('src/css/**/*.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist/css', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask(){
  return src('src/js/**/*.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist/js', { sourcemaps: '.' }));
}

// Imagein Task

function imageminTask(){
  return src('src/img/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/img'))
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: './dist'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch(['src/pug/**/*.pug', 'src/css/**/*.scss', 'src/js/**/*.js', 'src/img/**/*'], series(pugTask, scssTask, jsTask, imageminTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  pugTask,
  scssTask,
  jsTask,
  imageminTask,
  browsersyncServe,
  watchTask
);