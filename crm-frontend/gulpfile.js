const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const soursemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const del = require('del');

const clean = () => {
    return del(['dist']);
};

const styleDev = () => {
    return src('src/styles/**/*.scss')
        .pipe(soursemaps.init())
        .pipe(concat('style.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(soursemaps.write())
        .pipe(dest('dist/style'))
        .pipe(browserSync.stream())
}

const fonts = () => {
    return src([
        'src/fonts/*.woff',
        'src/fonts/*.woff2'
    ])
        .pipe(dest('dist/fonts'))
};
const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
};

const scriptsDev = () => {
    return src([
        'src/js/**/*.js',
        'src/js/main.js'
    ])
        .pipe(soursemaps.init())
        .pipe(soursemaps.write())
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const scriptsProd = () => {
    return src([
        'src/js/comp/**/*.js',
        'src/js/main.js'
    ])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify({
            toplevel: true
        }).on('error', notify.onError()))
        .pipe(dest('dist'))
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        port: 8000,
    })
}

const images = () => {
    return src([
        'src/img/**/*.jpg',
        'src/img/**/*.jpeg',
        'src/img/**/*.png',
        'src/img/*.svg',
    ])
        .pipe(image())
        .pipe(dest('dist/img'));
};

watch('src/**/*.html', htmlMinify);
watch('src/js/**/*.js', scriptsDev);
watch('src/styles/**/*.scss', styleDev);

exports.default = series(clean, fonts, htmlMinify, scriptsDev, styleDev, images, watchFiles);
exports.dev = series(clean, fonts, fonts, htmlMinify, scriptsDev, styleDev, images, watchFiles);
exports.prod = series(clean, fonts, htmlMinify, scriptsProd, styleDev, images,);
