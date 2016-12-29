var gulp = require('gulp');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');
 
gulp.task('default', function () {
    return gulp.src('cncnet/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            target: 'ES5',
            out: 'cncnet-twitch-app.js'
        }))
        .pipe(gulp.dest('example/'));
});

gulp.task('watch', function () {
    return watch('cncnet/**/*.ts', { ignoreInitial: false })
        .pipe(ts({
            noImplicitAny: true,
            target: 'ES5',
            out: 'cncnet-twitch-app.js'
        }))
        .pipe(gulp.dest('example/'));
});