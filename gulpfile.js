var app,
    base,
    concat,
    directory,
    gulp,
    gutil,
    hostname,
    path,
    refresh,
    sass,
    uglify,
    imagemin,
    minifyCSS,
    del,
    browserSync,
    autoprefixer,
    gulpSequence,
    shell,
    sourceMaps,
    plumber;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

gulp = require('gulp');
gutil = require('gulp-util');
concat = require('gulp-concat');
uglify = require('gulp-uglify');
sass = require('gulp-sass');
sourceMaps = require('gulp-sourcemaps');
imagemin = require('gulp-imagemin');
minifyCSS = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell = require('gulp-shell');
plumber = require('gulp-plumber');

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: "www/"
        },
        options: {
            reloadDelay: 250
        },
        notify: true
    });
});

gulp.task('vendor', function(tmp) {
    gulp.src(['src/vendor/**'])
        .pipe(plumber())
        .pipe(gulp.dest('www/vendor'));
});

gulp.task('vendor-deploy', function(tmp) {
    gulp.src(['src/vendor/**'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/vendor'));
});

gulp.task('images', function(tmp) {
    gulp.src(['src/assets/images/**'])
        .pipe(plumber())
        .pipe(gulp.dest('www/images'));
});

gulp.task('images-deploy', function () {
    gulp.src(['src/assets/images/**/*', '!src/images/README'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('scripts', function () {
    return gulp.src(['src/scripts/*.js'])
        .pipe(plumber())
        .pipe(concat('app.js'))
        .on('error', gutil.log)
        .pipe(gulp.dest('www'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts-deploy', function () {
    return gulp.src(['src/scripts/*.js'])
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('styles', function () {
    return gulp.src('src/assets/scss/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourceMaps.init())
        .pipe(sass({ errLogToConsole: true }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        .on('error', gutil.log)
        .pipe(concat('styles.css'))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('www'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles-deploy', function () {
    return gulp.src('src/assets/scss/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('www'))
        .pipe(browserSync.reload({ stream: true }))
        .on('error', gutil.log);
});

gulp.task('html-deploy', function () {
    gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return shell.task([
        'rm -rf dist',
        'rm -rf www'
    ]);
});

gulp.task('default', ['browserSync', 'scripts', 'styles', 'html'], function () {
    gulp.watch('src/scripts/*.js', ['scripts']);
    gulp.watch('src/assets/scss/**', ['styles']);
    gulp.watch('src/*.html', ['html']);
});

gulp.task('deploy', gulpSequence('clean', ['vendor-deploy', 'scripts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));