'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const glob = require('gulp-sass-glob');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const plugins = require('gulp-load-plugins');
const gutil = require('gulp-util');
const yargs = require('yargs');
const rimraf = require('rimraf');
const yaml = require('js-yaml');
const fs = require('fs');
const dateFormat = require('dateformat');
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');
const named = require('vinyl-named');
const autoprefixer = require('autoprefixer');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

const browser = require('browser-sync').create();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Check for --development flag unminified with sourcemaps
const DEV = !!(yargs.argv.dev);

// Load settings from settings.yml
const {BROWSERSYNC, COMPATIBILITY, REVISIONING, PATHS} = loadConfig();

// Check if file exists synchronously
function checkFileExists(filepath) {
    let flag = true;
    try {
        fs.accessSync(filepath, fs.F_OK);
    } catch (e) {
        flag = false;
    }
    return flag;
}

// Load default or custom YML config file
function loadConfig() {
    gutil.log('Loading config file...');

    if (checkFileExists('config.yml')) {
        // config.yml exists, load it
        gutil.log(gutil.colors.cyan('config.yml'), 'exists, loading', gutil.colors.cyan('config.yml'));
        let ymlFile = fs.readFileSync('config.yml', 'utf8');
        return yaml.load(ymlFile);

    } else if (checkFileExists('config-default.yml')) {
        // config-default.yml exists, load it
        gutil.log(gutil.colors.cyan('config.yml'), 'does not exist, loading', gutil.colors.cyan('config-default.yml'));
        let ymlFile = fs.readFileSync('config-default.yml', 'utf8');
        return yaml.load(ymlFile);

    } else {
        // Exit if config.yml & config-default.yml do not exist
        gutil.log('Exiting process, no config file exists.');
        gutil.log('Error Code:', err.code);
        process.exit(1);
    }
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
    gulp.series(clean, css, scripts, node_images, images, fonts, js, copy));

// Build the site, run the server, and watch for file changes
gulp.task('default',
    gulp.series('build', server, watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
    rimraf(PATHS.dist, done);
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
    return gulp.src(PATHS.assets)
        .pipe(gulp.dest(PATHS.dist + '/assets'));
}

// Compile Sass into CSS
// In production, the CSS is compressed
function css() {
    return gulp.src('src/assets/scss/app.scss')
        .pipe(glob())
        .pipe(plumber({
            errorHandler: function (error) {
                notify.onError({
                    title: "Gulp css processing",
                    subtitle: "Failure!",
                    message: "Error: <%= error.message %>"
                })(error);
                this.emit('end');
            }
        }))
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass({
            includePaths: PATHS.sass
        }))
        .pipe(gulpif(PRODUCTION, cleanCss({level: 2})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(gulp.dest(PATHS.dist + '/assets/css'))
        .pipe(browser.stream({match: '**/*.css'}));
}

let webpackConfig = {
    module: {
        rules: [
            {
                test: /.js$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    },
    externals: {
        jquery: 'jQuery'
    }
}
// Combine JavaScript into one file
// In production, the file is minified
function scripts() {
    return gulp.src(PATHS.entries)
        .pipe(plumber({
            errorHandler: function (error) {
                notify.onError({
                    title: 'Gulp scripts processing',
                    subtitle: 'Failure!',
                    message: 'Error: <%= error.message %>'
                })(error);
                this.emit('end');
            }
        }))
        .pipe(named())
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(webpackStream(webpackConfig, webpack2))
        .pipe(gulpif(PRODUCTION, uglify()
            .on('error', e => {console.log(e);
            })
        ))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe( gulp.dest(PATHS.dist + '/assets/js'));
}

// Copy images to the "dist" folder
// In production, the images are compressed
function node_images() {
    return gulp.src(PATHS.img)
        .pipe(gulp.dest('src/assets/img/'));
}

function images() {
    return gulp.src('src/assets/img/**/*')
        .pipe(gulpif(PRODUCTION, imagemin({progressive: true})))
        .pipe(gulp.dest(PATHS.dist + '/assets/img'));
}

// Copy fonts
function fonts() {
    return gulp.src(PATHS.fonts)
        .pipe(gulp.dest(PATHS.dist + '/assets/fonts'));
}

// Copy JS
function js() {
    return gulp.src(PATHS.js)
        .pipe(gulpif(PRODUCTION, uglify().on('error', e => {console.log(e);
            })
        ))
        .pipe(gulp.dest(PATHS.dist + '/assets/js'));
}

// Start BrowserSync to preview the site in
function server(done) {
    browser.init({
        proxy: BROWSERSYNC.url,
        ui: {
            port: 8080
        },
        open: false,
        injectChanges: true,
        https: true,
        cors: true
    });
    done();
}

// Reload the browser with BrowserSync
function reload(done) {
    browser.reload();
    done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
    gulp.watch(PATHS.assets, copy);
    gulp.watch('src/assets/scss/**/*.scss').on('all', css);
    gulp.watch('src/assets/js/**/*.js').on('all', gulp.series(scripts, browser.reload));
    gulp.watch('src/assets/img/**/*').on('all', gulp.series(images, browser.reload));
    gulp.watch('../../../../app/design/**/*').on('all', browser.reload);
}
