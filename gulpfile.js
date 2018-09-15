const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

const path = {
    input: './src/scss/**/main.scss',
    output: './assets/css/',
    sourcemaps: './sourcemaps/'
};
const sassOptions = {
    outputStyle: 'compressed',
    errorLogToConsole: true
};
const autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('scss', () => {
    return gulp
        .src(path.input)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write(path.sourcemaps))
        .pipe(gulp.dest(path.output))
});

gulp.task('watch', () => {
    return gulp
        .watch(path.input, ['scss'])
        .on('change', (e) => {
            console.log(`File ${e.path} was ${e.type} running tasks!`);
        });
});

gulp.task('default', ['scss', 'watch']);
